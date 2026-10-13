import { CarListingSEOStrategy } from '@/services/seoStrategy/listingDetailPage';
import PageLayout from '@/components/layout/pageLayout';
import React from 'react';
import UsedCarsListingDetail from '@/components/listing/usedCarListings/usedCarListingDetail';
import { cache } from 'react';
import { fetchListingDetail } from '@/apis/listing';
import { getTranslations } from 'next-intl/server';
import { handleSlugRedirect } from '@/utils/redirections';
import { headers } from 'next/headers';
import { ifError } from '@/utils/ifError';
import { isMobileServer } from '@/utils/serverFunctions';
import { redirect } from 'next/navigation';

const getListingDetailCached = cache(async (id) => {
  return fetchListingDetail(id);
});

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const listingDetailData = await getListingDetailCached(id);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const carSEO = new CarListingSEOStrategy({
    language: locale,
    listingDetailData,
    car_language_matches_user: locale === listingDetailData?.locale,
    is_new_car_ad: false,
    year_page_indexed: listingDetailData?.rules?.index_page,
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

const Listing = async ({ params }) => {
  const isMob = await isMobileServer();
  const { id, make: makeSlug, model: modelSlug, locale } = await params;
  const listing = await getListingDetailCached(id);

  //if the current url and the url in listing?.url are diff then redirect to listing?.url
  if (listing?.url) {
    const headersList = await headers();
    const currentPathname = headersList.get('x-pathname');

    // Extract path after locale from listing.url
    let listingPath = listing.url;
    try {
      const url = new URL(listing.url);
      listingPath = url.pathname;
    } catch {
      // listing.url is already a pathname
    }
    // Remove locale prefix (/en or /ar) from path
    const pathAfterLocale = listingPath.replace(/^\/(en|ar)/, '');
    const currentPathAfterLocale = currentPathname?.replace(/^\/(en|ar)/, '');

    if (currentPathAfterLocale && currentPathAfterLocale !== pathAfterLocale) {
      redirect(`/${locale}${pathAfterLocale}`);
    }
  }

  handleSlugRedirect({
    locale,
    type: 'car',
    id: id,
    listingDetailData: listing,
    expectedMake: makeSlug,
    expectedModel: modelSlug,
    actualMake: listing?.dynamic_fields?.make?.slug,
    actualModel: listing?.dynamic_fields?.model?.slug || 'car',

    year_page_indexed: listing?.rules?.index_page,
  });

  ifError(listing);

  return (
    <PageLayout route="detail-page">
      <UsedCarsListingDetail
        id={id}
        isMob={isMob}
        locale={locale}
        listingDetailData={listing}
      />
    </PageLayout>
  );
};

export default Listing;
