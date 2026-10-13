import PageLayout from '@/components/layout/pageLayout';
import UsedCarsListingsServerWrapper from '@/components/listing/usedCarListings/usedCarsListingsServerWrapper';
import { UsedCarsListingSEOStrategy } from '@/services/seoStrategy/UsedListingPage';
import { populateFilters } from '@/utils/used-cars/listings/parsingLayer';
import { parseUsedCarsListingsUrl } from '@/utils/used-cars/listings/prettyParser';
import { redirect } from 'next/navigation';
import { decodeSearchParams } from '@/utils/url';

export async function generateUsedCarListingsMetadata(
  slugParts,
  locale,
  searchParams,
) {
  const queryParams = decodeSearchParams(await searchParams);

  const filters = parseUsedCarsListingsUrl(slugParts, queryParams);
  const updatedFilters = await populateFilters(filters);

  const seoStrategy = new UsedCarsListingSEOStrategy({
    language: locale,
    data: updatedFilters,
    isSearch: false,
    isLanding: slugParts.length === 0,
    urlInfo: { params: slugParts, searchParams: queryParams },
    absoluteTitle: true,
  });

  const [title, description, canonical, robots, openGraph, languages] =
    await Promise.all([
      seoStrategy.generateMetaTitle(),
      seoStrategy.generateMetaDescription(),
      seoStrategy.generateCanonical(),
      seoStrategy.generateRobotsTag(),
      seoStrategy.generateOpenGraph(),
      seoStrategy.generateLanguages(),
    ]);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph,
    robots,
  };
}

export async function getUsedCarListingsRedirectPath(
  slugParts,
  locale,
  queryParams,
) {
  if (slugParts.length === 0) return null;

  const filters = parseUsedCarsListingsUrl(slugParts, queryParams);
  const updatedFilters = await populateFilters(filters);

  const seoStrategy = new UsedCarsListingSEOStrategy({
    language: locale,
    data: updatedFilters,
    isSearch: false,
    urlInfo: { params: slugParts, searchParams: queryParams },
    absoluteTitle: true,
  });

  return seoStrategy.getRedirectPath();
}

export async function UsedCarListingsListingLayout({
  slugParts,
  locale,
  queryParams,
}) {
  const redirectPath = await getUsedCarListingsRedirectPath(
    slugParts,
    locale,
    queryParams,
  );
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
