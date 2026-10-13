'use client';

import { Calendar } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import MaintenanceServiceCard from '@/components/car-maintenance/car-service-details/maintenance-service-card';
import { formatMaintenanceStatValue } from '@/utils/general';
import configs from '@/configs';
import { getMaintenanceLogServiceName } from '@/mappers/maintenanceLogsDisplay';
import { formatDate } from '@/utils/date';

export default function MaintenanceLogItem({ log }) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const timestamp =
    log?.logged_at || log?.service_completion_date || log?.created_at;
  const description = log?.description || log?.service_type_other;

  const stats = [
    {
      label: t('cost'),
      value: formatMaintenanceStatValue(
        log?.maintenance_service_cost,
        configs?.currency?.[locale]?.label,
      ),
    },
    {
      label: t('changed_at'),
      value: formatMaintenanceStatValue(
        log?.current_kms_driven,
        t('km_suffix'),
      ),
    },
  ];

  return (
    <div className="relative flex gap-3 pb-4 md:pb-8 last:pb-0">
      <div className="relative flex w-3 shrink-0 justify-center">
        <span
          className="absolute top-3 bottom-0 w-px bg-gray-200"
          aria-hidden
        />
        <span
          className="relative z-10 mt-1.5 size-2 shrink-0 rounded-full bg-primary md:size-3"
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1">
        {timestamp && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 md:text-sm">
            <Calendar className="size-3 shrink-0 text-gray-400 md:size-4" />
            {formatDate(
              timestamp,
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              },
              locale,
            )}
          </div>
        )}

        <MaintenanceServiceCard
          title={getMaintenanceLogServiceName(log, t)}
          description={description || undefined}
          stats={stats}
          gridCols={2}
          cardClassName="gap-3 rounded-lg border border-gray-50 bg-gray-50 p-4 shadow-none"
          bodyClassName="flex flex-col gap-3"
          gridWrapperClassName="overflow-hidden rounded-lg border border-gray-100 bg-white"
        />
      </div>
    </div>
  );
}
