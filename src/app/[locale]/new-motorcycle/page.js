import React from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { MoreSectionsCarousel } from '@/components/common/moreSectionsCarousel/more-sections-carousel';
import ContactInfoSection from '@/components/common/contactInfoSection/contactInfoSection';
import { getLocale, getTranslations } from 'next-intl/server';
import QuickFiltersWidget from '@/filters/new-cars/quickFiltersWidget';
import NewCarHeroSection from '@/components/newCarLanding/newCarHeroSection';
import { newVehiclesCategorySlugs } from '@/constants';
import NewVehicleListings from '@/components/listing/newVehicleListings/newVehicleListings';
import PageLayout from '@/components/layout/pageLayout';
import { getNewVehiclesLandingMetaData } from '@/utils/new-cars/listings';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import { CarListingGridSkeleton } from '@/components/common/loading';
import { appPaths } from '@/constants';
import ViewAllLink from '@/components/common/viewAllLink/viewAllLink';
import AdBanner from '@/components/googleAd/adBanner';
import { getNewCarLandingAdUnits } from '@/components/googleAd/adsConfig';
import { isMobileServer } from '@/utils/serverFunctions';
import { decodeSearchParams } from '@/utils/url';

const categorySlug = newVehiclesCategorySlugs.newMotorcycle;

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
  const newmotorcycleT = await getTranslations({
    locale,
    namespace: 'newMotorcycle',
  });
  const isMobile = await isMobileServer();
  const AD_UNITS = getNewCarLandingAdUnits(isMobile, locale, categorySlug);
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
        categorySlug={categorySlug}
      />
      <AdBanner adConfig={AD_UNITS.newCarLandingTopAd} />

      <SellCarBanner />

      <MoreSectionsCarousel />
      {!isMobile && <AdBanner adConfig={AD_UNITS.newCarLandingMiddleAd} />}
      <section>
        <div className="flex justify-between items-center">
          <h2 className="sectionHeading">{t('Browse All Motorcycles')}</h2>
          <ViewAllLink
            href={appPaths.newMotorcycleSearch}
            title={newmotorcycleT('View All New Motorcycles')}
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
