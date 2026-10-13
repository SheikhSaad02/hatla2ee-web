import '@/styles/globals.css';

import AppInitializer from '@/components/initialisation/app-initializer';
import CoreLayout from '@/components/layout/core-layout';
import ProgressBarWrapper from '@/components/layout/progressBarWrapper';
import { getTranslations } from 'next-intl/server';
import GlobalPageViewTracker from '@/components/analytics/global-page-view-tracker';
import configs from '@/configs';
// import LazyGoogleAnalytics from '@/components/google-analytics/LazyGoogleAnalytics';
// import { isServer } from '@/utils/general';
// import { BASE_URL } from '@/constants';

import {
  getAsset,
  generateDefaultCanonical,
  generateHreflangAlternates,
} from '@/utils/general';
import { INDEXABLE_ROBOTS_TAG } from '@/constants';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const [canonical, languages] = await Promise.all([
    generateDefaultCanonical(),
    generateHreflangAlternates(),
  ]);
  const country = configs.country[locale].label;

  return {
    title: {
      template: `%s | ${t('Hatla2eeCountry', {
        country,
      })}`,
      default: t('defaultTitle', { country }),
    },
    description: t('defaultDescription', { country }),
    icons: {
      icon: getAsset('/assets/favicon/favicon.ico'),
    },
    alternates: {
      canonical,
      languages,
    },
    robots: INDEXABLE_ROBOTS_TAG,
    openGraph: {
      title: t('defaultTitle', { country }),
      description: t('defaultDescription', { country }),
      siteName: 'Hatla2ee',
      locale: locale,
      type: 'website',
      images: [
        {
          url:
            locale === 'en'
              ? getAsset(`/assets/og-images/home-en.webp`)
              : getAsset(`/assets/og-images/home-ar.webp`),
          width: 1200,
          height: 630,
          alt: 'Hatla2ee',
          type: 'image/webp',
        },
      ],
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function RootLayout(props) {
  const { children } = props;
  const { locale } = await props.params;
  return (
    <CoreLayout locale={locale}>
      <GlobalPageViewTracker />
      <AppInitializer />
      {children}
      {/* {process.env.NEXT_PUBLIC_GA_ID && (
        <LazyGoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )} */}
    </CoreLayout>
  );
}

// export function generateStaticParams() {
//   return [{ locale: 'en' }, { locale: 'ar' }];
//}
