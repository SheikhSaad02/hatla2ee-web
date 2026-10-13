import { cache } from 'react';

import { getCarMaintenanceStepsData } from '@/components/car-maintenance/data';
import CarMaintenanceCentersPreviewSection from '@/components/car-maintenance/centers-preview-section';
import CarMaintenanceCtaBanner from '@/components/car-maintenance/cta-banner';
import CarMaintenanceDiscoverySection from '@/components/car-maintenance/discovery-section';
import CarMaintenanceFaqSection from '@/components/car-maintenance/faq-section';
import CarMaintenanceFeaturesSection from '@/components/car-maintenance/features-section';
import CarMaintenanceHeroSection from '@/components/car-maintenance/hero-section';
import StepsSection from '@/components/common/steps-section';
import PageLayout from '@/components/layout/pageLayout';
import { getCarMaintenanceSeo } from '@/services/seoStrategy/carMaintenancePage';
import { getLocale } from 'next-intl/server';

const getCarMaintenanceSeoCached = cache(async (locale) => {
  return getCarMaintenanceSeo(locale, { absoluteTitle: true });
});

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seoData = await getCarMaintenanceSeoCached(locale);

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
    openGraph: seoData.openGraph,
  };
}

export default async function CarMaintenancePage() {
  const locale = await getLocale();

  const [seoData, stepsConfig] = await Promise.all([
    getCarMaintenanceSeoCached(locale),
    getCarMaintenanceStepsData(locale),
  ]);

  return (
    <PageLayout route="maintenance-center">
      {seoData?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoData.jsonLd),
          }}
        />
      )}
      <CarMaintenanceHeroSection title={seoData.h1} />
      <CarMaintenanceFeaturesSection />
      <StepsSection {...stepsConfig} />
      <CarMaintenanceCtaBanner />
      <CarMaintenanceCentersPreviewSection />
      <CarMaintenanceDiscoverySection />
      <CarMaintenanceFaqSection />
    </PageLayout>
  );
}
