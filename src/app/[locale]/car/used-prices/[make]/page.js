import {
  getLocaleStringServer,
  isMobileServer,
  isWebViewServer,
} from '@/utils/serverFunctions';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import { MultilineCarousel } from '@/components/common/carousel/multlineCarousel';

import { fetchUsedCarPriceMakeModels } from '@/apis/used-car-prices';
import { UsedCarPricesTable } from '@/components/car-prices/used-car-prices-table';
import {
  CarNewsSectionSkeleton,
  CarPricesTableSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import configs from '@/configs';
import { appPaths, IMAGES_BASE_URL } from '@/constants';
import { PricePagesSEOStrategy } from '@/services/seoStrategy/pricePages';
import { getYearRange } from '@/utils/date';
import {getLocaleString, slugToTitle } from '@/utils/general';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import AdBanner from '@/components/googleAd/adBanner';
import { getCarPricesAdUnits } from '@/components/googleAd/adsConfig';
import StickyAd from '@/components/googleAd/stickyAd';
import { decodeSearchParams } from '@/utils/url';
import { PAGE_TYPES, PAGE_SECTIONS } from '@/services/analyticsService/constants';
const getMakeModelInfoCached = cache(async (make, t) => {
  const { meta: makeInfo, items: models } = await fetchUsedCarPriceMakeModels({
    make,
    t,
  });
  const makeLabel =
    (await getLocaleStringServer(makeInfo, 'label')) || slugToTitle(make);
  return { makeInfo: { ...makeInfo, label: makeLabel }, models };
});

async function loadSEOData(
  locale,
  make,
  makeLabel,
  condition = 'used',
  page,
  index_page,
) {
  const pricesSEO = new PricePagesSEOStrategy({
    condition,
    language: locale,
    makeSlug: make,
    makeLabel,
    page: page,
    absoluteTitle: true,
    index_page,
  });
  return pricesSEO.generateSEO();
}

export async function generateMetadata({ params, searchParams }) {
  const { locale, make } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: 'carPrices' });

  const { makeInfo, models } = await getMakeModelInfoCached(make, t);
  const seoData = await loadSEOData(
    locale,
    make,
    makeInfo.label,
    'used',
    page,
    models?.length > 1,
  );

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription || '',
    robots: seoData.robotsTag,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
  };
}

export default async function UsedPrices({ params, searchParams }) {
  const { locale, make } = await params;
  const sp = decodeSearchParams(await searchParams);
  const page = Number(sp?.page || 1);
  const isWebview = await isWebViewServer();

  const isMobile = await isMobileServer();
  const t = await getTranslations({ locale, namespace: 'carPrices' });
  const commonT = await getTranslations({ locale, namespace: 'common' });

  const { makeInfo, models } = await getMakeModelInfoCached(make, t);
  const seoData = await loadSEOData(locale, make, makeInfo.label, 'used', page);
  const AD_UNITS = getCarPricesAdUnits(isMobile, locale, 'used', make, 'cars');
  function renderTextContent() {
    return (
      <>
        {!isWebview && <PageTitle title={seoData.h1} />}
        <Text as="p" className="text-sm text-gray-light">
          {t('used price desc', { country: configs.country[locale].label })}
          <NextLink
            href={`${appPaths['new-car-prices']}`}
            className={'text-primary'}
          >
            {t('New Car Prices')} {getYearRange()}
          </NextLink>
        </Text>
      </>
    );
  }

  const getLinkTitle = (item) => {
    return t('used_car_prices', { label: item.label });
  };
  return (
    <PageLayout
      route="prices"
      breadCrumbsList={isMobile && seoData.breadcrumbs}
    >
      {isMobile ? (
        renderTextContent()
      ) : (
        <>
          <div className="flex gap-9">
            <div className="flex flex-col gap-4 md:gap-2">
              <Breadcrumbs list={seoData.breadcrumbs} />
              {renderTextContent()}
            </div>

            <div className="flex flex-col gap-2 items-center text-center justify-center bg-gray-50 rounded-lg w-[142px] shrink-0 p-4">
              {makeInfo?.src && (
                <NextImage
                  src={makeInfo?.src}
                  width={46}
                  height={46}
                  className={'w-[46px] h-[46px] object-contain'}
                />
              )}
              <NextLink
                href={`${appPaths.carInfo}/${make}`}
                title={commonT('More About Make', { make: makeInfo.label })}
                className="text-primary font-bold text-sm"
              >
                {makeInfo.label} {configs.country[locale].label}
              </NextLink>
            </div>
          </div>{' '}
        </>
      )}
      {models.length > 0 && (
        <div className="flex flex-col gap-2">
          <Text as="h2" className="text-base text-grey-900 font-medium">
            {commonT('Models')}
          </Text>

          <MultilineCarousel
            type={'chip'}
            items={models}
            locale={locale}
            threshold={isMobile ? 4 : 20}
            itemClassname="justify-center"
            getLinkTitle={getLinkTitle}
            showArrows={!isMobile}
          />
        </div>
      )}
      {isMobile && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      {isMobile && <AdBanner adConfig={AD_UNITS?.carPricesMakeAd} />}
      {/* <Suspense fallback={<CarPricesTableSkeleton isMobile={isMobile} />}> */}
      <UsedCarPricesTable
        limit={500}
        showPagination={false}
        page={page}
        locale={locale}
        make={make}
        monthFilter={true}
        redirectTo={`/${locale}/car/used-prices`}
      />
      {/* </Suspense> */}
      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          make={make}
          queryParams={{ condition: 'used' }}
          href={`/car/${make}`}
          title={`${commonT('Used')} ${makeInfo.label} ${commonT('for Sale')}`}
          linkLabel={`${commonT('Used')} ${makeInfo.label} ${commonT(
            'for Sale',
          )}`}
          pageType={PAGE_TYPES.USED_CAR_PRICES}
          pageSection={PAGE_SECTIONS.EXPLORE_USED_CARS}
        />
      </Suspense>
      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection pageType={PAGE_TYPES.USED_CAR_PRICES} />
      </Suspense>
    </PageLayout>
  );
}
