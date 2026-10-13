import { getLocale, getTranslations } from 'next-intl/server';
import ContactInfoSection from '@/components/common/contactInfoSection/contactInfoSection';
import DealersWithClassification from '@/components/home/dealers-section';

import { MoreSectionsCarousel } from '@/components/common/moreSectionsCarousel/more-sections-carousel';
import NewCarHeroSection from '@/components/newCarLanding/newCarHeroSection';
import NewVehicleListings from '@/components/listing/newVehicleListings/newVehicleListings';
import NewVehiclesModelCatalog from '@/components/listing/newVehicleListings/newVehiclesModelCatalog';
import PageLayout from '@/components/layout/pageLayout';
import QuickFiltersWidget from '@/filters/new-cars/quickFiltersWidget';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import { appPaths, appSections, newVehiclesCategorySlugs } from '@/constants';
import { getNewVehiclesLandingMetaData } from '@/utils/new-cars/listings';
import TopSearchedNewCars from '@/components/listing/newVehicleListings/topSearchedNewCars';
import DiscountsAndOffersNewCars from '@/components/listing/newVehicleListings/discountsAndOffersNewCars';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import { isMobileServer } from '@/utils/serverFunctions';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import {
  CarListingGridSkeleton,
  DealersSectionSkeleton,
  NewlyLaunchedCarsSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';
import ViewAllLink from '@/components/common/viewAllLink/viewAllLink';
import AdBanner from '@/components/googleAd/adBanner';
import { getNewCarLandingAdUnits } from '@/components/googleAd/adsConfig';
import { isSectionEnabled } from '@/configs';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import { decodeSearchParams } from '@/utils/url';

const categorySlug = newVehiclesCategorySlugs.newCars;

export async function generateMetadata({ params, searchParams }) {
  const { h1, ...metaData } = await getNewVehiclesLandingMetaData({
    params,
    searchParams,
    categorySlug,
  });

  return metaData;
}

const page = async ({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}) => {
  const params = await paramsPromise;
  const searchParams = decodeSearchParams(await searchParamsPromise);
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'home' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const isMobile = await isMobileServer();
  const AD_UNITS = getNewCarLandingAdUnits(isMobile, locale);
  const { h1 } = await getNewVehiclesLandingMetaData({
    params,
    searchParams,
    categorySlug,
  });

  return (
    <PageLayout route="new-landing">
      <NewCarHeroSection title={h1} categorySlug={categorySlug} />
      {!isMobile && <AdBanner adConfig={AD_UNITS.newCarHeroBanner} />}
      <QuickFiltersWidget
        data={{}}
        isSearch={false}
        isLanding={true}
        page_type={PAGE_TYPES?.NEW_CAR_LANDING}
        categorySlug={categorySlug}
      />
      <AdBanner adConfig={AD_UNITS.newCarLandingTopAd} />

      <TotalEnergyCenterBanner locale={locale} />

      <Suspense fallback={<NewlyLaunchedCarsSkeleton />}>
        <TopSearchedNewCars />
      </Suspense>

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          title={commonT('Top New Cars for Sale')}
          queryParams={{ condition: 'new' }}
          href={`${appPaths.usedCarsListingsSearch}?condition=new`}
          linkLabel={commonT('View All')}
          carPurposeTitle="New Car For Sale"
          pageType={PAGE_TYPES?.NEW_CAR_LANDING}
          pageSection={PAGE_SECTIONS?.TOP_NEW_CARS}
        />
      </Suspense>

      <Suspense fallback={<NewlyLaunchedCarsSkeleton />}>
        <DiscountsAndOffersNewCars />
      </Suspense>
      {!isMobile && <AdBanner adConfig={AD_UNITS.newCarLandingMiddleAd} />}
      {isSectionEnabled(appSections.SHOWROOMS) && (
        <Suspense fallback={<DealersSectionSkeleton isMobile={isMobile} />}>
          <DealersWithClassification
            isMobile={isMobile}
            defaultTab="new"
            pageType={PAGE_TYPES?.NEW_CAR_LANDING}
          />
        </Suspense>
      )}

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <NewVehiclesModelCatalog
          title={commonT('Newly Added Cars')}
          pageType={PAGE_TYPES?.NEW_CAR_LANDING}
          pageSection={PAGE_SECTIONS?.NEWLY_LAUNCHED_CARS}
          viewAllHref={appPaths.newCarsListingsSearch}
        />
      </Suspense>

      <AdBanner adConfig={AD_UNITS.newCarLandingBottomAd} />

      <SellCarBanner />

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          title={commonT('Explore New Cars for Sale')}
          queryParams={{ condition: 'new', isBasic: true }}
          href={`${appPaths.usedCarsListingsSearch}?condition=new`}
          linkLabel={commonT('View All')}
          carPurposeTitle="New Car For Sale"
          pageType={PAGE_TYPES?.NEW_CAR_LANDING}
          pageSection={PAGE_SECTIONS?.EXPLORE_NEW_CARS}
        />
      </Suspense>

      <MoreSectionsCarousel />
      <section>
        <div className="flex justify-between items-center">
          <h2 className="sectionHeading">{t('Browse All Cars')}</h2>
          <ViewAllLink
            href={appPaths.newCarsListingsSearch}
            title={commonT('View All New Cars')}
          />
        </div>
        <Suspense fallback={<CarListingGridSkeleton />}>
          <NewVehicleListings
            isLanding={true}
            searchParams={searchParams}
            isSearch={false}
            categorySlug={categorySlug}
            showListingsOnly
          />
        </Suspense>
      </section>

      <ContactInfoSection />
    </PageLayout>
  );
};

export default page;
