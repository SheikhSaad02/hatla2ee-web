import { Breadcrumbs } from '@/components/common/breadcrumbs';
import Filters from '@/filters/new-cars/filters';
import React from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { getLocale, getTranslations } from 'next-intl/server';
import { isMobileServer, isWebViewServer } from '@/utils/serverFunctions';
import { formatNumberValue } from '@/utils/numbers';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import {
  appPaths,
  newVehiclesCategorySlugs,
  OPENSEARCH_MAX_LIMIT,
  appSections,
} from '@/constants';
import NewCarsFilterChips from './newCarsFilterChips';
import {
  fetchNewCarsListingsData,
  newVehiclePageSize,
} from '@/apis/new-cars-listings';
import QuickFiltersWidget from '@/filters/new-cars/quickFiltersWidget';
import { NewVehiclesListingSEOStrategy } from '@/services/seoStrategy/newVehiclesListingPage';
import ListingGrid from '../listingGrid';
import NewVehicleListingCard from '../newVehicleListingCard';
import {
  convertQueryObjToString,
  getListingTitleByLevel,
} from '@/utils/general';
import Sortby from '@/filters/components/sortby';
import filterData from '@data';
import DealersWithClassification from '@/components/home/dealers-section';
import UsedCarsCatalog from '../usedCarListings/usedCarsCatalog';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import { ArrowDownUp } from 'lucide-react';
import {
  CarListingGridSkeleton,
  CarNewsSectionSkeleton,
  DealersSectionSkeleton,
  FilterSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import { mapFiltersToQuery } from '@/utils/used-cars/listings';
import { QuickFiltersService } from './quick-filters-service';
import AdBanner from '@/components/googleAd/adBanner';
import StickyAd from '@/components/googleAd/stickyAd';
import { getListingAdUnits } from '@/components/googleAd/adsConfig';
import { getShouldfetchVariantLevelAds } from '@/utils/new-cars/listings';
import { isSectionEnabled } from '@/configs';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import LpvPageViewTracker from '@/components/analytics/lpv-page-view-tracker';
const NewVehicleListings = async ({
  searchParams,
  isSearch,
  categorySlug,
  showListingsOnly = false,
  showQuickFiltersWidget = false,
  additionalQuery = {},
  seoData,
  isLanding = false,
  useQueryPagination = false,
  quickLinks,
  prioritizeFirstImage = false,
}) => {
  const t = await getTranslations('usedCarsListings');
  const locale = await getLocale();
  const isMob = await isMobileServer();
  const isWebView = await isWebViewServer();
  const AD_UNITS = getListingAdUnits(
    isMob,
    locale,
    categorySlug,
    'new',
    searchParams?.make?.slug,
    searchParams?.model?.slug,
    searchParams?.body?.slug,
  );
  const fetchVariantLevelAds = getShouldfetchVariantLevelAds(
    isSearch,
    searchParams,
  );

  const newT = await getTranslations('newCar');
  const commonT = await getTranslations('common');
  const { heading, breadcrumbs } = await (async () => {
    if (seoData) {
      return {
        heading: seoData.heading,
        breadcrumbs: seoData.breadcrumbs,
      };
    }
    const seoStrategy = new NewVehiclesListingSEOStrategy({
      language: locale,
      data: searchParams,
      isSearch,
      categorySlug,
    });
    return {
      heading: await seoStrategy.generateH1(),
      breadcrumbs: await seoStrategy.generateBreadcrumbs(),
    };
  })();

  const renderPageTitle = () => !isWebView && <PageTitle title={heading} />;
  const renderBreadcrumbs = () =>
    !isWebView && <Breadcrumbs list={breadcrumbs} />;
  const renderListings = () => (
    <Suspense
      key={`vehicleListingsKey=${JSON.stringify(searchParams)}`}
      fallback={<CarListingGridSkeleton />}
    >
      <NewVehicleResultsAndGrid
        searchParams={{ ...searchParams, ...additionalQuery }}
        categorySlug={categorySlug}
        isSearch={isSearch}
        isMob={isMob}
        locale={locale}
        fetchVariantLevelAds={fetchVariantLevelAds}
        t={t}
        showListingsOnly={showListingsOnly}
        isLanding={isLanding}
        useQueryPagination={useQueryPagination}
        prioritizeFirstImage={prioritizeFirstImage}
      />
    </Suspense>
  );

  const getFilters = () => (
    <Filters
      initialData={searchParams}
      locale={locale}
      isSearch={isSearch}
      categorySlug={categorySlug}
      quickLinks={quickLinks}
    />
  );

  const renderFullPage = () => (
    <>
      <LpvPageViewTracker filters={searchParams} />
      {!isMob && (
        <div className="flex flex-col gap-2">
          {renderBreadcrumbs()}
          {renderPageTitle()}
          <NewCarsFilterChips
            isMobile={isMob}
            initialData={searchParams}
            isSearch={isSearch}
            categorySlug={categorySlug}
          />
        </div>
      )}
      {isMob && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      {isMob && (
        <>
          {renderPageTitle()}
          <div className="flex items-center justify-start gap-2 w-full">
            {getFilters()}
          </div>
        </>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-5 lg:-mt-7">
        {!isMob && (
          <div className="w-[268px] flex flex-col gap-6">{getFilters()}</div>
        )}
        <div className="flex flex-col gap-6 min-w-0">
          {showQuickFiltersWidget && !isMob && (
            <QuickFiltersWidget
              data={searchParams}
              isSearch={isSearch}
              categorySlug={categorySlug}
            />
          )}
          {renderListings()}
        </div>
      </div>
      {isSectionEnabled(appSections.SHOWROOMS) &&
        categorySlug === newVehiclesCategorySlugs.newCars && (
          <Suspense fallback={<DealersSectionSkeleton isMobile={isMob} />}>
            <DealersWithClassification isMobile={isMob} defaultTab="new" />
          </Suspense>
        )}
      <AdBanner adConfig={AD_UNITS.searchBottomAd} />
      <Suspense
        key={`usedCarsCatalogKey=${JSON.stringify(searchParams)}`}
        fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}
      >
        <UsedCarsCatalog
          title={newT('Explore Used Cars', {
            vehicleType: newT(`${categorySlug}-plural`),
          })}
          make={searchParams.make?.slug}
          model={searchParams.model?.slug}
          queryParams={{
            priceRange: searchParams?.price,
            transmission: searchParams.transmission?.slug,
            body: searchParams.body?.slug,
            listingCategory: categorySlug,
          }}
          linkLabel={commonT('View All')}
          href={`${appPaths.usedCarsListingsSearch}${convertQueryObjToString(
            mapFiltersToQuery(searchParams),
          )}`}
          pageType={PAGE_TYPES.SEARCH_RESULTS}
          pageSection={PAGE_SECTIONS.EXPLORE_USED_CARS}
        />
      </Suspense>
      <Suspense
        key={`carNewsKey=${JSON.stringify(searchParams)}`}
        fallback={<CarNewsSectionSkeleton isMobile={isMob} />}
      >
        <CarNewsSection pageType={PAGE_TYPES.SEARCH_RESULTS} />
      </Suspense>
      {isMob && !isWebView && renderBreadcrumbs()}
    </>
  );

  return showListingsOnly ? renderListings() : renderFullPage();
};

//Merge this and used resultsAndGrid component into one
const NewVehicleResultsAndGrid = async ({
  searchParams,
  categorySlug,
  isSearch,
  isMob,
  locale,
  fetchVariantLevelAds,
  t,
  showListingsOnly,
  isLanding,
  useQueryPagination,
  prioritizeFirstImage = false,
}) => {
  const commonT = await getTranslations('common');
  const { data = [], pagination } = await fetchNewCarsListingsData(
    searchParams,
    categorySlug,
    fetchVariantLevelAds,
    { showListingsOnly },
  );

  const localizedData = data?.map((item) => {
    const order =
      item?.imported?.slug === 'yes'
        ? ['make', 'model', 'imported']
        : ['make', 'model', 'variant', 'year', 'shape'];
    return {
      ...item,
      localizedTitle: getListingTitleByLevel(
        { ...item, year: item?.launch_year },
        'variant',
        locale,
        !fetchVariantLevelAds,
        { order, t },
      ),
    };
  });
  let quickFilters;
  if (isMob) {
    quickFilters = new QuickFiltersService({
      locale,
      isMobile: isMob,
      data: searchParams,
      categorySlug,
    });
  }

  const { totalCount, currentPage } = pagination;

  const showInlineSlots =
    categorySlug === newVehiclesCategorySlugs.newCars &&
    isSearch &&
    currentPage === 1;

  const inlineSlots = showInlineSlots
    ? [
        localizedData.length >= 9 && {
          position: 9,
          content: (
            <UsedCarsCatalog
              title={commonT('Top New Cars for Sale')}
              queryParams={{ condition: 'new' }}
              href={`${appPaths.usedCarsListingsSearch}?condition=new`}
              linkLabel={commonT('View All')}
              carPurposeTitle="New Car For Sale"
              itemBasis="basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[33.5%] xl:basis-[33.5%]"
              pageType={PAGE_TYPES.SEARCH_RESULTS}
              pageSection={PAGE_SECTIONS.TOP_NEW_CARS}
            />
          ),
        },
        localizedData.length >= 18 && {
          position: 18,
          content: (
            <UsedCarsCatalog
              title={commonT('Explore New Cars for Sale')}
              queryParams={{ condition: 'new', isBasic: true }}
              href={`${appPaths.usedCarsListingsSearch}?condition=new`}
              linkLabel={commonT('View All')}
              carPurposeTitle="New Car For Sale"
              itemBasis="basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[33.5%] xl:basis-[33.5%]"
              pageType={PAGE_TYPES.SEARCH_RESULTS}
              pageSection={PAGE_SECTIONS.EXPLORE_NEW_CARS}
            />
          ),
        },
      ].filter(Boolean)
    : [];

  const renderListings = () => (
    <ListingGrid
      isLanding={isLanding}
      quickFilters={quickFilters}
      isMobile={isMob}
      data={localizedData}
      totalCount={totalCount}
      currentPage={currentPage}
      useQuery={!!isSearch || useQueryPagination}
      PageSize={newVehiclePageSize}
      CardComponent={NewVehicleListingCard}
      cardProps={{
        variantLevelDetail: fetchVariantLevelAds,
        categorySlug: categorySlug,
      }}
      showSellCarBanner={!showListingsOnly}
      inlineSlots={inlineSlots}
      pageSection={PAGE_SECTIONS.NEWLY_LAUNCHED_CARS}
      pageType={PAGE_TYPES.SEARCH_RESULTS}
      prioritizeFirstImage={prioritizeFirstImage}
    />
  );

  if (showListingsOnly) return renderListings();

  return (
    <>
      <div className="flex justify-between items-center gap-1 w-full">
        <span className="font-medium fs-body text-gray-600 md:font-sm md:font-medium md:text-gray">
          {formatNumberValue(totalCount)} {t('Results', { count: totalCount })}
        </span>
        <Sortby
          data={searchParams}
          isMobile={isMob}
          options={filterData.newListingsFilterData.sortby}
          defaultValue={filterData.NEW_VEHICLES_DEFAULT_SORT}
          icon={<ArrowDownUp className="size-[12px] text-primary" />}
        />
      </div>
      {renderListings()}
    </>
  );
};

export default NewVehicleListings;
