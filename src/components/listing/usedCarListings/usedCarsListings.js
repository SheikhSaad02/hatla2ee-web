import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import Filters from '@/filters/filters';
import ListingGrid from '../listingGrid';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import QuickFiltersWidget from '@/filters/quickFiltersWidget';
import RecentSearchTracker from '../RecentSearchTracker';
import Sortby from '@/filters/components/sortby';
import UsedCarsFilterChips from './UsedCarsFilterChips';
import { UsedCarsListingSEOStrategy } from '@/services/seoStrategy/UsedListingPage';
import { fetchSlottedListings } from '@/apis/used-cars-listings';
import { formatNumberValue } from '@/utils/numbers';
import { isMobileServer, isWebViewServer } from '@/utils/serverFunctions';
import { ArrowDownUp } from 'lucide-react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import {
  CarListingGridSkeleton,
  FeaturedDealersSkeleton,
} from '@/components/common/loading';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import TrackAdMetrics from '@/components/adMetrics/track-ad-metrics';
import { QuickFiltersService } from '@/services/elasticsearch/quick-filters-service';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getListingAdUnits } from '@/components/googleAd/adsConfig';
import AdBanner from '@/components/googleAd/adBanner';
import StickyAd from '@/components/googleAd/stickyAd';
import AppPromoModal from '@/components/common/appPromoModal';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import FeaturedDealers from '../featuredDealers/featuredDealers';
import { isSectionEnabled } from '@/configs';
import { appSections } from '@/constants';
import UsedCarsFallbackListingsSection from '@/components/listing/usedCarListings/usedCarsFallbackListingsSection';
import LpvPageViewTracker from '@/components/analytics/lpv-page-view-tracker';

const UsedCarsListings = async ({
  updatedFilters,
  slugParts,
  isSearch,
  isLanding = false,
  showQuickFiltersWidget = false,
  showPagination,
  showAd = false,
  prioritizeFirstImage = false,
}) => {
  const t = await getTranslations('usedCarsListings');
  const locale = await getLocale();
  const isMob = await isMobileServer();
  const isWebView = await isWebViewServer();
  const isImported = updatedFilters?.specialConditions?.some(
    (item) => item.slug === 'imported',
  );

  const AD_UNITS = getListingAdUnits(
    isMob,
    locale,
    'cars',
    'used',
    updatedFilters?.make?.slug,
    updatedFilters?.model?.slug,
    updatedFilters?.body?.slug,
    isImported,
  );
  const seoStrategy = new UsedCarsListingSEOStrategy({
    language: locale,
    data: updatedFilters,
    isSearch: isSearch,
  });

  const heading = await seoStrategy.generateH1();

  const breadcrumbs = await seoStrategy.generateBreadcrumbs();
  const renderPageTitle = () => (
    <PageTitle title={heading} showSearchBar={isMob} />
  );
  const renderBreadcrumbs = () => <Breadcrumbs list={breadcrumbs} />;

  return (
    <>
      <LpvPageViewTracker filters={updatedFilters} />
      <RecentSearchTracker filters={updatedFilters} />
      {isMob && !isWebView && <AppPromoModal />}

      {!isMob && !isLanding && (
        <div className="flex flex-col gap-2">
          {renderBreadcrumbs()}
          {renderPageTitle()}
          <UsedCarsFilterChips isMobile={isMob} initialData={updatedFilters} />
        </div>
      )}
      {isMob && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      {isMob && !isLanding && (
        <>
          {renderPageTitle()}
          <div className="flex items-center justify-start gap-2 w-full">
            <Filters
              initialData={updatedFilters}
              locale={locale}
              isSearch={isSearch}
            />
          </div>
        </>
      )}
      <div
        className={
          !isLanding ? 'grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-5' : ''
        }
      >
        {!isMob && !isLanding && (
          <div className="w-[268px]">
            <Filters
              initialData={updatedFilters}
              locale={locale}
              isSearch={isSearch}
            />
          </div>
        )}
        <div className="flex flex-col gap-6 min-w-0">
          {showQuickFiltersWidget && !isMob && (
            <QuickFiltersWidget
              data={updatedFilters}
              locale={locale}
              urlArray={slugParts}
              filter={updatedFilters}
              page_type={isSearch ? PAGE_TYPES.SEARCH_RESULTS : ''}
            />
          )}

          {isSectionEnabled(appSections.SHOWROOMS) && !isLanding && (
            <Suspense fallback={<FeaturedDealersSkeleton />}>
              <FeaturedDealers
                isMobile={isMob}
                pageType={isSearch ? PAGE_TYPES.SEARCH_RESULTS : ''}
                showDealerLocation={false}
              />
            </Suspense>
          )}

          <Suspense
            key={`usedCarsGridKey=${JSON.stringify(updatedFilters)}`}
            fallback={<CarListingGridSkeleton />}
          >
            <UsedCarsResultsAndGrid
              showQuickFiltersWidget={showQuickFiltersWidget}
              locale={locale}
              urlArray={slugParts}
              updatedFilters={updatedFilters}
              isSearch={isSearch}
              isLanding={isLanding}
              showAd={showAd}
              isMob={isMob}
              t={t}
              showPagination={showPagination}
              prioritizeFirstImage={prioritizeFirstImage}
            />
          </Suspense>

          {isMob && !isWebView && renderBreadcrumbs()}
        </div>
      </div>
    </>
  );
};

const UsedCarsResultsAndGrid = async ({
  showQuickFiltersWidget,
  locale,
  urlArray,
  updatedFilters,
  isSearch,
  isLanding,
  isMob,
  t,
  showPagination,
  showAd = false,
  prioritizeFirstImage = false,
}) => {
  const { page = 1 } = updatedFilters || {};

  const { results, totalCount, totalPages } =
    await fetchSlottedListings(updatedFilters);

  // Get pathname for redirect and banner check
  const headersList = await headers();
  const pathname = headersList.get('x-pathname');

  // Redirect to URL without page path if results are empty and page exists
  if (results.length === 0 && updatedFilters?.page && updatedFilters.page > 1) {
    if (pathname) {
      // Remove /page/X from the path (e.g., /make/model/page/2 -> /make/model)
      const redirectUrl = pathname.replace(/\/page\/\d+$/, '');
      redirect(redirectUrl);
    }
  }

  let quickFilters;
  if (isMob) {
    quickFilters = new QuickFiltersService({
      locale,
      isMobile: isMob,
      data: updatedFilters,
      urlArray,
      filter: updatedFilters,
      isLanding,
    });
  }

  const shouldShowBanner = pathname && pathname.endsWith('/imported-car');

  return (
    <>
      {shouldShowBanner && <TotalEnergyCenterBanner locale={locale} />}
      {!isLanding && (
        <div className="flex justify-between items-center gap-1">
          <span className="font-medium fs-body text-gray-600 md:font-sm md:font-medium md:text-gray">
            {formatNumberValue(totalCount)}{' '}
            {t('Results', { count: totalCount })}
          </span>
          <Sortby
            data={updatedFilters}
            isMobile={isMob}
            icon={<ArrowDownUp className="size-[12px] text-primary" />}
          />
        </div>
      )}

      <ListingGrid
        showQuickFiltersWidget={showQuickFiltersWidget}
        isMobile={isMob}
        quickFilters={quickFilters}
        data={results}
        totalPages={totalPages}
        currentPage={page}
        useQuery={!!isSearch}
        showSellCarBanner={!isLanding}
        isLanding={isLanding}
        pageSection={PAGE_SECTIONS?.EXPLORE_USED_CARS}
        isSearch={isSearch}
        showPagination={showPagination}
        showAd={showAd}
        pageType={PAGE_TYPES.SEARCH_RESULTS}
        prioritizeFirstImage={prioritizeFirstImage}
      />
      <TrackAdMetrics adMetrics={results} />
      <UsedCarsFallbackListingsSection
        updatedFilters={updatedFilters}
        totalCount={totalCount}
        page={page}
        results={results}
      />
    </>
  );
};
export default UsedCarsListings;
