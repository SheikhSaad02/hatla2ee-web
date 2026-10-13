import { fetchComparisonDetail } from '@/apis/comparison';
import ComparisonModule from '@/components/car-comparison/ComparisonModule';
import PageLayout from '@/components/layout/pageLayout';
import { isMobileServer } from '@/utils/serverFunctions';
import { cache } from 'react';
import { ComparisonPageSEOStrategy } from '@/services/seoStrategy/comparisonPage';
import { ifError } from '@/utils/ifError';
import { decodeSearchParams } from '@/utils/url';

async function getSEOData(locale, listings, vehicle, id) {
  const seoStrategy = new ComparisonPageSEOStrategy({
    language: locale,
    listings: listings,
    vehicle: vehicle,
    id,
  });
  return seoStrategy.generateDetailPageSEO();
}

const getComparisonDetailCached = cache(async (id) => {
  return fetchComparisonDetail({ id });
});

export async function generateMetadata({ params, searchParams }) {
  const { id, locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const vehicle = sp?.vehicle || 'car';
  const response = await getComparisonDetailCached(id);
  const { listings } = response;
  const seoData = await getSEOData(locale, listings, vehicle, id);
  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
    openGraph: seoData.openGraph,
  };
}

export default async function CarComparisonPage({ params, searchParams }) {
  const { id, locale } = await params;
  const isMobile = await isMobileServer();
  const sp = decodeSearchParams(await searchParams);
  const vehicle = sp.vehicle || 'car';
  const response = await getComparisonDetailCached(id);
  const { listings } = response;

  ifError(response);

  const seoData = await getSEOData(locale, listings, vehicle);

  return (
    <PageLayout
      route="comparisonDetail"
      breadCrumbsList={seoData.breadcrumbs}
      pageTitle={seoData.h1}
      className="lg:pt-2 gap-2 lg:gap-4 "
    >
      <ComparisonModule
        initialCars={listings || {}}
        title={seoData.h1}
        isMobile={isMobile}
        vehicleCategorySlug={vehicle}
      />
    </PageLayout>
  );
}
