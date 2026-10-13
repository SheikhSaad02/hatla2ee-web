import { cn } from '@/utils';
import { ifError } from '@/utils/ifError';
import {
  getLocaleStringServer,
  isMobileServer,
  isWebViewServer,
} from '@/utils/serverFunctions';
import { getLocale, getTranslations } from 'next-intl/server';
import ListingNotFound from '../errors/listingNotFound';
import { PageTitle } from '../pageTitle/pageTitle';
import Pagination from '../pagination';
import ReviewCard from './reviewCard';
import { ReviewsPageSEO } from '@/services/seoStrategy/reviewsPage';
import { Breadcrumbs } from '../breadcrumbs';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { MakeModelTabsCompactSkeleton } from '../loading';
import ReviewsByMakeTabs from './reviewsByMakeTabs';

const CarReviewsListings = async ({
  make,
  reviews = [],
  showListingsOnly = false,
  pagination,
}) => {
  const t = await getTranslations('reviews');
  const locale = await getLocale();
  const isMob = await isMobileServer();
  const isWebView = await isWebViewServer();
  ifError(reviews);

  const { total_count, current_page } = pagination || {
    total_count: 0,
    current_page: 1,
  };

  const carSEO = new ReviewsPageSEO({
    language: locale,
    ...(make && { make: make }),
  });

  const seoData = await carSEO.generateSEO();

  const renderPageTitle = () => {
    return !isWebView && <PageTitle title={seoData?.h1} />;
  };
  const renderBreadcrumbs = () => <Breadcrumbs list={seoData?.breadcrumbs} />;

  const renderListings = async () => (
    <>
      {!reviews.length ? (
        <div className={cn('flex-1 content-center')}>
          <ListingNotFound title={t('No Reviews Found!')} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className={`grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 lg:gap-y-6`}
          >
            {reviews?.map(async (item, index) => (
              <ReviewCard
                key={index}
                className={'d'}
                href={item?.href}
                title={await getLocaleStringServer(item, 'label')}
                images={item?.images}
                rating={item?.rating}
              />
            ))}
          </div>

          <Pagination
            className="pagination-bar"
            currentPage={current_page}
            totalCount={total_count}
            pageSize={32}
          />
        </div>
      )}
    </>
  );

  const renderFullPage = () => (
    <>
      {!make ? (
        <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMob} />}>
          <ReviewsByMakeTabs locale={locale} />
        </Suspense>
      ) : !isMob ? (
        <div className="flex flex-col gap-2">
          {renderBreadcrumbs()}
          {renderPageTitle()}
        </div>
      ) : (
        <>{renderPageTitle()}</>
      )}

      {renderListings()}
      {isMob && !isWebView && renderBreadcrumbs()}
    </>
  );

  return showListingsOnly ? renderListings() : renderFullPage();
};

export default CarReviewsListings;
