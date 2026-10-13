import { fetchComparisonDetail } from '@/apis/comparison';
import ComparisonModule from '@/components/car-comparison/ComparisonModule';
import PageLayout from '@/components/layout/pageLayout';
import { appPaths, vehicleSlugLabel } from '@/constants';
import {getLocaleString } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { ComparisonPageSEOStrategy } from '@/services/seoStrategy/comparisonPage';
import { ifError } from '@/utils/ifError';
import { decodeSearchParams } from '@/utils/url';

async function getSEOData(locale, cars, vehicle) {
  const seoStrategy = new ComparisonPageSEOStrategy({
    language: locale,
    cars: cars,
    vehicle: vehicle,
  });
  return seoStrategy.generateDetailPageSEO();
}

const getComparisonDetailCached = cache(async (carIds) => {
  return fetchComparisonDetail({ listing_ids: carIds });
});

const getCarsTitle = (cars, locale, t, separator = ' - ') => {
  return cars
    .map(
      (car) =>
        `${getLocaleString(car.make, 'label', locale)} ${getLocaleString(
          car.model,
          'label',
          locale,
        )}`,
    )
    .join(separator);
};

export async function generateMetadata({ params, searchParams }) {
  const { ids, locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const vehicle = sp.vehicle || 'car';
  const response = await getComparisonDetailCached(ids);
  const { listings } = response;
  const cars = Object.values(listings);
  const seoData = await getSEOData(locale, cars, vehicle);

  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
    robots: 'noindex, follow',
    openGraph: seoData.openGraph,
  };
}

export default async function TerazesComparisonPage({ params, searchParams }) {
  const { ids, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'carComparisonSeo' });
  const isMobile = await isMobileServer();
  const sp = decodeSearchParams(await searchParams);
  const vehicle = sp.vehicle || 'car';
  const carIds = Array.isArray(ids)
    ? ids.map((id) => parseInt(id, 10))
    : [parseInt(ids, 10)];

  const response = await getComparisonDetailCached(carIds);
  const { listings } = response;
  ifError(response);
  const cars = Object.values(listings);
  const seoData = await getSEOData(locale, cars, vehicle);

  return (
    <PageLayout
      route="comparisonDetail"
      pageTitle={seoData.h1}
      {...(vehicle == 'car' && { breadCrumbsList: seoData.breadcrumbs })}
    >
      <ComparisonModule
        carIds={carIds}
        title={seoData.h1}
        isMobile={isMobile}
        vehicleCategorySlug={vehicle}
      />
    </PageLayout>
  );
}
