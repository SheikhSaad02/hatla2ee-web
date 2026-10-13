import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { defaultLocale } from './configs';
import configs from './configs';
import { pathsWithoutLocalePrefix, BASE_URL } from './constants';
import { handleTenantAccess } from './configs/routes';
import { isProtectedRoute } from './configs/protectedRoutes';
import { handleMiddlewareCityRedirects } from './configs/cityRedirects';
import LinkHeader from 'http-link-header';
import { getNewRelicApi } from './newrelic-global';

const intlMiddleware = createMiddleware(routing);
const defaultPathname = `/${defaultLocale}`;
const LOCALES = configs?.locales?.map((data) => data?.value);
const localeRegex = LOCALES.join('|');

const parseLocaleFromPathname = (pathname) => {
  const [, firstSegment, ...rest] = pathname.split('/');
  const hasLocale = LOCALES.includes(firstSegment);
  return {
    locale: hasLocale ? firstSegment : defaultLocale,
    pathWithoutLocale: hasLocale ? `/${rest.join('/')}` : pathname,
  };
};

function isShowroomLocaleMatch(pathname) {
  const showroomLocaleMatch = pathname.match(
    new RegExp(
      `^/showroom/([^/]+)/(${localeRegex})(?:/(?!${localeRegex}$)([^/]+))?$`,
    ),
  );
  return showroomLocaleMatch;
}

function handleDuplicateLocaleRedirect(request) {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(
    new RegExp(
      `^/(${localeRegex})/showroom/([^/]+)/(${localeRegex})(?:/(.*))?$`,
    ),
  );
  if (!match) return null;
  const [, prefixLocale, slug, suffixLocale, rest] = match;
  const finalLocale =
    prefixLocale !== suffixLocale ? prefixLocale : suffixLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/showroom/${slug}/${finalLocale}${rest ? `/${rest}` : ''}`;
  return NextResponse.redirect(url, 301);
}

function addHomepageLinkHeaders(request) {
  const url = request.nextUrl.clone();
  url.pathname = defaultPathname;
  const response = NextResponse.rewrite(url);

  // Add link headers for alternate locales on homepage
  const link = new LinkHeader();
  LOCALES.forEach((locale) => {
    // For default locale, use / instead of /ar
    const localePath = locale === defaultLocale ? '/' : `/${locale}`;
    const localeUrl = `${BASE_URL}${localePath}`;
    link.set({
      rel: 'alternate',
      uri: localeUrl,
      hreflang: locale,
    });
  });

  // Add x-default pointing to / (default locale without prefix)
  link.set({
    rel: 'alternate',
    uri: `${BASE_URL}/`,
    hreflang: 'x-default',
  });

  response.headers.set('link', link.toString());

  return response;
}

function processLinkHeaders(response, pathname) {
  const linkHeader = response.headers.get('link');
  if (!linkHeader) return;

  const link = LinkHeader.parse(linkHeader);

  // Only strip /ar from links if we're on /en homepage specifically
  if (pathname === '/en') {
    link.refs = link.refs.map((ref) => {
      const url = new URL(ref.uri);

      // Remove default locale prefix from URLs (e.g., /ar -> /)
      if (url.pathname === `/${defaultLocale}`) {
        url.pathname = '/';
      }

      ref.uri = url.toString();
      return ref;
    });
  } else {
    // For all other pages, just fix x-default if needed
    link.refs = link.refs.map((ref) => {
      if (ref.hreflang === 'x-default') {
        const url = new URL(ref.uri);
        if (!url.pathname.startsWith(`/${defaultLocale}`)) {
          url.pathname = `/${defaultLocale}${url.pathname}`;
        }
        ref.uri = url.toString();
      }
      return ref;
    });
  }

  response.headers.set('link', link.toString());
}

function handleProtectedRoute(request, pathname) {
  const { locale, pathWithoutLocale } = parseLocaleFromPathname(pathname);
  if (!isProtectedRoute(pathWithoutLocale)) return null;

  const hasSession =
    request.cookies.has(configs.authToken) ||
    request.cookies.has(configs.legacyAuthToken);
  if (hasSession) return null;

  const returnPath = `${pathWithoutLocale}${request.nextUrl.search}`;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/login`;
  url.search = `?redirectUrl=${encodeURIComponent(returnPath)}`;
  return NextResponse.redirect(url);
}

export function proxy(request) {
  // Next.js traces its routing step (which runs this proxy) as a separate
  // request with no route, so New Relic would record every page twice, the
  // extra one named by raw URL. Drop that one; the page render is kept.
  getNewRelicApi()?.getTransaction().ignore();

  const pathname = request.nextUrl.pathname;
  const tenantResponse = handleTenantAccess(request, pathname);
  if (tenantResponse) return tenantResponse;

  const protectedRedirect = handleProtectedRoute(request, pathname);
  if (protectedRedirect) return protectedRedirect;

  // Handle city redirects that need to go through middleware (e.g., those with special characters like '+')
  // Matches all route patterns: base, pagination, body types, makes, models, etc.
  // Handles paths with or without locale prefix (e.g., /car/city/faiyum or /ar/car/city/faiyum)
  const middlewareRedirect = handleMiddlewareCityRedirects(
    pathname,
    NextResponse.redirect,
    () => request.nextUrl.clone(),
  );
  if (middlewareRedirect) return middlewareRedirect;

  //Skip setting x-pathname header for API routes, assets, and other non-page routes
  const shouldSkipHeader =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/trpc/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.startsWith('/.well-known/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/ads.txt' ||
    pathname === '/app-ads.txt';

  const showroomLocaleMatch = isShowroomLocaleMatch(pathname);
  const prefixPathMatch = Object.keys(pathsWithoutLocalePrefix).find(
    (key) => pathname === `/${key}` || pathname.startsWith(`/${key}/`),
  );

  const duplicateRedirect = handleDuplicateLocaleRedirect(request);
  if (duplicateRedirect) return duplicateRedirect;

  if (showroomLocaleMatch) {
    const [, name, locale, slug] = showroomLocaleMatch;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/showroom/${name}${slug ? `/${slug}` : ''}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-next-intl-locale', locale);
    // Only set x-pathname header for page routes.
    if (!shouldSkipHeader) {
      response.headers.set('x-pathname', url.pathname);
    }

    return response;
  }

  if (pathname === defaultPathname) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 301);
  }

  if (pathname === '/') {
    const response = addHomepageLinkHeaders(request);

    // Set x-pathname header for canonical URL generation
    if (!shouldSkipHeader) {
      response.headers.set('x-pathname', pathname);
    }

    return response;
  }

  if (prefixPathMatch) {
    const targetPath = pathsWithoutLocalePrefix[prefixPathMatch];
    const newPath = pathname.replace(`/${prefixPathMatch}`, targetPath);
    const destination = new URL(
      newPath + request.nextUrl.search + request.nextUrl.hash,
      request.url,
    );

    const response = NextResponse.rewrite(destination);

    // Only set x-pathname header for page routes
    if (!shouldSkipHeader) {
      response.headers.set('x-pathname', pathname);
    }

    return response;
  }

  const response = intlMiddleware(request);

  // Process link headers for alternate locales
  processLinkHeaders(response, pathname);

  // Add pathname to headers for canonical URL generation (only for page routes)
  if (response && !shouldSkipHeader) {
    response.headers.set('x-pathname', pathname);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|assets|trpc|_next|_vercel|favicon.ico|robots.txt|llms.txt|ads.txt|app-ads.txt|health|serviceworker.js|\\.well-known).*)',
  ],
};
