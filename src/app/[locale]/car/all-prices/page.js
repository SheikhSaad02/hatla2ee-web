import { fetchNewCarPricesMakes } from '@/apis/new-car-prices';
import NewCarPricesTable from '@/components/car-prices/new-car-prices-table';
import CarPriceFilters from '@/components/common/carPriceFilters/carPriceFilters';
import { PriceRangesFilter } from '@/components/common/carPriceFilters/priceRangesFilter';
import { CarPricesTableSkeleton } from '@/components/common/loading';
import NextLink from '@/components/common/nextLink';
import SellCarBanner from '@/components/common/sellCarBanner.js';
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

const getSEOData = cache(async (locale, vehicle, page, min, max) => {
  const pricesSEO = new PricePagesSEOStrategy({
    language: locale,
    vehicleSlug: vehicle,
    page: page,
    year: new Date().getFullYear(),
    condition: 'new',
    min: min,
    max: max,
    absoluteTitle: true,
  });
  return pricesSEO.generateSEO();
});

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const page = sp?.page;
  const min = sp?.min ?? null;
  const max = sp?.max ?? null;
  const vehicle = sp?.vehicle || 'car';
  const seoData = await getSEOData(locale, vehicle, page, min, max);
  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
  };
}

export default async function Page({ params, searchParams }) {
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);

  const vehicle = sp?.vehicle || 'car';
  const min = sp?.min ?? null;
  const max = sp?.max ?? null;
  const page = sp?.page;

  const [t, tSEO, seoData, filterT, isMobile, makes] = await Promise.all([
    getTranslations({ locale, namespace: 'carPrices' }),
    getTranslations({ locale, namespace: 'carPricesSeo' }),
    getSEOData(locale, vehicle, page, min, max),
    getTranslations({ locale, namespace: 'filters' }),
    isMobileServer(),
    fetchNewCarPricesMakes({ vehicle, min, max }),
  ]);
  const priceRangesData =
    tenantFilterData.getNewCarPriceRangesPriceTableFilter(filterT);
  const AD_UNITS = getCarPricesAdUnits(isMobile, locale, 'new', '', vehicle);
  const breadcrumbs = seoData?.breadcrumbs;

  return (
    <PageLayout
      route="prices"
      pageTitle={seoData.h1}
      breadCrumbsList={breadcrumbs}
      pageDescription={
        vehicle == 'car' &&
        !min &&
        !max && (
          <Text as="p" className="text-sm text-gray-light">
            {tSEO.rich('new price desc', {
              vehicle: t('Car'),
              yearRange: getYearRange(),
              country: configs.country[locale].label,
              b: (chunks) => <strong>{chunks}</strong>,
              marketLink: (chunks) => (
                <NextLink href="/car" className="text-primary">
                  {chunks}
                </NextLink>
              ),
              usedLink: (chunks) => (
                <NextLink
                  href={`${appPaths['usedCarPrices']}`}
                  className="text-primary"
                >
                  {chunks}
                </NextLink>
              ),
            })}
          </Text>
        )
      }
      className="pt-6"
    >
      <CarPriceFilters
        items={makes}
        linkTitle={'New Vehicle Prices'}
        isMob={isMobile}
        keyword={'vehicle'}
        threshold={isMobile ? 6 : 20}
        gridClassName="grid-cols-[repeat(auto-fill,minmax(100px,1fr))]"
        allowSearch={vehicle === 'car'}
      />

      <TotalEnergyCenterBanner locale={locale} />

      {vehicle == 'car' && <PriceRangesFilter priceRanges={priceRangesData} />}
      {isMobile && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      <AdBanner adConfig={AD_UNITS?.carPricesTopAd} />
      <Suspense
        key={`newCarPricesTableKey=${JSON.stringify({ min, max, page })}`}
        fallback={<CarPricesTableSkeleton isMobile={isMobile} />}
      >
        <NewCarPricesTable
          showPagination={!min && !max ? true : false}
          limit={!min && !max ? 50 : 500}
          page={page}
          locale={locale}
          vehicle={vehicle}
          showUpdateDate={true}
          min={min}
          max={max}
          redirectTo={`/${locale}/car/all-prices`}
        />
      </Suspense>

      <SellCarBanner />
    </PageLayout>
  );
}
