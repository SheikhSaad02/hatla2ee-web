import NewVehicleDetailPage from '@/components/listing/newVehicleListings/newVehicleDetailPage';
import { NewVehiclePage } from '@/services/seoStrategy/newVehiclePage';
import PageLayout from '@/components/layout/pageLayout';
import { cache } from 'react';
import { fetchNewListingVariantLevelDetail } from '@/apis/new-car';
import { getTranslations } from 'next-intl/server';
import { handleSlugRedirect } from '@/utils/redirections';
import { ifError } from '@/utils/ifError';

const getNewListingDetailCached = cache(async (variantId) => {
  return fetchNewListingVariantLevelDetail(variantId);
});

export async function generateMetadata({ params }) {
  const { variantId, locale } = await params;
  const listingDetailData = await getNewListingDetailCached(variantId);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const carSEO = new NewVehiclePage({
    language: locale,
    listingDetailData,
    modelLevelDetail: false,
  });

  const seoData = await carSEO.generateSEO();

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    openGraph: seoData.openGraph,
  };
}

const NewCarInfo = async (props) => {
  const t = await getTranslations('common');
  const { params } = props;
  const { variantId, make: makeSlug, model: modelSlug, locale } = await params;

  const listingDetailData = await getNewListingDetailCached(variantId);

  handleSlugRedirect({
    locale,
    type: 'new-bus',
    expectedMake: makeSlug,
    expectedModel: modelSlug,
    listingDetailData,
    variantId: variantId,
    actualMake: listingDetailData?.make?.slug,
    actualModel: listingDetailData?.model?.slug,
    actualVehicleType: `new-${listingDetailData?.listing_category?.slug}`,
  });

  ifError(listingDetailData);

  return (
    <PageLayout route="detail-page">
      <NewVehicleDetailPage
        variantId={variantId}
        vehicleType="bus"
        locale={locale}
        listingDetailData={listingDetailData}
      />
    </PageLayout>
  );
};

export default NewCarInfo;
