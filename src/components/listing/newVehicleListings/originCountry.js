import CarNewsSection from '@/components/common/carNewsSection/carNewsSection';
import { MultilineCarousel } from '@/components/common/carousel/multlineCarousel';
import { Illustrator } from '@/components/common/illustrator/illustrator';
import {
  CarNewsSectionSkeleton,
  MakeModelTabsCompactSkeleton,
} from '@/components/common/loading';
import MakeModelTabs from '@/components/home/make-model-tabs';
import { vehicleSlugLabel } from '@/constants';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
const OriginCountryPage = async ({
  locale,
  vehicleType,
  vehicleParam,
  originMakes,
}) => {
  const commonT = await getTranslations({ locale, namespace: 'common' });

  const isMobile = await isMobileServer();
  return (
    <>
      {originMakes?.length > 0 ? (
        <MultilineCarousel
          items={originMakes}
          rows={2}
          locale={locale}
          threshold={isMobile ? 9 : 20}
          itemBasis="basis-[27.5%] lg:basis-[15.9%] xl:basis-[9.3%]"
          type={'optionCard'}
          gridClassName="grid-cols-[repeat(auto-fill,minmax(150px,1fr))]"
          itemClassname="text-center whitespace-normal"
        />
      ) : (
        <Illustrator description={commonT('No data available')} />
      )}
      <Suspense fallback={<MakeModelTabsCompactSkeleton isMobile={isMobile} />}>
        <MakeModelTabs
          isMobile={isMobile}
          pageType={PAGE_TYPES.ORIGIN_COUNTRY}
          tabsToShow={
            vehicleType === 'car' ? ['bodyTypes', 'priceRanges'] : ['bodyTypes']
          }
          categorySlug={vehicleType}
          carPurposeTitle={commonT(
            `New ${vehicleSlugLabel[vehicleType]} For Sale`,
          )}
          vehicleParam={vehicleParam}
          tabsClassName="min-h-35 lg:min-h-43"
        />
      </Suspense>
      <Suspense fallback={<CarNewsSectionSkeleton isMobile={isMobile} />}>
        <CarNewsSection />
      </Suspense>
    </>
  );
};

export default OriginCountryPage;
