import PageLayout from '@/components/layout/pageLayout';
import { UsedCarsListingSEOStrategy } from '@/services/seoStrategy/UsedListingPage';
import UsedCarsListings from '@/components/listing/usedCarListings/usedCarsListings';
import { getLocale } from 'next-intl/server';
import { populateFilters } from '@/utils/used-cars/listings/parsingLayer';
import { parseQueryParamsToFilters } from '@/utils/used-cars/listings/queryParser';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ searchParams }) {
  const locale = await getLocale();
  const queryParams = await searchParams;
  const { page } = queryParams || {};

  const seoStrategy = new UsedCarsListingSEOStrategy({
    language: locale,
    isSearch: true,
    data: { page },
    urlInfo: { params: ['search'], searchParams: queryParams },
  });
  const [title, description, canonical, languages] = await Promise.all([
    seoStrategy.generateMetaTitle(),
    seoStrategy.generateMetaDescription(),
    seoStrategy.generateCanonical(),
    seoStrategy.generateLanguages(),
  ]);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
  };
}

export default async function CarListingPage({ searchParams }) {
  const queryParams = decodeSearchParams(await searchParams);

  const filters = parseQueryParamsToFilters(queryParams);
  const updatedFilters = await populateFilters(filters, {
    fetchYearWithVariant: false,
  });
  const { sortby, ...rest } = queryParams;
  return (
    <PageLayout route="used-listings" className="gap-4 lg:gap-6">
      <UsedCarsListings
        updatedFilters={updatedFilters}
        showAd={true}
        isSearch
        showQuickFiltersWidget={
          Object.keys(queryParams)?.length === 0 ||
          (Object.keys(queryParams)?.length === 1 && 'sortby' in queryParams)
        }
        prioritizeFirstImage={true}
      />
    </PageLayout>
  );
}
