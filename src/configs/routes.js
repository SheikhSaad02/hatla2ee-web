// tenantAccess.js
import { NextResponse } from 'next/server';
import configs from '.';

export const TENANT_ROUTES = configs?.ROUTES;

const LOCALES = configs?.locales?.map((data) => data?.value);
const localeRegex = LOCALES.join('|');

// -------------------------
// Helpers
// -------------------------
function matchRoute(routePattern, path) {
  if (routePattern.endsWith('/*')) {
    const base = routePattern.slice(0, -2);
    return path === base || path.startsWith(base + '/');
  }
  return routePattern === path;
}

function isBlocked(blockedRoutes, path) {
  return blockedRoutes.some((route) => matchRoute(route, path));
}

function isAllowed(allowedRoutes, path) {
  return allowedRoutes.some((route) => matchRoute(route, path));
}

// -------------------------
// Main route access check
// -------------------------
function isRouteAllowedForTenant(pathname) {
  const tenantConfig = TENANT_ROUTES || {};
  const allowedRoutes = tenantConfig.allow || [];
  const blockedRoutes = tenantConfig.block || [];

  // Strip locale prefix (/en/new-car -> /new-car)
  const pathWithoutLocale = pathname.replace(
    new RegExp(`^/(${localeRegex})`),
    '',
  );
  const cleanPath = pathWithoutLocale || '/';

  // If globally blocked → deny
  if (isBlocked(blockedRoutes, cleanPath)) {
    return false;
  }

  // If full access (*) → allow unless blocked
  if (allowedRoutes.includes('*')) {
    return true;
  }

  // Otherwise → check allowlist
  return isAllowed(allowedRoutes, cleanPath);
}

// -------------------------
// Exported handler
// -------------------------
export function handleTenantAccess(request, pathname) {
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.includes('/health') ||
    pathname.includes('.') ||
    pathname.includes('404') ||
    pathname.includes('500')
  ) {
    return null; // Skip tenant checks for system paths
  }

  if (!isRouteAllowedForTenant(pathname)) {
    const localeMatch = pathname.match(new RegExp(`^/(${localeRegex})`));
    const locale = localeMatch?.[1];
    const fallbackPath = `${locale}/404`;

    const url = request.nextUrl.clone();
    url.pathname = fallbackPath;
    return NextResponse.redirect(url);
  }

  return null; // Access allowed
}
