import { getReviews } from '@/apis/reviews';
import CarReviewsListings from '@/components/common/reviews/carReviewsListings';
import PageLayout from '@/components/layout/pageLayout';
import { ReviewsPageSEO } from '@/services/seoStrategy/reviewsPage';
import { cache } from 'react';
import { decodeSearchParams } from '@/utils/url';

const getNewListingDetailCached = cache(async (obj) => {
  return getReviews(obj);
});

export async function generateMetadata({ searchParams, params }) {
  const { locale, make } = await params;
  const { page } = decodeSearchParams(await searchParams);

  const { reviews = [], pagination } = await getNewListingDetailCached({
    ...(make && { 'f[make_slug]': make }),
    ...(page && { page: page }),
  });

  const carSEO = new ReviewsPageSEO({
    language: locale,
    make: reviews?.[0]?.make,
    reviewsData: reviews,
    page,
  });

  const seoData = await carSEO.generateSEO();

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    openGraph: seoData.openGraph,
    robots: seoData.robotsTag,
  };
}

const ReviewPage = async ({ params, searchParams }) => {
  const { make: makeSlug } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const { reviews = [], pagination } = await getNewListingDetailCached({
    ...(makeSlug && { 'f[make_slug]': makeSlug }),
    ...(page && { page: page }),
    per_page: 32,
  });

  return (
    <PageLayout route="listings">
      <CarReviewsListings
        make={reviews?.[0]?.make}
        page={page}
        reviews={reviews}
        pagination={pagination}
      />
    </PageLayout>
  );
};

export default ReviewPage;
