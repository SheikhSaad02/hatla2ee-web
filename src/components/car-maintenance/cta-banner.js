import BaseCard from '@/components/common/baseCard/baseCard';
import Button from '@/components/common/button/button';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import Text from '@/components/common/text';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { appPaths } from '@/constants';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { getLocale, getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import MaintenanceNotificationCard from './maintenance-notification-card';

const bannerImage = {
  phone: '/assets/more/maintainance-car-banner/maintainceBannerImage.webp',
  car: '/assets/more/maintainance-car-banner/maintainanceBannerCarImage.webp',
};

export default async function CarMaintenanceCtaBanner() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: 'carMaintenance',
  });

  return (
    <ClickEventTracker
      gaEvent="go_to_my_garage_click"
      eventGroup="carMaintenance"
    >
      <NextLink href={appPaths.carMaintenanceMyGarage} className="block">
        <BaseCard
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className={cn(
            'flex min-h-[130px] w-full flex-row items-center justify-between',
            'gap-3 rounded-xl border-none bg-[#1A293D] shadow-none',
            'cursor-pointer md:h-[200px] md:gap-5 md:rounded-2xl md:px-0 overflow-hidden',
          )}
        >
          <div className="relative self-end ms-8 hidden md:block  ">
            <NextImage
              src={getAsset(bannerImage.phone)}
              alt=""
              width={175}
              height={150}
              aria-hidden
              className=" h-full w-[175px] ps-5 pt-2 self-end object-contain object-bottom "
            />
            <div className="absolute start-[245px] bottom-10 md:start-[108px] md:rtl:start-[-108px] md:bottom-[-16px] -translate-x-1/2 -translate-y-1/2">
              <MaintenanceNotificationCard />
            </div>
          </div>

          <div
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center px-1 md:text-center',
              'justify-center gap-1 max-sm:align-start max-sm:items-start max-sm:p-5 ',
            )}
          >
            <Text
              weight="bold"
              className={cn('text-sm text-white', 'md:text-2xl')}
            >
              {t('cta_banner_title')}
            </Text>
            <Text className="text-sm text-gray-300 max-sm:hidden">
              {t('cta_banner_description')}
            </Text>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className={cn('mt-2 text-xs', 'md:mt-3 md:text-sm')}
              icon={<Plus strokeWidth={2} />}
            >
              {t('add_your_car')}
            </Button>
          </div>

          <div className="relative ms-8 self-end z-[2] rtl:-scale-x-100 ">
            <NextImage
              src={getAsset(bannerImage.car)}
              alt=""
              width={280}
              height={170}
              aria-hidden
              className={cn(
                'h-full max-sm:w-[90px] w-[220px] shrink-0 object-contain self-end z-10',
              )}
            />
            <div className="absolute top-[0px] -translate-x-1/2 -translate-y-1/2 z-[-1] md:hidden">
              <MaintenanceNotificationCard />
            </div>
          </div>
        </BaseCard>
      </NextLink>
    </ClickEventTracker>
  );
}
