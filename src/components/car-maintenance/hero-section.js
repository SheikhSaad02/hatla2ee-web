import HeroSectionContainer from '@/components/common/heroSection/heroSection';
import Button from '@/components/common/button/button';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { appPaths } from '@/constants';
import { getAsset } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function CarMaintenanceHeroSection({ title }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'carMaintenance' });
  const isMobile = await isMobileServer();

  return (
    <HeroSectionContainer
      imageSrc={
        isMobile
          ? getAsset('/assets/landing/car-maintenance-mweb.webp')
          : getAsset('/assets/landing/maintainanceHeroBanner.webp')
      }
      className="items-center"
    >
      <div className="w-full md:w-[48%] space-y-2 md:space-y-5 pt-14 md:pt-8">
        <h1 className="heroHeading">{title}</h1>
        <p className="max-w-[34rem] text-sm leading-6 max-sm:pb-3 text-slate-200  md:text-base">
          {t('hero_subtitle')}
        </p>

        <ClickEventTracker
          gaEvent="go_to_my_garage_click"
          eventGroup="carMaintenance"
        >
          <NextLink
            href={appPaths.carMaintenanceMyGarage}
            className="inline-flex"
          >
            <Button
              size="xl"
              variant="secondary"
              className="text-sm font-semibold text-gray-900"
              icon={<ChevronRight className="size-4 flipX" />}
              iconPosition="right"
            >
              {t('add_your_car')}
            </Button>
          </NextLink>
        </ClickEventTracker>
      </div>
    </HeroSectionContainer>
  );
}
