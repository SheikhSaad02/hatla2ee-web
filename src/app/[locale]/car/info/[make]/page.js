import { fetchMakeInfo } from '@/apis/make';
import NewCarPricesTable from '@/components/car-prices/new-car-prices-table';
import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import { MultilineCarousel } from '@/components/common/carousel/multlineCarousel';
import {
  CarNewsSectionSkeleton,
  CarPricesTableSkeleton,
  MakeModelTabsCompactSkeleton,
  UsedCarsCatalogSkeleton,
} from '@/components/common/loading';
import MakeBanner from '@/components/common/makeBanner/makeBanner';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import MakeModelTabs from '@/components/home/make-model-tabs';
import PageLayout from '@/components/layout/pageLayout';
import UsedCarsCatalog from '@/components/listing/usedCarListings/usedCarsCatalog';
import CityWiseDealers from '@/components/showroom/city-wise-dealers';
import CityWiseShowrooms from '@/components/showroom/city-wise-show-rooms';
import configs, { isSectionEnabled } from '@/configs';
import { appPaths, appSections } from '@/constants';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { ifError } from '@/utils/ifError';
import { getYearRange } from '@/utils/date';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
const getMakeInfo = cache(async (make) => {
  return fetchMakeInfo(make);
});
export async function generateMetadata({ params }) {
  const { locale, make } = await params;
  const makeData = await getMakeInfo(make);
  const metaT = await getTranslations({ locale, namespace: 'metadata' });

  if (!makeData?.error) {
    const makeLabel = await getLocaleStringServer(makeData, 'label');
    const country = configs.country[locale].label;
    return {
      title: metaT('makeInfoTitle', { make: makeLabel }),
      description: metaT('makeInfoDescription', {
        make: makeLabel,
        location: country,
      }),
    };
  }
}

const MakeInfo = async ({ params }) => {
  const { make } = await params;
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });

  const homeT = await getTranslations({ locale, namespace: 'home' });
  const metaT = await getTranslations({ locale, namespace: 'metadata' });
  const makeData = await getMakeInfo(make);

  ifError(makeData);

  const [makeLabel, makeDescription] = await Promise.all([
    getLocaleStringServer(makeData, 'label'),
    getLocaleStringServer(makeData, 'description'),
  ]);
  const sectionLinks = [
    {
      label: `${makeLabel} ${t('Showrooms')}`,
      isExternal: false,
      href: '#showroom',
    },
    {
      label: `${makeLabel} ${t('Dealers')}`,
      isExternal: false,
      href: '#dealers',
    },
    ...(isSectionEnabled(appSections.MAINTENANCE_CENTER)
      ? [
          {
            label: `${makeLabel} ${t('Car Maintenance Center')}`,
            href: `${appPaths.maintenanceCenter}/brand/${make}`,
            isExternal: true,
          },
        ]
      : []),
    {
      label: `${makeLabel} ${t('Prices')} ${getYearRange()}`,
      isExternal: false,
      href: '#price',
    },
  ];

  const commonProps = {
    makeLabel: makeLabel,
    makeSlug: make,
  };

  const isMob = await isMobileServer();

  return (
    <PageLayout
      route="brand-info"
      breadCrumbsList={[
        { label: t('Home'), href: '/' },
        { label: t('Used Cars'), href: '/car' },
        { label: makeLabel, href: `/car/info/${make}` },
      ]}
      pageTitle={isMob && metaT('makeInfoH1', { make: makeLabel })}
      pageTitleImage={isMob && makeData?.logo?.sizes?.thumbnail}
    >
      <MakeBanner
        title={!isMob && metaT('makeInfoH1', { make: makeLabel })}
        titleTag="h1"
        titleClassName={'text-3.5xl font-bold'}
        description={makeDescription}
        logo={!isMob && makeData?.logo?.sizes?.thumbnail}
        logoPosition="right"
        links={sectionLinks}
        carouselItemBasis="shrink-0"
        className="pt-3"
        src={makeData?.src}
      />
      <div>
        <h2 className="sectionHeading">
          {t('Select a {makeLabel} Model', { makeLabel })}
        </h2>
        <MultilineCarousel
          items={makeData?.models?.map((model) => ({
            ...model,
            href: `/car/${make}/${model?.slug}`,
          }))}
          width="200"
          rows={3}
          itemBasis="basis-[60%] md:basis-[18%]"
          itemClassname="justify-center"
          locale={locale}
        />
      </div>
      <Suspense
        fallback={<CarPricesTableSkeleton isMobile={isMob} columns={3} />}
      >
        <section id="price">
          <NewCarPricesTable
            sectionTitle={`${makeLabel} ${t('Prices')} ${getYearRange()}`}
            locale={locale}
            {...commonProps}
          />
        </section>
      </Suspense>
      <SellCarBanner />

      <CityWiseShowrooms {...commonProps} />

      <CityWiseDealers {...commonProps} />

      <Suspense fallback={<UsedCarsCatalogSkeleton isMobile={isMob} />}>
        <UsedCarsCatalog
          title={t('Used {make} For Sale', { make: makeLabel })}
          href={`/car/${make}`}
          make={make}
        />
      </Suspense>

      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMob} />}>
        <CarNewsSection />
      </Suspense>

      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMob} />}>
        <MakeModelTabs
          isMobile={isMob}
          tabsToShow={['makes', 'models']}
          carPurposeTitle={homeT('Used Car For Sale')}
          pageType={PAGE_TYPES.MAKE_INFO}
        />
      </Suspense>
    </PageLayout>
  );
};

export default MakeInfo;
