import {
  fetchUsedCarPricesDetail,
  fetchUsedCarPricesStats,
} from '@/apis/used-car-prices';
import { UsedCarPricesTable } from '@/components/car-prices/used-car-prices-table';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import PriceCard from '@/components/common/carPriceCardMobile/priceCard';
import LineChart from '@/components/common/lineChart/lineChart';
import {
  CarPricesTableSkeleton,
  PriceRangeChartSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import Pagination from '@/components/common/pagination';
import PriceRangeChart from '@/components/common/priceRangeChart/priceRangeChart';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import Table from '@/components/common/table/table';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import { usedCarPriceDetailCols } from '@/data/pricingTables/usedCars/usedCarPriceDetailCols';
import { PricePagesSEOStrategy } from '@/services/seoStrategy/pricePages';
import {slugToTitle } from '@/utils/general';
import {
  getLocaleStringServer,
  isMobileServer,
  isWebViewServer,
} from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { permanentRedirect, redirect } from 'next/navigation';
import { decodeSearchParams } from '@/utils/url';
import configs from '@/configs';
import { populateFilters } from '@/utils/used-cars/listings/parsingLayer';
import {
  decideMakeModelCorrection,
  MAKE_MODEL_OUTCOMES,
  MAKE_MODEL_SHAPES,
} from '@/utils/used-cars/listings/makeModelCorrection';

const USED_CAR_PRICES_STATS_SCOPE = 'prices';
const USED_CAR_PRICES_STATS_REVALIDATE = 900; // 15 minutes

const getUsedCarPriceDetailCached = cache(
  async (make, model, year, page, locale) => {
    return fetchUsedCarPricesDetail({ make, model, year, page, locale });
  },
);

/**
 * This route has no url validator, so the make/model pair is resolved here and
 * handed to the same shared typo-correction the search routes use. Returns null
 * when the pair is valid, uncorrectable, or the check is off.
 */
const resolveMakeModelCorrection = cache(async (locale, make, model, year) => {
  if (!configs.ENABLE_FACET_CASCADE_REDIRECT) return null;

  const filters = await populateFilters({ make, model });
  if (filters?.make && filters?.model) return null;

  return decideMakeModelCorrection({
    make,
    model,
    resolvedMake: filters?.make,
    locale,
    shape: MAKE_MODEL_SHAPES.USED_PRICES,
    year,
  });
});

const getSEOData = cache(async (locale, make, model, year, page) => {
  const { meta } = await getUsedCarPriceDetailCached(
    make,
    model,
    year,
    page,
    locale,
  );
  const [makeLabel, modelLabel] = await Promise.all([
    getLocaleStringServer(meta?.make, 'label'),
    getLocaleStringServer(meta?.model, 'label'),
  ]);
  const makeTitle = makeLabel || slugToTitle(make);
  const modelTitle = modelLabel || slugToTitle(model);
  const pricesSEO = new PricePagesSEOStrategy({
    condition: 'used',
    language: locale,
    makeSlug: make,
    makeLabel: makeTitle,
    modelSlug: decodeURIComponent(model),
    modelLabel: modelTitle,
    year: year,
    page: page,
    absoluteTitle: true,
  });
  const seoData = await pricesSEO.generateSEO();
  return { seoData, makeTitle, modelTitle };
});

export async function generateMetadata({ params, searchParams }) {
  const { locale, make, model, year } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const { seoData } = await getSEOData(locale, make, model, year, page);
  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription || '',
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
  };
}

export default async function UsedPrices({ params, searchParams }) {
  const { locale, make, model, year } = await params;
  const sp = decodeSearchParams(await searchParams);
  const page = sp?.page;
  const [
    isMobile,
    t,
    commonT,
    isWebview,
    { meta, data, pagination, error },
    graphData,
    { seoData, makeTitle, modelTitle },
    makeModelCorrection,
  ] = await Promise.all([
    isMobileServer(),
    getTranslations({ locale, namespace: 'carPrices' }),
    getTranslations({ locale, namespace: 'common' }),
    isWebViewServer(),
    getUsedCarPriceDetailCached(make, model, year, page, locale),
    // Monthly aggregation, so a short TTL is plenty fresh. `cacheScope` keeps this
    // off the 24h entry the m-web detail page writes for the same URL.
    fetchUsedCarPricesStats({
      make,
      model,
      year,
      locale,
      cacheScope: USED_CAR_PRICES_STATS_SCOPE,
      fetchOptions: { next: { revalidate: USED_CAR_PRICES_STATS_REVALIDATE } },
    }),
    getSEOData(locale, make, model, year, page),
    resolveMakeModelCorrection(locale, make, model, year),
  ]);

  if (makeModelCorrection?.outcome === MAKE_MODEL_OUTCOMES.REDIRECT) {
    permanentRedirect(makeModelCorrection.path);
  }

  if (error) {
    redirect(`/${locale}/car/used-prices/${make}/${model}`);
  }

  return (
    <PageLayout
      route="prices"
      breadCrumbsList={isMobile && seoData.breadcrumbs}
    >
      {isMobile ? (
        <>
          {!isWebview && <PageTitle title={seoData.h1} />}

          <div className="flex flex-col gap-2">
            <Text as="div" className="text-sm text-gray-light text-end">
              {t('Latest Update')}: {''}
              <span className="text-gray-700 not-italic">
                {meta?.latestUpdatedOn}
              </span>
            </Text>
            <Suspense fallback={<PriceRangeChartSkeleton />}>
              <PriceRangeChart
                makeSlug={make}
                modelSlug={model}
                modelYear={year}
                showLink={false}
                showPrice={false}
              />
            </Suspense>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 md:gap-2">
          <Breadcrumbs list={seoData.breadcrumbs} />
          <div className="flex justify-between">
            <PageTitle title={seoData.h1} />
            <Text className="text-sm text-gray-light self-end italic">
              {t('Latest Update')}: {''}
              <span className="text-gray-700 not-italic">
                {meta?.latestUpdatedOn}
              </span>
            </Text>
          </div>
          <Suspense fallback={<PriceRangeChartSkeleton />}>
            <PriceRangeChart
              makeSlug={make}
              modelSlug={model}
              modelYear={year}
              showLink={false}
              showPrice={false}
            />
          </Suspense>
        </div>
      )}

      {!isMobile ? (
        <div>
          <Text as="h2" className="sectionHeading">
            {t('Prices Evolution Over Time')}
          </Text>
          <Table
            data={data}
            locale={locale}
            columns={usedCarPriceDetailCols}
            pagination={pagination}
            showPagination={true}
          />
        </div>
      ) : (
        <div>
          <Text as="h2" className="sectionHeading">
            {t('Prices Evolution Over Time')}
          </Text>
          <div className="flex flex-col pb-4 gap-2">
            {data.map((item) => (
              <PriceCard
                key={item.id}
                title={item.monthYear}
                avgPrice={item.avgPrice}
                minPrice={item.minPrice}
                maxPrice={item.maxPrice}
              />
            ))}
            <Pagination
              className="pagination-bar"
              currentPage={pagination.current_page}
              totalCount={pagination.total_count}
              totalPages={pagination?.total_pages}
            />
          </div>
        </div>
      )}

      <div>
        <Text as="h2" className="sectionHeading">
          {`${commonT('Used')} ${makeTitle} ${modelTitle} ${year} ${t(
            'Price Evolution',
          )}`}
        </Text>
        <LineChart
          data={graphData}
          tooltipProps={{
            toolTipLabel: `${makeTitle} ${modelTitle}`,
            valueAsPrice: true,
          }}
        />
      </div>

      <Suspense fallback={<CarPricesTableSkeleton isMobile={isMobile} />}>
        <UsedCarPricesTable
          make={make}
          model={model}
          locale={locale}
          sectionTitle={t('Other Years')}
          showPagination={false}
          sortParam="model_year"
          month={false}
        />
      </Suspense>

      <SellCarBanner />

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          make={make}
          model={model}
          year={year}
          queryParams={{ condition: 'used' }}
          href={`/car/${make}/${model}/year/${year}`}
          title={`${commonT(
            'Used',
          )} ${makeTitle} ${modelTitle} ${year} ${commonT('for Sale')}`}
          linkLabel={`${commonT(
            'Used',
          )} ${makeTitle} ${modelTitle} ${year} ${commonT('for Sale')}`}
        />
      </Suspense>
    </PageLayout>
  );
}
