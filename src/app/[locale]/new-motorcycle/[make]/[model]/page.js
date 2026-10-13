import NewVehicleModelPage from '@/components/listing/newVehicleListings/newVehicleModelPage';
import { NewVehiclePage } from '@/services/seoStrategy/newVehiclePage';
import PageLayout from '@/components/layout/pageLayout';
import { cache } from 'react';
import { fetchNewListingModelLevelDetail } from '@/apis/new-car';
import { getTranslations } from 'next-intl/server';
import { handleSlugRedirect } from '@/utils/redirections';
import { ifError } from '@/utils/ifError';
import { isMobileServer } from '@/utils/serverFunctions';

const getNewListingDetailCached = cache(async (makeSlug, modelSlug) => {
  return fetchNewListingModelLevelDetail(makeSlug, modelSlug);
});

export async function generateMetadata({ params }) {
  const { model: modelSlug, make: makeSlug, locale } = await params;
  const listingDetailData = await getNewListingDetailCached(
    makeSlug,
    modelSlug,
  );
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const carSEO = new NewVehiclePage({
    language: locale,
    listingDetailData,
    modelLevelDetail: true,
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

const NewCarsModelPage = async (props) => {
  const isMob = await isMobileServer();
  const { params } = props;
  const { model: modelSlug, make: makeSlug, locale } = await params;
  const listingDetailData = await getNewListingDetailCached(
    makeSlug,
    modelSlug,
  );
  ifError(listingDetailData);
  const carSEO = new NewVehiclePage({
    language: locale,
    listingDetailData,
    modelLevelDetail: true,
  });

  const seoData = await carSEO.generateSEO();
  handleSlugRedirect({
    locale,
    type: 'new-motorcycle',
    expectedMake: makeSlug,
    expectedModel: modelSlug,
    listingDetailData,
    actualMake: listingDetailData?.make?.slug,
    actualModel: listingDetailData?.model?.slug,
    actualVehicleType: `new-${listingDetailData?.listing_category?.slug}`,
  });

  return (
    <PageLayout
      route="model-detail"
      breadCrumbsList={seoData?.breadcrumbs}
      pageTitle={seoData?.h1}
    >
      <NewVehicleModelPage
        listingDetailData={listingDetailData}
        locale={locale}
      />
    </PageLayout>
  );
};

export default NewCarsModelPage;
