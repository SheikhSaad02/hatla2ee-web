import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import GroupedIndexList from '@/components/common/groupedIndexList/grouped-index-list';

import MakeModelTabs from '@/components/home/make-model-tabs';
import { MakesService } from '@/services/elasticsearch/makes-service';
import PageLayout from '@/components/layout/pageLayout';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import {
  CarNewsSectionSkeleton,
  MakeModelTabsCompactSkeleton,
} from '@/components/common/loading';
import { isMobileServer } from '@/utils/serverFunctions';
import configs from '@/configs';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
// export async function generateStaticParams() {
//   return [{ locale: 'en' }, { locale: 'ar' }];
// }
// export const dynamic = 'force-static';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('allBrandsTitle', { country: configs.country[locale].label }),
    description: '',
  };
}

const AllMakes = async ({ params }) => {
  const makesData = await MakesService.getAllMakes();
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  const metadataT = await getTranslations({ locale, namespace: 'metadata' });
  const isMobile = await isMobileServer();

  return (
    <PageLayout
      route="used-listings"
      breadCrumbsList={[
        { label: t('Cars For Sale'), href: '/' },
        { label: t('Used Cars'), href: '/car' },
      ]}
      pageTitle={metadataT('All Car Brands in {country}', {
        country: configs.country[locale].label,
      })}
      className="gap-4 lg:gap-6"
    >
      <GroupedIndexList data={makesData} locale={locale} />
      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection />
      </Suspense>
      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMobile} />}>
        <MakeModelTabs
          locale={locale}
          isMobile={isMobile}
          pageType={PAGE_TYPES.ALL_MAKES}
        />
      </Suspense>
    </PageLayout>
  );
};

export default AllMakes;
