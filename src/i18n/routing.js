import configs, { defaultLocale } from '@/configs';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: configs.locales.map((locale) => locale.value),
  defaultLocale: defaultLocale,
  localeDetection: false,
  localePrefix: 'always',
  localeCookie: false,
  // pathname: {
  //   '/': {
  //     // [configs.locales[0]]: '/',
  //     'ar': '/',
  //   },
  // },
});
