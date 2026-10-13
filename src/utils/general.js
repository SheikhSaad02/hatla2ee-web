import { cache } from 'react';

import configs, { defaultLocale, isSectionEnabled } from '@/configs';
import { APP_SCHEME, BASE_URL, CDN_ASSETS_PATH, CDN_PATH } from '@/constants';

import { translations } from '@/data/tFunctionTranslation';
import { getYearRange } from './date';

export const isMobile = (
  userAgent = navigator?.userAgent || navigator?.vendor || window?.opera,
) => {
  if (
    /com\.hatla2ee/.test(userAgent) ||
    /hatla2ee\.hatla2ee_egypt/.test(userAgent)
  ) {
    return true;
  } else if (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
      userAgent,
    ) ||
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      userAgent,
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      userAgent.substr(0, 4),
    )
  ) {
    return true;
  } else {
    return false;
  }
};

export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const isAndroid = () => {
  const isAndroid = /Android/i.test(navigator.userAgent);
  return !!isAndroid;
};

export const isServer = () => typeof window === 'undefined';

export const getLocaleFromUrl = () => {
  if (typeof window === 'undefined') return 'en';

  const path = window.location.pathname;
  const locale = path.split('/')[1];

  return locale === 'en' ? 'en' : 'ar';
};

export const getLocaleString = (data, key = 'label', _locale, t = null) => {
  if (data) {
    try {
      if (typeof data === 'string') return data;
      const locale = _locale || getLocaleFromUrl();

      if (!data?.[`${key}_l1`] && t) {
        return t(data?.[key]);
      }

      if (locale === 'en' && data?.[key]) {
        return data[key];
      }

      if (locale === 'ar' && data?.[`${key}_l1`]) {
        return data[`${key}_l1`];
      }

      return data?.[key]
        ? data?.[key]
        : data?.[`${key}_l1`]
          ? data[`${key}_l1`]
          : null;
    } catch (error) {
      return '';
    }
  }
};

export const createLocaleStringGetter = (_locale) => {
  return (data, key, t) => getLocaleString(data, key, _locale, t);
};

export const getLocaleDirectionInfo = (locale = 'en') => {
  const foundLocale = configs.locales.find(
    (_locale) => _locale.value === locale,
  );
  const rtl = foundLocale?.rtl || false;
  return {
    rtl,
    direction: rtl ? 'rtl' : 'ltr',
  };
};

export const isRtl = (locale = 'en') => getLocaleDirectionInfo(locale).rtl;

export const getDirection = (locale = 'en') =>
  getLocaleDirectionInfo(locale).direction;

export function getLocalizedPathname(
  pathname,
  locale = defaultLocale,
  appendDefaultLocale = true,
) {
  if (locale === defaultLocale && !appendDefaultLocale) {
    return pathname;
  }

  return `/${locale}${pathname}`;
}

export function getPathToRedirect(user, path) {
  if (user) {
    return path;
  }
  return `/login?redirectUrl=${path}`;
}

export const capitalizeFirstLetter = (str) => {
  try {
    return str ? str?.charAt(0)?.toUpperCase() + str?.slice(1) : '';
  } catch (error) {
    return '';
  }
};
export const transformImages = (images) => {
  if (Array.isArray(images)) {
    const transformedImages = images
      ?.map((image) => {
        if (!image) return null;

        if (image.sizes) {
          const { sizes, ...rest } = image;
          return {
            ...rest,
            ...sizes,
          };
        }

        return image;
      })
      .filter(Boolean);

    return transformedImages.sort((a, b) => {
      const aMain = a.main === 1 ? 0 : 1;
      const bMain = b.main === 1 ? 0 : 1;
      return aMain - bMain;
    });
  }

  if (images && typeof images === 'object') {
    if (images.sizes) {
      const { sizes, ...rest } = images;
      return [
        {
          ...rest,
          ...sizes,
        },
      ];
    }
    return [images];
  }

  return [];
};

export const extractImageUrls = (images, size = 'medium') => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((img) => img?.[size]);
};

export const getHatla2eeSubDomain = () => {
  const hatla2eeUrl = 'hatla2ee-staging';
  return hatla2eeUrl;
};

export function convertQueryObjToString(queryObj = {}) {
  const queryString = Object.entries(queryObj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map(
            (val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`,
          )
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return queryString ? `?${queryString}` : '';
}

export const getPaginationMeta = ({
  totalCount,
  pageSize,
  currentPage = 1,
}) => {
  const totalPageCount = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPageCount;
  const hasPrevPage = currentPage > 1;

  return {
    totalPageCount,
    hasNextPage,
    hasPrevPage,
    totalCount,
    pageSize,
    currentPage,
  };
};

export function removeDoubleQuotes(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/"/g, '');
}

export const getListingTitleByLevel = (
  obj,
  level,
  locale,
  addShapeToTitle,
  options = {},
) => {
  if (!obj) return '';

  const defaultOrder = {
    make: ['make'],
    model: ['make', 'model'],
    year: ['make', 'model', 'year'],
    variant: ['make', 'model', 'year', 'variant'],
  };

  const order = options.order || defaultOrder[level] || [];
  const t = options.t;

  const components = {
    make: () => getLocaleString(obj?.make, 'label', locale),
    model: () => getLocaleString(obj?.model, 'label', locale),
    year: () => (obj?.year ? obj.year.toString() : ''),
    ...(addShapeToTitle && {
      shape: () => getLocaleString(obj?.shape, 'label', locale),
    }),
    variant: () => getLocaleString(obj?.variant, 'label', locale),
    imported: () => getLocaleString({ label: 'Imported' }, 'label', locale, t),
  };

  const titleParts = [];

  for (const component of order) {
    if (components[component]) {
      const value = components[component]();
      if (value) {
        titleParts.push(value);
      }
    }
  }

  return titleParts.join(' ');
};

export const convertToEmbedLinks = (videos) => {
  if (!videos) return [];

  const processVideo = (video) => {
    const urlObj = new URL(video?.link);
    const videoId = urlObj.searchParams.get('v');
    let embedLink = `https://www.youtube.com/embed/${videoId}`;

    return {
      ...video,
      link: embedLink,
    };
  };

  if (Array.isArray(videos)) {
    return videos.map(processVideo);
  }

  return [processVideo(videos)];
};
export const getPriceLinks = (t) => {
  const priceLinks = [
    {
      key: 'used-car-prices',
      label: t('Used Car Prices'),
      link: '/car/used-prices',
      type: 'always',
    },
    {
      key: 'new-car-prices',
      label: t('new_car_prices', {
        yearRange: getYearRange(),
      }),
      link: '/car/all-prices',
      type: 'always',
    },
  ];
  return priceLinks;
};

export function slugToTitle(slug) {
  return slug
    ?.split('-')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join(' ');
}

export const isNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const decodeHTMLEntities = (text) => {
  const entityMap = {
    '&nbsp;': '\u00A0',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&cent;': '¢',
    '&pound;': '£',
    '&yen;': '¥',
    '&euro;': '€',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&laquo;': '«',
    '&raquo;': '»',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&bull;': '•',
    '&lrm;': '\u200E',
    '&rlm;': '\u200F',
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    if (entityMap[entity]) {
      return entityMap[entity];
    }

    if (entity.startsWith('&#')) {
      const isHex = entity.startsWith('&#x');
      const numStr = entity.slice(isHex ? 3 : 2, -1);
      const num = parseInt(numStr, isHex ? 16 : 10);
      if (!isNaN(num)) {
        return String.fromCharCode(num);
      }
    }

    return entity;
  });
};

export function getDeviceOS() {
  if (typeof window === 'undefined') {
    return { os: 'web', deviceType: 'desktop' };
  }

  const ua = (
    navigator.userAgent ||
    navigator.vendor ||
    window.opera
  ).toLowerCase();

  if (/ipad|iphone|ipod/.test(ua) && !window.MSStream) {
    return { os: 'ios', deviceType: 'mobile' };
  }

  if (/harmonyos|huawei/.test(ua)) {
    return { os: 'huawei', deviceType: 'mobile' };
  }

  if (/android/.test(ua)) {
    return { os: 'android', deviceType: 'mobile' };
  }

  return { os: 'web', deviceType: 'desktop' };
}

export function openAppOrStore({ appleStoreLink, googlePlayLink }) {
  const path = window.location.pathname.replace(/^\/+/, '');
  const { os } = getDeviceOS();
  const storeUrl = os === 'ios' ? appleStoreLink : googlePlayLink;

  let appOpened = false;
  const onVisibilityChange = () => {
    if (document.hidden) appOpened = true;
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  window.location.href = `${APP_SCHEME}://${path}`;

  setTimeout(
    () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (!appOpened) window.location.href = storeUrl;
    },
    os === 'ios' ? 2500 : 900,
  );
}

export async function sanitizeData(data) {
  if (!data) return {};
  return JSON.parse(JSON.stringify(data));
}

export function clearCookie(name, options = {}) {
  const { path = '/', domain } = options;
  let cookieString = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;
}

export const mapFeaturesToStrings = (features, locale) => {
  if (!Array.isArray(features)) return [];

  return features
    .map((feature) => {
      if (!feature) return '';
      if (translations?.[locale]?.[feature?.slug]) {
        return translations[locale][feature.slug](feature.label);
      }
      return getLocaleString(feature, 'label', locale);
    })
    .filter(Boolean);
};

export const generateDeviceID = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const isLoggedIn = (user) => {
  return user || user?.accessTokken;
};
export function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  );
}

export function getLocalisedHrefTitle(
  hrefTitleKey,
  hrefTitleParams,
  t,
  locale,
) {
  const label = getLocaleString(hrefTitleParams, 'label', locale);
  if (hrefTitleParams?.city) {
    const city = getLocaleString(hrefTitleParams, 'city', locale);

    return t(hrefTitleKey, {
      label,
      city,
    });
  }

  return t(hrefTitleKey, {
    label,
    city: '',
  });
}
export function getUserPathToRedirect(path, user, locale) {
  return isLoggedIn(user)
    ? path
    : `/login?redirectUrl=${BASE_URL}/${locale}${path}`;
}

export function convertPriceToRange(price) {
  if (typeof price !== 'number' || isNaN(price)) {
    return { priceMin: price, priceMax: price };
  }

  const margin = price * 0.2;

  return {
    priceMin: price - margin,
    priceMax: price + margin,
  };
}

export function getHreflangUrlsFromPathname(pathname, baseUrl = BASE_URL) {
  if (!pathname) return null;

  // Homepage only: Arabic = /, English = /en
  if (
    pathname === '/' ||
    pathname === '/en' ||
    pathname === `/${defaultLocale}`
  ) {
    return {
      ar: `${baseUrl}/`,
      en: `${baseUrl}/en`,
      'x-default': `${baseUrl}/`,
    };
  }

  const arPath = pathname.startsWith('/en/')
    ? pathname.replace('/en/', `/${defaultLocale}/`)
    : pathname;
  const enPath = pathname.startsWith(`/${defaultLocale}/`)
    ? pathname.replace(`/${defaultLocale}/`, '/en/')
    : pathname;

  return {
    ar: `${baseUrl}${arPath}`,
    en: `${baseUrl}${enPath}`,
    'x-default': `${baseUrl}${arPath}`,
  };
}

export const getRequestPathname = cache(async () => {
  const { headers } = await import('next/headers');
  return (await headers()).get('x-pathname') || '';
});

export async function generateHreflangAlternates(baseUrl = BASE_URL) {
  const pathname = await getRequestPathname();
  return getHreflangUrlsFromPathname(pathname, baseUrl);
}

export async function generateDefaultCanonical(baseUrl = BASE_URL) {
  const pathname = await getRequestPathname();
  return pathname && `${baseUrl}${pathname}`;
}

export function generateCanonicalUrlForPagination(
  currentPath,
  baseUrl = '',
  data = {},
) {
  const { page } = data;
  if (!currentPath || typeof currentPath !== 'string') return null;

  const fullPath = baseUrl ? `${baseUrl}${currentPath}` : currentPath;

  if (/\/page\/\d+\/?$/.test(currentPath)) return fullPath;

  if (Number(page) > 1 && !currentPath.includes('?')) {
    return `${fullPath}?page=${page}`;
  }
  return fullPath;
}

export function getPaginationMetaLinks({
  baseUrl = BASE_URL,
  currentPage = 1,
  totalCount,
  pageSize,
}) {
  const { totalPageCount } = getPaginationMeta({
    totalCount,
    pageSize,
    currentPage,
  });

  const links = {};
  if (currentPage > 1) {
    links.previous =
      currentPage === 2 ? baseUrl : `${baseUrl}/page/${currentPage - 1}`;
  }
  if (currentPage < totalPageCount) {
    links.next = `${baseUrl}/page/${currentPage + 1}`;
  }
  return links;
}

export const removePageFromUrl = (url = '') => url.replace(/\/page\/\d+$/, '');

export const getRecaptchaTokenHeader = (token) => {
  return {
    ...(token && { 'recaptcha-token': token }),
  };
};

//double check then integrate
export const filterEnabledSections = (items) => {
  if (Array.isArray(items))
    return items?.filter((item) => isSectionEnabled(item.id)) || [];
  else {
    return isSectionEnabled(items.id);
  }
};

export const getAsset = (path) => {
  const basePath = CDN_PATH + CDN_ASSETS_PATH;
  return `${basePath}${path}`;
};

export function formatMaintenanceStatValue(value, suffix) {
  if (value == null) return '—';
  const text = Number(value).toLocaleString();
  return suffix ? `${text} ${suffix}` : text;
}

export const toArray = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];
