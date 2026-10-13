import { fetchNewCarPricesMakes } from '@/apis/new-car-prices';
import { NewCarPriceChangesTable } from '@/components/car-prices/new-car-price-changes-table';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import { MultilineCarousel } from '@/components/common/carousel/multlineCarousel';
import LinkWithIcon from '@/components/common/linkWithIcon/linkWithIcon';
import {
  CarNewsSectionSkeleton,
  CarPricesTableSkeleton,
  NewVehicleGenerationPricesCardSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import MakeBanner from '@/components/common/makeBanner/makeBanner';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import Text from '@/components/common/text';
import PageLayout from '@/components/layout/pageLayout';
import { NewVehicleGenerationPricesCard } from '@/components/listing/newVehicleListings/newVehicleGenerationPricesCard';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import configs from '@/configs';
import { appPaths, IMAGES_BASE_URL, vehicleSlugLabel } from '@/constants';
import { MakesService } from '@/services/elasticsearch/makes-service';
import { PricePagesSEOStrategy } from '@/services/seoStrategy/pricePages';
import { getLocaleString, slugToTitle } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { ChevronRightIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import AdBanner from '@/components/googleAd/adBanner';
import StickyAd from '@/components/googleAd/stickyAd';
import { getCarPricesAdUnits } from '@/components/googleAd/adsConfig';
import { decodeSearchParams } from '@/utils/url';
const getMakeInfoCached = cache(async (make) => {
  const allMakes = await MakesService.getAllMakes();
  const makeInfo = allMakes.find((m) => m.slug === make);

  return makeInfo
    ? {
      ...makeInfo,
      ...(!configs.USE_BRAND_SPRITE && {
        src: `${IMAGES_BASE_URL}/${makeInfo?.slug}/thumbnail.png`,
      }),
    }
    : null;
});

async function getSEOData(locale, vehicle, makeInfo) {
  const seoT = await getTranslations({ locale, namespace: 'carPricesSeo' });

  const pricesSEO = new PricePagesSEOStrategy({
    absoluteTitle: true,
    language: locale,
    vehicleSlug: vehicle,
    makeSlug: makeInfo?.slug,
    make: makeInfo,
    //this needs to be fixed, the whole Price range seo class needs to be fixed as it is not working correctly and way too many checks are here
    makeLabel: getLocaleString(makeInfo, 'label', locale),
  });
  return pricesSEO.generateSEO();
}

export async function generateMetadata({ params, searchParams }) {
  const sp = decodeSearchParams(await searchParams);
  const { locale, make } = await params;
  const vehicle = sp?.vehicle || 'car';
  const makeInfo = await getMakeInfoCached(make);
  const seoData = await getSEOData(locale, vehicle, makeInfo);

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
  };
}

export default async function Page({ params, searchParams }) {
  const { locale, make } = await params;
  const sp = decodeSearchParams(await searchParams);
  const vehicle = sp?.vehicle || 'car';

  const isMobile = await isMobileServer();
  const t = await getTranslations({ locale, namespace: 'carPrices' });
  const AD_UNITS = getCarPricesAdUnits(isMobile, locale, 'new', make, vehicle);
  const allMakes = await fetchNewCarPricesMakes({ vehicle });
  const makeInfo = await getMakeInfoCached(make);

  if (!makeInfo) {
    notFound();
  }
  const seoData = await getSEOData(locale, vehicle, makeInfo);

  return (
    <PageLayout
      route="prices"
      breadCrumbsList={seoData.breadcrumbs}
      pageTitle={seoData.h1}
      adBanner={!isMobile && <AdBanner adConfig={AD_UNITS?.carPricesMakeAd} />}
    >
      {isMobile && <StickyAd adConfig={AD_UNITS.stickyAd} />}
      {vehicle == 'car' && (
        <MakeBanner
          slug={make}
          title={`${getLocaleString(makeInfo, 'label', locale) || slugToTitle(make)
            } ${configs.country[locale].label}`}
          logo={makeInfo?.logo}
          src={makeInfo?.src}
          logoPosition="right"
          carouselItemBasis="shrink-0"
          links={[
            {
              label: t('Used Vehicle for Sale', {
                vehicle: getLocaleString(makeInfo, 'label', locale),
              }),
              href: `${appPaths['usedCars']}/${make}`,
            },
            {
              label: t('Used Vehicle Prices', {
                vehicle: getLocaleString(makeInfo, 'label', locale),
              }),
              href: `${appPaths['usedCarPrices']}/${make}`,
            },
            {
              label: t('Last Change in Make Prices', {
                make: getLocaleString(makeInfo, 'label', locale),
              }),
              href: `${appPaths['newCarsPriceChanges']}/${make}`,
            },
            {
              label: t('More About Make', {
                make: getLocaleString(makeInfo, 'label', locale),
              }),
              href: `${appPaths['carInfo']}/${make}`,
            },
          ]}
        />
      )}
      <Suspense fallback={<NewVehicleGenerationPricesCardSkeleton />}>
        <NewVehicleGenerationPricesCard make={make} vehicle={vehicle} />
      </Suspense>

      <SellCarBanner />

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          make={make}
          href={`/car/${make}?condition=new`}
          title={t(`Available Now For Sale`)}
          queryParams={{ condition: 'new' }}
          linkLabel={t(`View All New Cars for Sale`, {
            make: getLocaleString(makeInfo, 'label', locale),
          })}
          carPurposeTitle="New Car For Sale"
        />
      </Suspense>
      {!isMobile && <AdBanner adConfig={AD_UNITS?.carPricesMakeBottomAd} />}
      <Suspense fallback={<CarPricesTableSkeleton isMobile={isMobile} />}>
        <NewCarPriceChangesTable
          make={make}
          limit={20}
          locale={locale}
          vehicle={vehicle}
          showPagination={false}
          sectionTitle={t('Last Change in Make Prices', {
            make: getLocaleString(makeInfo, 'label', locale),
          })}
          sectionLink={
            vehicle == 'car' && (
              <LinkWithIcon
                href={`/new-car/price-change/${make}`}
                title={t('View All Changes in Prices', {
                  make: getLocaleString(makeInfo, 'label', locale),
                })}
                icon={
                  <ChevronRightIcon className="w-4 h-4 text-primary rounded-xs rtl:rotate-180 shrink-0" />
                }
                iconPosition={'right'}
                className="text-primary text-xs md:text-sm font-semibold items-center"
              />
            )
          }
        />
      </Suspense>
      {isMobile && <AdBanner adConfig={AD_UNITS?.carPricesMakeBottomAd} />}
      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          href={`/car/${make}?condition=used`}
          make={make}
          queryParams={{ condition: 'used' }}
          title={t(`Used Vehicle for Sale`, {
            vehicle: getLocaleString(makeInfo, 'label', locale),
          })}
          linkLabel={t(`View All Used Cars for Sale`, {
            make: getLocaleString(makeInfo, 'label', locale),
          })}
        />
      </Suspense>

      {vehicle == 'car' && (
        <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
          <CarNewsSection />
        </Suspense>
      )}

      {allMakes.length > 0 && (
        <div className="flex flex-col gap-4">
          <Text as="h2" className="sectionHeading mb-0">
            {t('All Brands')}
          </Text>
          <MultilineCarousel
            items={allMakes}
            locale={locale}
            threshold={isMobile ? 9 : 70}
            type={'optionCard'}
            rows={2}
            gridClassName={'grid grid-cols-10 gap-3'}
            showArrows={!isMobile}
          />
        </div>
      )}
    </PageLayout>
  );
}
