import React, { cache } from 'react';

import { CarListingSEOStrategy } from '@/services/seoStrategy/listingDetailPage';
import PageLayout from '@/components/layout/pageLayout';
import UsedCarsListingDetail from '@/components/listing/usedCarListings/usedCarListingDetail';
import { fetchListingDetail } from '@/apis/listing';
import { getTranslations } from 'next-intl/server';
import { handleSlugRedirect } from '@/utils/redirections';
import { ifError } from '@/utils/ifError';
import { isMobileServer } from '@/utils/serverFunctions';

const getListingDetailCached = cache(async (id) => {
  return fetchListingDetail(id, 'new');
});

export async function generateMetadata({ params }) {
  const { id, locale, variantId } = await params;
  const listingDetailData = await getListingDetailCached(id);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const carSEO = new CarListingSEOStrategy({
    language: locale,
    listingDetailData,
    car_language_matches_user: locale === listingDetailData?.locale,
    is_new_car_ad: true,
  });
  const seoData = await carSEO.generateSEO();

  const metadata = {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    robots: seoData.robotsTag,
    openGraph: seoData.openGraph,
  };

  return metadata;
}

const NewCarListing = async (props) => {
  const isMob = await isMobileServer();
  const { params } = props;

  const {
    id,
    make: makeSlug,
    model: modelSlug,
    locale,
    variantId,
  } = await params;
  const listingDetailData = await getListingDetailCached(id);

  handleSlugRedirect({
    locale,
    type: 'new-car',
    id: id,
    expectedMake: makeSlug,
    expectedModel: modelSlug,
    listingDetailData,
    variantId: variantId,
    actualMake: listingDetailData?.dynamic_fields?.make?.slug,
    actualModel: listingDetailData?.dynamic_fields?.model?.slug,
    actualVehicleType: `new-${listingDetailData?.listing_category?.slug}`,
  });

  ifError(listingDetailData);

  return (
    <PageLayout route="detail-page">
      <UsedCarsListingDetail
        id={id}
        isMob={isMob}
        condition={'new'}
        listingDetailData={listingDetailData}
        locale={locale}
      />
    </PageLayout>
  );
};

export default NewCarListing;
