import { Figtree, IBM_Plex_Sans_Arabic } from 'next/font/google';

export const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['400', '500', '600', '700', '800'], // Normal, Medium, Bold
});

export const IBM_PLEX = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-ibm-plex-arabic',
  weight: ['400', '500', '600', '700'],
});

export const fonts = {
  ar: IBM_PLEX,
  en: figtree,
};
