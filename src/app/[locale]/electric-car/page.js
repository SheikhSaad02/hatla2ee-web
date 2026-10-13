import { cache } from 'react';
import PageLayout from '@/components/layout/pageLayout';
import EvLanding from '@/components/evLanding/evLanding';
import { getElectricCarSeo } from '@/services/seoStrategy/electricCarPage';
import { getLocale } from 'next-intl/server';

const getElectricCarSeoCached = cache(async (locale) => {
  return getElectricCarSeo(locale, { absoluteTitle: true });
});

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seoData = await getElectricCarSeoCached(locale);

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
    openGraph: seoData.openGraph,
    twitter: seoData.twitterCard,
    robots: seoData.robotsTag,
  };
}

export default async function ElectricCarPage() {
  const locale = await getLocale();
  const seoData = await getElectricCarSeoCached(locale);

  return (
    <PageLayout route="ev-landing">
      {seoData?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.jsonLd) }}
        />
      )}
      <EvLanding />
    </PageLayout>
  );
}
