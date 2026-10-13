import { fetchUsedCarPrices } from '@/apis/used-car-prices';
import { UsedCarPricesTable } from '@/components/car-prices/used-car-prices-table';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import LineChart from '@/components/common/lineChart/lineChart';
import {
  CarNewsSectionSkeleton,
  CarPricesTableSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import NextLink from '@/components/common/nextLink';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import { appPaths } from '@/constants';
import { PricePagesSEOStrategy } from '@/services/seoStrategy/pricePages';
import { getYearRange } from '@/utils/date';
import {slugToTitle } from '@/utils/general';
import { getLocaleStringServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { isMobileServer } from '@/utils/serverFunctions';
import configs from '@/configs';
import { decodeSearchParams } from '@/utils/url';

const getUsedCarPricesCached = cache(async ({ make, model }) => {
  return fetchUsedCarPrices({
    make,
    model,
    monthFilter: true,
    sortParam: 'model_year',
  });
});

async function getSEOData({
  locale,
  make,
  makeTitle,
  model,
  modelTitle,
  page,
}) {
  const pricesSEO = new PricePagesSEOStrategy({
    condition: 'used',
    language: locale,
    makeSlug: make,
    makeLabel: makeTitle,
    modelSlug: decodeURIComponent(model),
    modelLabel: modelTitle,
    page: page,
    absoluteTitle: true,
  });
  return pricesSEO.generateSEO();
}

export async function generateMetadata({ params, searchParams }) {
  const { locale, make, model } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const { meta } = await getUsedCarPricesCached({ make, model });
  const makeTitle =
    (await getLocaleStringServer(meta?.make, 'label')) || slugToTitle(make);
  const modelTitle =
    (await getLocaleStringServer(meta?.model, 'label')) || slugToTitle(model);
  const seoData = await getSEOData({
    locale,
    make,
    makeTitle,
    model,
    modelTitle,
    page,
  });
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
  const { locale, make, model } = await params;
  const sp = decodeSearchParams(await searchParams);
  const page = Number(sp?.page || 1);

  const t = await getTranslations({ locale, namespace: 'carPrices' });
  const commonT = await getTranslations({ locale, namespace: 'common' });

  const { meta, data } = await getUsedCarPricesCached({ make, model });
  const makeTitle =
    (await getLocaleStringServer(meta?.make, 'label')) || slugToTitle(make);
  const modelTitle =
    (await getLocaleStringServer(meta?.model, 'label')) || slugToTitle(model);
  const seoData = await getSEOData({
    locale,
    make,
    makeTitle,
    model,
    modelTitle,
    page,
  });
  const isMobile = await isMobileServer();

  function getGraphData(data) {
    return data?.map((item) => ({
      name: item.year,
      value: item.avgPrice,
    }));
  }

  return (
    <PageLayout
      route="prices"
      breadCrumbsList={seoData.breadcrumbs}
      pageTitle={seoData.h1}
      pageDescription={
        <Text as="p" className="text-sm text-gray-light">
          {t('used price desc', { country: configs.country[locale].label })}
          <NextLink
            href={`${appPaths['new-car-prices']}`}
            className={'text-primary'}
          >
            {t('New Car Prices')} {getYearRange()}
          </NextLink>
        </Text>
      }
    >
      <Suspense fallback={<CarPricesTableSkeleton isMobile={isMobile} />}>
        <UsedCarPricesTable
          showPagination={true}
          page={page}
          locale={locale}
          make={make}
          model={model}
          monthFilter={true}
          sortParam="model_year"
          redirectTo={`/${locale}/car/used-prices/${make}`}
        />
      </Suspense>

      <div>
        <Text as="h2" className="sectionHeading">
          {commonT('Used')} {makeTitle} {modelTitle} {t('Price Evolution')}
        </Text>
        <LineChart
          data={getGraphData(data)}
          tooltipProps={{
            toolTipLabel: `${makeTitle} ${modelTitle}`,
            valueAsPrice: true,
          }}
        />
      </div>

      <SellCarBanner />
      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          make={make}
          model={model}
          href={`/car/${make}/${model}`}
          queryParams={{ condititon: 'used' }}
          title={`${commonT('Used')} ${makeTitle} ${modelTitle} ${commonT(
            'for Sale',
          )}`}
          linkLabel={`${commonT('Used')} ${makeTitle}  ${modelTitle} ${commonT(
            'for Sale',
          )}`}
        />
      </Suspense>

      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection />
      </Suspense>
    </PageLayout>
  );
}
