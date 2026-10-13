import {
  QuickFiltersWidgetSkeleton,
  UsedCarsCatalogSkeleton,
} from '../common/loading';
import { getLocale, getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '../common/ConditionalSuspense';

import ContactInfoSection from '../common/contactInfoSection/contactInfoSection';
import { MoreSectionsCarousel } from '../common/moreSectionsCarousel/more-sections-carousel';
import SellCarBanner from '../common/sellCarBanner.js';
import UsedCarsListings from '../listing/usedCarListings/usedCarsListings';
import HeroSectionContainer from '../common/heroSection/heroSection';
import configs from '@/configs';
import UsedCarLandingSearch from '../landingSearch/usedCarLandingSearch';
import { isMobileServer } from '@/utils/serverFunctions';
import ViewAllLink from '../common/viewAllLink/viewAllLink';
import { appPaths } from '@/constants';
import { getAsset } from '@/utils/general';
import AdBanner from '../googleAd/adBanner';
import {
  getUsedCarLandingAdUnits,
  getListingAdUnits,
} from '../googleAd/adsConfig';
import TotalEnergyCenterBanner from '../maintenance-center/total-energy-center';
import QuickFiltersWidget from '@/filters/quickFiltersWidget';
import { PAGE_TYPES, PAGE_SECTIONS } from '@/services/analyticsService/constants';
export default async function UsedCarLanding({ params, queryParams }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'home' });
  const listingsT = await getTranslations({
    locale,
    namespace: 'usedCarsListingSeo',
  });
  const commonT = await getTranslations('common');
  const isMobile = await isMobileServer();
  const AD_UNITS = getUsedCarLandingAdUnits(isMobile, locale);
  const LISTING_AD_UNIT = getListingAdUnits(isMobile, locale, 'cars', 'used');
  return (
    <>
      <HeroSectionContainer
        imageSrc={
          isMobile
            ? getAsset('/assets/landing/used-car-banner-sm-latest.webp')
            : getAsset('/assets/landing/used-car-latest-banner.webp')
        }
      >
        <div className="space-y-3 md:space-y-6 md:pt-10 w-full ">
          <h1 className="heroHeading">
            {listingsT('h1_country_default', {
              country: configs.country[locale].label,
            })}
          </h1>

          <div className="md:max-w-[50%]">
            <UsedCarLandingSearch
              isMobile={isMobile}
              className="gap-2.5 md:gap-4 flex-col"
            />
          </div>
        </div>
      </HeroSectionContainer>
      {!isMobile && <AdBanner adConfig={AD_UNITS?.usedCarHeroBanner} />}
      <Suspense fallback={<QuickFiltersWidgetSkeleton locale={locale} />}>
        <QuickFiltersWidget
          data={{}}
          urlArray={[]}
          filter={{}}
          isSearch={false}
          isLanding={true}
          page_type={PAGE_TYPES?.USED_CAR_LANDING}
        />
      </Suspense>
      {!isMobile && <AdBanner adConfig={AD_UNITS?.usedCarLandingTopAd} />}
      <SellCarBanner prioritizeImage={isMobile} />
      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMobile} />}>
        <section>
          <div className="flex justify-between items-center">
            <h2 className="sectionHeading">{t('Browse All Cars')}</h2>
            <ViewAllLink
              href={appPaths.usedCarsListingsSearch}
              title={commonT('View All Used Cars for Sale')}
              gaEvent="view_all_link_click"
              pageType={PAGE_TYPES?.USED_CAR_LANDING}
              pageSection={PAGE_SECTIONS.EXPLORE_USED_CARS}
            />
          </div>
          <UsedCarsListings isSearch={false} isLanding={true} />
        </section>
      </Suspense>
      <TotalEnergyCenterBanner locale={locale} />

      <MoreSectionsCarousel />

      {isMobile && (
        <AdBanner adConfig={LISTING_AD_UNIT?.usedCarLandingListingsAd} />
      )}
      <ContactInfoSection />
    </>
  );
}
