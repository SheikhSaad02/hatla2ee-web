import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import GroupedIndexList from '@/components/common/groupedIndexList/grouped-index-list';
import {
  CarNewsSectionSkeleton,
  MakeModelTabsCompactSkeleton,
} from '@/components/common/loading';
import MakeModelTabs from '@/components/home/make-model-tabs';
import PageLayout from '@/components/layout/pageLayout';
import { LocationsService } from '@/services/elasticsearch/location-service';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { isMobileServer } from '@/utils/serverFunctions';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
// export async function generateStaticParams() {
//   return [{ locale: 'en' }, { locale: 'ar' }];
// }

// export const dynamic = 'force-static';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('allCitiesTitle'),
    // description: t('description'),
  };
}

const AllCities = async ({ params }) => {
  const { locale } = await params;
  const citiesData = await LocationsService.fetchAllLocations();
  const t = await getTranslations({ locale, namespace: 'common' });
  const isMobile = await isMobileServer();

  return (
    <PageLayout
      route="used-listings"
      breadCrumbsList={[
        { label: t('Cars For Sale'), href: '/' },
        { label: t('Used Cars'), href: '/car' },
      ]}
      pageTitle={t('Used car for sale in your city')}
      // className="gap-4 lg:gap-6"
    >
      <GroupedIndexList data={citiesData} type="city" locale={locale} />
      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection />
      </Suspense>
      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMobile} />}>
        <MakeModelTabs
          locale={locale}
          isMobile={isMobile}
          pageType={PAGE_TYPES.ALL_CITIES}
        />
      </Suspense>
    </PageLayout>
  );
};

export default AllCities;
