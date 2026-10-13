import { cache } from 'react';
import configs from '@/configs';
import { isMobile } from '@/utils/general';
import { getLocale, getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

// cache() deduplicates calls per-request - each HTTP request gets fresh cache
// Mobile/desktop users never share cached values as they're separate requests
export const isMobileServer = cache(async () => {
  const headersList = await headers();
  return isMobile(headersList.get('user-agent') || '');
});

export const isWebViewServer = cache(async () => {
  const userAgent = (await headers()).get('user-agent') || '';
  // iOS: Hatla2ee/{VERSION_NAME} (com.hatla2ee; build:{VERSION_CODE}; iOS {VERSION})
  // Android: Hatla2ee/{VERSION_NAME} (hatla2ee.hatla2ee_egypt; build:{VERSION_CODE}; Android {VERSION})
  return /com\.hatla2ee/.test(userAgent) || /hatla2ee\.hatla2ee_egypt/.test(userAgent);
});

export const getLocaleStringServer = async (data, key, t = null) => {
  if (data) {
    if (typeof data === 'string') return data;
    const locale = await getLocale();

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
  }
};

export async function getCookieValue(cookie) {
  const cookieStore = await cookies();
  return cookieStore.get(cookie)?.value;
}

export async function generatePageTitle(baseTitle, page) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const country = configs.country?.[locale]?.label || '';
  let title = `${baseTitle} | ${t('Hatla2eeCountry', { country })}`;

  if (page && page > 1) {
    title = `${title} - ${t('Page')} ${page}`;
  }

  return title;
}
