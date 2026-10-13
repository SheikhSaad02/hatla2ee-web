import PageLayout from '@/components/layout/pageLayout';
import { UsedCarsListingSEOStrategy } from '@/services/seoStrategy/UsedListingPage';
import UsedCarsListingsServerWrapper from '@/components/listing/usedCarListings/usedCarsListingsServerWrapper';
import { getLocale } from 'next-intl/server';
import { populateFilters } from '@/utils/used-cars/listings/parsingLayer';
import { parseUsedCarsListingsUrl } from '@/utils/used-cars/listings/prettyParser';
import { redirect } from 'next/navigation';
import { decodeSearchParams } from '@/utils/url';

/*
  This page has only been added to prevent /car/city/:city-slug/make from routing into /car/:make/:model/:id
  without this /car/city/:city-slug/make will always route to /car/:make/:model/:id due to route specificity.
*/
export async function generateMetadata({ params, searchParams }, parent) {
  const { city, make } = (await params) || [];
  const queryParams = decodeSearchParams(await searchParams);
  const slugParts = ['city', city, make];
  const locale = await getLocale();
  let filters = parseUsedCarsListingsUrl(slugParts, queryParams);
  const updatedFilters = await populateFilters(filters);

  const seoStrategy = new UsedCarsListingSEOStrategy({
    language: locale,
    data: updatedFilters,
    isSearch: false,
    urlInfo: { params: slugParts, searchParams: queryParams },
  });

  let [title, description, canonical, robots, languages] = await Promise.all([
    seoStrategy.generateMetaTitle(),
    seoStrategy.generateMetaDescription(),
    seoStrategy.generateCanonical(),
    seoStrategy.getRobotsTag(),
    seoStrategy.generateLanguages(),
  ]);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots,
  };
}

export default async function CarCityMakeListingPage({ params, searchParams }) {
  const { city, make } = (await params) || [];
  const queryParams = decodeSearchParams(await searchParams);
  const slugParts = ['city', city, make];
  const locale = await getLocale();

  // Evaluate redirect rules early
  const filters = parseUsedCarsListingsUrl(slugParts, queryParams);
  const updatedFilters = await populateFilters(filters);
  const seoStrategy = new UsedCarsListingSEOStrategy({
    language: locale,
    data: updatedFilters,
    urlInfo: { params: slugParts, searchParams: queryParams },
  });

  const redirectPath = await seoStrategy.getRedirectPath();
  if (redirectPath) {
    redirect(`/${locale}${redirectPath}`);
  }

  return (
    <PageLayout route="used-listings" className="gap-4 lg:gap-6">
      <UsedCarsListingsServerWrapper
        slugParts={slugParts}
        queryParams={queryParams}
      />
    </PageLayout>
  );
}
