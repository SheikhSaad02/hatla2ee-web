import {
  fetchNewCarPricesMakes,
  fetchNewCarPricesModels,
} from '@/apis/new-car-prices';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import CarPriceFilters from '@/components/common/carPriceFilters/carPriceFilters';

import { NewCarPriceChangesTable } from '@/components/car-prices/new-car-price-changes-table';
import {
  CarNewsSectionSkeleton,
  CarPricesTableSkeleton,
  MakeModelTabsCompactSkeleton,
} from '@/components/common/loading';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import MakeModelTabs from '@/components/home/make-model-tabs';
import PageLayout from '@/components/layout/pageLayout';
import { MakesService } from '@/services/elasticsearch/makes-service';
import { PricePagesSEOStrategy } from '@/services/seoStrategy/pricePages';
import {getLocaleString } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { getTranslations } from 'next-intl/server';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import { decodeSearchParams } from '@/utils/url';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { cache } from 'react';

const getPriceChangeSEOData = cache(async (locale, make, page) => {
  const makeInfo = make ? await MakesService.getMakeInfo(make) : null;
  const makeLabel = makeInfo
    ? await getLocaleString(makeInfo, 'label', locale)
    : null;
  const t = await getTranslations('carPrices');

  const pricesSEO = new PricePagesSEOStrategy({
    language: locale,
    vehicleSlug: 'car',
    vehicleLabel: t('Car'),
    makeSlug: make,
    makeLabel: makeLabel,
    page: page,
    absoluteTitle: true,
  });

  return pricesSEO.generatePriceChangeSEO();
});

export const generateMetadata = async ({ params, searchParams }) => {
  const { locale } = await params;
  const { make, page } = decodeSearchParams(await searchParams);
  const seoData = await getPriceChangeSEOData(locale, make || '', page);

  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
  };
};

export default async function Page({ params, searchParams }) {
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const make = sp.make || '';
  const page = sp.page;

  const [isMobile, seoData, makeModels] = await Promise.all([
    isMobileServer(),
    getPriceChangeSEOData(locale, make, page),
    make
      ? fetchNewCarPricesModels({ priceChange: true, make })
      : fetchNewCarPricesMakes({ priceChange: true }),
  ]);

  return (
    <PageLayout
      route="prices"
      breadCrumbsList={seoData.breadcrumbs}
      pageTitle={seoData.h1}
    >
      <CarPriceFilters
        items={makeModels}
        isMob={isMobile}
        label={make ? 'Models' : 'Brands'}
        linkTitle={'New Vehicle Prices'}
        keyword={'vehicle'}
        type={make ? 'chip' : 'optionCard'}
        threshold={isMobile ? 6 : 20}
      />

      {!make && <TotalEnergyCenterBanner locale={locale} />}

      <Suspense fallback={<CarPricesTableSkeleton isMobile={isMobile} />}>
        <NewCarPriceChangesTable
          showPagination={true}
          page={page}
          locale={locale}
          make={make}
          limit={48}
        />
      </Suspense>

      <SellCarBanner />

      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection />
      </Suspense>

      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMobile} />}>
        <MakeModelTabs
          isMobile={isMobile}
          carPurposeTitle={'Used Car For Sale'}
          tabsToShow={['bodyTypes', 'priceRanges']}
          vehicleParam="new-car"
          pageType={PAGE_TYPES.PRICE_CHANGES}
        />
      </Suspense>
    </PageLayout>
  );
}
