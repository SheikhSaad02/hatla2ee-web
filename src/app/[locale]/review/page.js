import { getReviews } from '@/apis/reviews';
import HeroSectionContainer from '@/components/common/heroSection/heroSection';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import CarReviewsListings from '@/components/common/reviews/carReviewsListings';
import PageLayout from '@/components/layout/pageLayout';
import configs from '@/configs';
import { ReviewsPageSEO } from '@/services/seoStrategy/reviewsPage';
import { getAsset } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { decodeSearchParams } from '@/utils/url';
const getNewListingDetailCached = cache(async (obj) => {
  return getReviews(obj);
});

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const { page } = decodeSearchParams(await searchParams);

  const carSEO = new ReviewsPageSEO({
    language: locale,
    page,
  });

  const seoData = await carSEO.generateSEO();

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    openGraph: seoData.openGraph,
  };
}

const ReviewPage = async ({ searchParams, params }) => {
  const { locale } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const t = await getTranslations('reviews');
  const isMobile = await isMobileServer();

  const { reviews = [], pagination } = await getNewListingDetailCached({
    ...(page && { page: page }),
    per_page: 32,
  });

  return (
    <PageLayout route="review-landing">
      {!page ? (
        <HeroSectionContainer
          imageSrc={
            !isMobile
              ? getAsset('/assets/landing/car-review-banner.webp')
              : getAsset('/assets/landing/car-review-banner-sm.webp')
          }
        >
          <div className="w-full  text-white space-y-3 md:space-y-6 pb-5 md:pb-0 md:pt-10 ">
            <h1 className="heroHeading">
              {t('Car reviews in ')}
              <br />
              {t('{country} Market', {
                country: configs.country[locale].label,
              })}
            </h1>
          </div>
        </HeroSectionContainer>
      ) : (
        <PageTitle
          title={
            t('Car reviews in ') +
            t('{country} Market', {
              country: configs.country[locale].label,
            })
          }
        />
      )}
      <CarReviewsListings
        page={page}
        reviews={reviews}
        pagination={pagination}
      />
    </PageLayout>
  );
};

export default ReviewPage;
