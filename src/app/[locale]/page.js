import {
  CarNewsSectionSkeleton,
  DealersSectionSkeleton,
  MakeModelTabsCompactSkeleton,
  NewlyLaunchedCarsSkeleton,
  PopularCitiesSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import ContactInfoSection from '@/components/common/contactInfoSection/contactInfoSection';
import HeroSectionContainer from '@/components/common/heroSection/heroSection';
import { MoreSectionsCarousel } from '@/components/common/moreSectionsCarousel/more-sections-carousel';
import DealersWithClassification from '@/components/home/dealers-section';
import HeroSection from '@/components/home/heroSection';
import HomeBannerCarousel from '@/components/home/HomeBannerCarousel';
import MakeModelTabs from '@/components/home/make-model-tabs';
import PopularCities from '@/components/home/popular-cities';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import configs, { isSectionEnabled } from '@/configs';
import { appSections } from '@/constants';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';
import AdBanner from '@/components/googleAd/adBanner';
import { isMobileServer } from '@/utils/serverFunctions';
import { getHomeAdUnits } from '@/components/googleAd/adsConfig';
import { getTranslations } from 'next-intl/server';
import TotalEnergyCenterBanner from '@/components/maintenance-center/total-energy-center';
import NewVehiclesModelCatalog from '@/components/listing/newVehicleListings/newVehiclesModelCatalog';
import PageLayout from '@/components/layout/pageLayout';
import RecentlyViewedAndSearchedWrapper from '@/components/home/recent-view-and-search-wrapper';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title', { country: configs.country[locale].label }),
    description: t('description', { country: configs.country[locale].label }),
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const isMobile = await isMobileServer();
  const AD_UNITS = getHomeAdUnits(isMobile, locale);

  return (
    <PageLayout route={'landing'}>
      <HeroSection locale={locale} />
      {!isMobile && <AdBanner adConfig={AD_UNITS?.homeHeroBanner} />}

      <Suspense
        fallback={
          <MakeModelTabsCompactSkeleton
            isMobile={isMobile}
            className="min-h-70 lg:min-h-82"
          />
        }
      >
        <MakeModelTabs
          carPurposeTitle={t('Used Car For Sale')}
          isMobile={isMobile}
          page_type={PAGE_TYPES?.HOME}
        />
      </Suspense>
      <HomeBannerCarousel prioritizeFirstBanner={isMobile} />
      <RecentlyViewedAndSearchedWrapper locale={locale} isMobile={isMobile} />
      <AdBanner adConfig={AD_UNITS?.homeTopBanner} />
      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <UsedCarsCatalog
          title={t('Explore Used Cars')}
          pageType={PAGE_TYPES?.HOME}
          pageSection={PAGE_SECTIONS?.EXPLORE_USED_CARS}
        />
      </Suspense>

      <TotalEnergyCenterBanner locale={locale} />
      <Suspense fallback={<NewlyLaunchedCarsSkeleton isMobile={isMobile} />}>
        <NewVehiclesModelCatalog
          pageType={PAGE_TYPES?.HOME}
          pageSection={PAGE_SECTIONS?.NEWLY_LAUNCHED_CARS}
          title={t('Newly Added Cars')}
        />
      </Suspense>
      <MoreSectionsCarousel />
      {!isMobile && <AdBanner adConfig={AD_UNITS?.homeBottomBanner} />}
      {isSectionEnabled(appSections.SHOWROOMS) && (
        <Suspense fallback={<DealersSectionSkeleton isMobile={isMobile} />}>
          <DealersWithClassification isMobile={isMobile} />
        </Suspense>
      )}
      {isMobile && <AdBanner adConfig={AD_UNITS?.homeBottomBanner} />}

      <Suspense fallback={<PopularCitiesSkeleton isMobile={isMobile} />}>
        <PopularCities />
      </Suspense>
      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection pageType={PAGE_TYPES?.HOME} />
      </Suspense>
      <ContactInfoSection />
    </PageLayout>
  );
}
