import { CarListingSEOStrategy } from '@/services/seoStrategy/listingDetailPage';
import PageLayout from '@/components/layout/pageLayout';
import UsedCarsListingDetail from '@/components/listing/usedCarListings/usedCarListingDetail';
import { cache } from 'react';
import { fetchListingDetail } from '@/apis/listing';
import { getTranslations } from 'next-intl/server';
import { handleSlugRedirect } from '@/utils/redirections';
import { ifError } from '@/utils/ifError';
import { isMobileServer } from '@/utils/serverFunctions';

const getListingDetailCached = cache(async (id) => {
  return fetchListingDetail(id);
});

export async function generateMetadata({ params }) {
  const { id, make: makeSlug, model: modelSlug, locale } = await params;
  const listingDetailData = await getListingDetailCached(id);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const carSEO = new CarListingSEOStrategy({
    language: locale,
    listingDetailData,
    car_language_matches_user: locale === listingDetailData?.locale,
    is_new_car_ad: false,
  });

  const seoData = await carSEO.generateSEO();
  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    alternates: {
      canonical: seoData?.canonical,
      languages: seoData.languages,
    },
    openGraph: seoData.openGraph,
  };
}

const Listing = async (props) => {
  const isMob = await isMobileServer();
  const { params } = props;
  const { id, make: makeSlug, model: modelSlug, locale } = await params;
  const listingDetailData = await getListingDetailCached(id);

  handleSlugRedirect({
    locale,
    type: 'new-car',
    id: id,
    expectedMake: makeSlug,
    expectedModel: modelSlug,
    actualMake: listingDetailData?.dynamic_fields?.make?.slug,
    actualModel: listingDetailData?.dynamic_fields?.model?.slug,
    listingDetailData,
    actualVehicleType: `new-${
      listingDetailData?.listing_category?.slug || 'car'
    }`,
    imported: true,
  });

  ifError(listingDetailData);

  return (
    <PageLayout route="detail-page">
      <UsedCarsListingDetail
        id={id}
        isMob={isMob}
        locale={locale}
        listingDetailData={listingDetailData}
      />
    </PageLayout>
  );
};

export default Listing;
