'use client';

import { useMemo } from 'react';
import { Calendar, Check, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useUser } from '@/providers/user';
import { carMaintenanceEvents } from '@/services/analyticsService/events';

import Button from '@/components/common/button/button';
import DropdownIconMenu from '@/components/common/dropdown/dropdownIconMenu';
import MaintenanceServiceCard from '@/components/car-maintenance/car-service-details/maintenance-service-card';
import { formatMaintenanceStatValue } from '@/utils/general';
import {
  MAINTENANCE_DATE_TEXT_CLASS,
  MAINTENANCE_STATUS_BADGE_CLASS,
} from '@/components/car-maintenance/styles';
import configs from '@/configs';
import {
  getMaintenanceLogServiceName,
  getServiceDueStatus,
  MAINTENANCE_CARD_STATES,
} from '@/mappers/maintenanceLogsDisplay';
import { formatDate } from '@/utils/date';

const SERVICE_DUE_MENU_ACTIONS = [
  {
    id: 'mark-completed',
    icon: Check,
    variant: 'success',
    labelKey: 'mark_service_completed',
  },
  {
    id: 'edit',
    icon: Pencil,
    variant: 'primary',
    labelKey: 'edit_service',
  },
  {
    id: 'delete',
    icon: Trash2,
    variant: 'danger',
    labelKey: 'delete_service',
  },
];

export default function ServiceDueCard({ log, onEdit, onDelete, onMarkDone }) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const { user } = useUser();
  const status = getServiceDueStatus(log);
  const isOverdue = status === MAINTENANCE_CARD_STATES.overdue;

  const menuItems = useMemo(() => {
    const handlers = {
      'mark-completed': () => {
        carMaintenanceEvents.maintenance_detail_click(locale, user);
        onMarkDone();
      },
      edit: onEdit,
      delete: onDelete,
    };

    return SERVICE_DUE_MENU_ACTIONS.map((action) => ({
      key: action.id,
      icon: action.icon,
      variant: action.variant,
      label: t(action.labelKey),
      onSelect: handlers[action.id],
    }));
  }, [onDelete, onEdit, onMarkDone, t]);

  const stats = [
    {
      label: t('cost'),
      value: formatMaintenanceStatValue(
        log?.maintenance_service_cost,
        configs?.currency?.[locale]?.label,
      ),
    },
    {
      label: t('currently_driven'),
      value: formatMaintenanceStatValue(
        log?.current_kms_driven,
        t('km_suffix'),
      ),
    },
    {
      label: t('due_at'),
      value: formatMaintenanceStatValue(
        log?.next_service_due_at_km,
        t('km_suffix'),
      ),
    },
  ];

  return (
    <MaintenanceServiceCard
      title={getMaintenanceLogServiceName(log, t)}
      badge={{
        label: t(status),
        className: MAINTENANCE_STATUS_BADGE_CLASS[status],
      }}
      actions={
        <DropdownIconMenu
          items={menuItems}
          trigger={
            <Button
              type="button"
              variant="default"
              size="icon"
              className="max-sm:h-7 max-sm:w-7 shrink-0 rounded-lg border border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-400"
              aria-label={t('actions')}
              icon={<MoreVertical className="size-4 md:size-5" />}
            />
          }
        />
      }
      meta={
        log?.schedule_next_service_date
          ? {
              icon: Calendar,
              text: t('due_on', {
                date: formatDate(
                  log.schedule_next_service_date,
                  { month: 'short', day: 'numeric', year: 'numeric' },
                  locale,
                ),
              }),
              className: MAINTENANCE_DATE_TEXT_CLASS[status],
            }
          : undefined
      }
      stats={stats}
      gridCols={3}
      cardClassName="gap-0 overflow-hidden max-sm:rounded-none max-sm:border-x-0 maxsm:p-0"
      bodyClassName="p-3 md:p-5"
      gridWrapperClassName="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50/40 md:rounded-xl"
      gridCellClassName="bg-gray-50 px-2 py-1.5 md:px-4 md:py-3"
      footer={
        isOverdue
          ? {
              text: t('has_service_been_completed'),
              action: {
                label: t('mark_as_done'),
                icon: Check,
                onClick: () => {
                  carMaintenanceEvents.maintenance_detail_click(locale, user);
                  onMarkDone();
                },
              },
            }
          : null
      }
    />
  );
}
