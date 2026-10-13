import { Illustrator } from '@/components/common/illustrator/illustrator';
import { MakeModelTabsCompactSkeleton } from '@/components/common/loading';
import NextImage from '@/components/common/nextImage';
import MakeModelTabs from '@/components/home/make-model-tabs';
import PopularCities from '@/components/home/popular-cities';
import PageLayout from '@/components/layout/pageLayout';
import { getAsset } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';

export default async function NotFound() {
  const t = await getTranslations('common');
  const isMobile = await isMobileServer();
  return (
    <PageLayout route={'error'}>
      <div className="flex items-center justify-center px-10 py-30 lg:py-40">
        <Illustrator
          image={
            <NextImage
              src={getAsset('/assets/404.webp')}
              width={isMobile ? '100' : '200'}
              height={isMobile ? '100' : '200'}
            />
          }
          title={t('Page Not Found')}
          description={t(
            'The page that you have requested could not be found!',
          )}
        />
      </div>
      {/* <PopularCities citiesCount={12} showAllCities />
      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMobile} />}>
        <MakeModelTabs tabsToShow={['models']} isMobile={isMobile} />
      </Suspense> */}
    </PageLayout>
  );
}
