import { fetchUsedCarPriceMakeModels } from '@/apis/used-car-prices';
import { UsedCarPricesTable } from '@/components/car-prices/used-car-prices-table';
import CarPriceFilters from '@/components/common/carPriceFilters/carPriceFilters';
import { PriceRangesFilter } from '@/components/common/carPriceFilters/priceRangesFilter';
import { CarPricesTableSkeleton } from '@/components/common/loading';
import NextLink from '@/components/common/nextLink';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import { appPaths } from '@/constants';
import tenantFilterData from '@data';
import { PricePagesSEOStrategy } from '@/services/seoStrategy/pricePages';
import { getYearRange } from '@/utils/date';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { isMobileServer } from '@/utils/serverFunctions';
import configs from '@/configs';
import AdBanner from '@/components/googleAd/adBanner';
import StickyAd from '@/components/googleAd/stickyAd';
import { getCarPricesAdUnits } from '@/components/googleAd/adsConfig';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import { decodeSearchParams } from '@/utils/url';
import { cache } from 'react';

const getSEOData = cache(async (locale, page, min, max) => {
  const pricesSEO = new PricePagesSEOStrategy({
    condition: 'used',
    language: locale,
    page: page,
    vehicleSlug: 'car',
    min: min,
    max: max,
    absoluteTitle: true,
  });
  return pricesSEO.generateSEO();
});

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const seoData = await getSEOData(
    locale,
    sp?.page,
    sp?.min ?? null,
    sp?.max ?? null,
  );
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
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const min = sp?.min ?? null;
  const max = sp?.max ?? null;
  const page = sp?.page;

  const [t, filterT, seoData, isMobile, makesRes] = await Promise.all([
    getTranslations({ locale, namespace: 'carPrices' }),
    getTranslations({ locale, namespace: 'filters' }),
    getSEOData(locale, page, min, max),
    isMobileServer(),
    fetchUsedCarPriceMakeModels({ min, max }),
  ]);
  const makes = makesRes?.items ?? [];
  const priceRangesData =
    tenantFilterData.getUsedCarPriceRangesPriceTableFilter(filterT);
  const AD_UNITS = getCarPricesAdUnits(isMobile, locale, 'used', '', 'cars');
  return (
    <PageLayout
      route="prices"
      breadCrumbsList={seoData.breadcrumbs}
      pageTitle={seoData.h1}
      pageDescription={
        !min &&
        !max && (
          <Text as="p" className="text-sm text-gray-light">
            {t('used price desc', { country: configs.country[locale].label })}
            <NextLink
              href={`${appPaths['new-car-prices']}`}
              className={'text-primary'}
            >
              {t('New Car Prices')} {getYearRange()}
            </NextLink>
          </Text>
        )
      }
      className="pt-6"
    >
      <CarPriceFilters
        items={makes}
        isMob={isMobile}
        linkTitle={'Used Vehicle Prices'}
        keyword={'vehicle'}
        gridClassName="grid-cols-[repeat(auto-fill,minmax(100px,1fr))]"
        allowSearch
      />

      <TotalEnergyCenterBanner locale={locale} />

      <PriceRangesFilter priceRanges={priceRangesData} />
      {isMobile && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      {isMobile && <AdBanner adConfig={AD_UNITS?.carPricesTopAd} />}

      <Suspense
        key={`usedCarPricesTableKey=${JSON.stringify({ min, max, page })}`}
        fallback={<CarPricesTableSkeleton isMobile={isMobile} />}
      >
        <UsedCarPricesTable
          redirectTo={`/${locale}/car/used-prices`}
          limit={!min && !max ? 100 : 500}
          showPagination={!min && !max ? true : false}
          page={page}
          locale={locale}
          min={min}
          max={max}
          monthFilter={true}
        />
      </Suspense>
    </PageLayout>
  );
}
