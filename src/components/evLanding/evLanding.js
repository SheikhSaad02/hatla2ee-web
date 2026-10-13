import { getLocale, getTranslations } from 'next-intl/server';
import HeroSectionContainer from '../common/heroSection/heroSection';
import UsedCarLandingSearch from '../landingSearch/usedCarLandingSearch';
import { isMobileServer } from '@/utils/serverFunctions';
import { getAsset } from '@/utils/general';
import {
  EV_USED_CARS_SEARCH_URL,
  EV_FUEL_OPTIONS,
  EV_FUEL_FILTER,
  EV_NEW_CAR_FUEL_PARAM,
  EV_MAKE_SCOPE_FILTERS,
} from './data';
import {
  newElectricCarsSearchLink,
  batteryCapacityTabItems,
  kmRangeTabItems,
} from '@/utils/electric-car';
import MakeModelTabs from '@/components/home/make-model-tabs';
import UsedCarsCatalog from '../listing/usedCarListings/usedCarsCatalog';
import NewVehiclesModelCatalog from '../listing/newVehicleListings/newVehiclesModelCatalog';
import PromoBanner from '../common/promoBanner';
import LowMaintenanceSection from './lowMaintenanceSection';
import ChooseRightEvSection from './chooseRightEvSection';
import CostCalculator from './costCalculator';
// import ChargingStationsSection from './chargingStationsSection';
import EvShowroomsSection from './showroomsSection';
import PopularCities from '@/components/home/popular-cities';
import EvFaqSection from './faqSection';
import { Plus } from 'lucide-react';
import { appPaths } from '@/constants';
import { ConditionalSuspense as Suspense } from '../common/ConditionalSuspense';
import {
  QuickFiltersWidgetSkeleton,
  UsedCarsCatalogSkeleton,
  NewlyLaunchedCarsSkeleton,
  ShowroomsSectionSkeleton,
} from '../common/loading';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';

export default async function EvLanding() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'evLanding' });
  const isMobile = await isMobileServer();

  return (
    <>
      <HeroSectionContainer
        imageSrc={getAsset(
          `/assets/landing/ev-car-banner-${isMobile ? 'mweb' : 'web'}.webp`,
        )}
      >
        <div className="space-y-3 md:space-y-6 md:pt-10 w-full">
          <h1 className="heroHeading">{t('heroHeading')}</h1>

          <div className="md:max-w-[50%]">
            <UsedCarLandingSearch
              isMobile={isMobile}
              className="gap-2.5 md:gap-4 flex-col"
              browseAllHref={EV_USED_CARS_SEARCH_URL}
              fuelOptions={EV_FUEL_OPTIONS}
            />
          </div>
        </div>
      </HeroSectionContainer>

      <Suspense fallback={<QuickFiltersWidgetSkeleton isMobile={isMobile} />}>
        <MakeModelTabs
          isMobile={isMobile}
          locale={locale}
          tabsToShow={['makes', 'models', 'cities', 'priceRanges']}
          pageType={PAGE_TYPES?.ELECTRIC_CARS}
          hideCounts
          scopeFilters={{ fuel: EV_FUEL_OPTIONS.map((o) => o.value) }}
          makesScopeFilters={EV_MAKE_SCOPE_FILTERS}
          extraTabs={[
            {
              label: 'Battery Capacity',
              value: 'battery-capacity',
              items: batteryCapacityTabItems,
            },
            {
              label: 'Km Range',
              value: 'km-range',
              items: kmRangeTabItems,
            },
          ]}
        />
      </Suspense>

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          title={t('topElectricCarsForSale')}
          href={EV_USED_CARS_SEARCH_URL}
          linkLabel={t('viewAllUsedElectricCars')}
          queryParams={{ fuel: EV_FUEL_FILTER }}
          pageType={PAGE_TYPES?.ELECTRIC_CARS}
          pageSection={PAGE_SECTIONS.TOP_ELECTRIC_CARS_FOR_SALE}
        />
      </Suspense>

      <PromoBanner
        image={getAsset('/assets/landing/ev_banner_image.webp')}
        title={t('sellEvTitle')}
        description={t('sellEvSubtitle')}
        buttonLabel={t('sellEvCta')}
        buttonHref={appPaths.postListing}
        buttonIcon={<Plus className="size-4" />}
        trackSellEv
      />

      <Suspense fallback={<NewlyLaunchedCarsSkeleton isMobile={isMobile} />}>
        <NewVehiclesModelCatalog
          title={t('newlyAddedTitle')}
          linkLabel={t('viewAllNewElectricCars')}
          viewAllHref={newElectricCarsSearchLink}
          queryParams={EV_NEW_CAR_FUEL_PARAM}
          pageType={PAGE_TYPES?.ELECTRIC_CARS}
          pageSection={PAGE_SECTIONS?.NEWLY_ADDED_ELECTRIC_CARS}
        />
      </Suspense>

      {/* ── 6. Low Maintenance, Big Savings (educational) ─────────────────── */}
      <LowMaintenanceSection />

      {/* ── 7. Choose the Right EV for You (EV / REEV / PHEV) ──────────────── */}
      <ChooseRightEvSection />

      {/* ── 8. Calculate Electric vs Petrol Savings ───────────────────────── */}
      <CostCalculator />

      {/* ── 9. Popular Electric Car Showrooms (agencies?f[vehicle_type]=ev) ──── */}
      <Suspense fallback={<ShowroomsSectionSkeleton isMobile={isMobile} />}>
        <EvShowroomsSection isMobile={isMobile} />
      </Suspense>

      {/* ── 10. EV Charging Stations in Egypt (sample data; Places = next step) ── */}
      {/* Hidden to stop Google Places/Maps billing. */}
      {/* <ChargingStationsSection /> */}

      {/* ── 11. Browse by City or District (reuses home PopularCities) ────────
        City links carry the EV fuel preset (Electric 33 + Plug-in Hybrid 35),
        built via buildUsedCarListingUrl → /car/search query version. */}
      {/* No citiesCount: show all cities so it renders as the carousel (like home);
          MultilineCarousel only switches to a carousel above 18 items. */}
      <PopularCities
        scopeFilters={{ fuel: EV_FUEL_OPTIONS.map((o) => o.value) }}
      />

      <EvFaqSection />
    </>
  );
}
