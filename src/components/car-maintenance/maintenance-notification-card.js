import BaseCard from '@/components/common/baseCard/baseCard';
import NextImage from '@/components/common/nextImage';
import { getAsset } from '@/utils/general';
import { getTranslations } from 'next-intl/server';

export default async function MaintenanceNotificationCard() {
  const t = await getTranslations('carMaintenance');

  return (
    <BaseCard className="flex w-[max-content] shrink-0 flex-col gap-1.5  rounded-sm border-none bg-white shadow-lg md:rounded-lg px-1 py-1 md:px-2.5  md:py-2.5  md:min-w-[227px]">
      <div className="flex items-center gap-1 md:gap-2">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-[#1A293D] md:h-7 md:w-7 md:rounded-lg px-1">
          <NextImage
            src={getAsset('/assets/logo-light-new.svg')}
            alt="Hatla2ee"
            width={24}
            height={24}
            className="h-2 w-2 object-contain md:h-7 md:w-7"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[6px]  md:text-[10px] font-bold leading-tight text-[#1A293D] md:text-xs">
              {t('notification_oil_change_service_due')}
            </span>
            <span className="shrink-0 text-[6px] text-gray-400 md:text-[10px]">
              {t('notification_sample_time')}
            </span>
          </div>
          <p className="mt-0.5 text-[6px] leading-snug text-gray-500 md:text-[10px]">
            {t('notification_service_due_on')}
          </p>
          <div className="flex items-center gap-0.5 md:gap-1.5">
            <span className="text-[6px] md:text-xs">🗓️</span>
            <span className="text-[6px] md:text-[10px] font-bold text-[#1A293D] ">
              {t('notification_sample_due_date')}
            </span>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
