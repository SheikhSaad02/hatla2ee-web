'use client';

import BaseCard from '@/components/common/baseCard/baseCard';
import Button from '@/components/common/button/button';
import DropdownIconMenu from '@/components/common/dropdown/dropdownIconMenu';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import InlineItems from '@/components/common/inlineItems/inlineItems';
import Text from '@/components/common/text';
import { appPaths } from '@/constants';
import { useMaintenanceCarListingImage } from '@/hooks/useMaintenanceCarListingImage';
import { MAINTENANCE_CARD_STATES } from '@/mappers/maintenanceLogsDisplay';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  History,
  Plus,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useIsMobile } from '@/providers/isMobile';
import { useUser } from '@/providers/user';
import { carMaintenanceEvents } from '@/services/analyticsService/events';
import { GARAGE_CAR_MENU_ACTIONS } from '@/components/car-maintenance/data';
import {
  GARAGE_ACTION_BTN_CLASS,
  GARAGE_ACTIONS_MENU_BTN_CLASS,
  GARAGE_ADD_SERVICE_BTN_CLASS,
  GARAGE_CARD_CLASS,
  MAINTENANCE_DATE_PILL_CLASS,
} from '@/components/car-maintenance/styles';

const GARAGE_PLACEHOLDER = getAsset('/assets/garage-placeholder.webp');

export default function GarageCarCard({
  car,
  onAddService,
  onEditCar,
  onRemoveCar,
}) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const { user } = useUser();
  const isMobile = useIsMobile();
  const isEmpty = car.cardState === MAINTENANCE_CARD_STATES.empty;
  const isCompleted = car.cardState === MAINTENANCE_CARD_STATES.completed;
  const serviceDetailsHref = `${appPaths.carMaintenanceMaintenanceServices}?carId=${car.id}`;

  const { imageSrc, isListingPhoto } = useMaintenanceCarListingImage({
    model: car.raw?.model,
    make: car.raw?.make,
    manualMakeModel: car.raw?.manual_make_model,
    fallbackImage: GARAGE_PLACEHOLDER,
    size: 'thumbnail',
  });

  const servicePanelLabel = isCompleted
    ? t('last_service_completed')
    : t('next_service_due');

  const datePillClass =
    MAINTENANCE_DATE_PILL_CLASS[car.cardState] ||
    MAINTENANCE_DATE_PILL_CLASS.upcoming;

  const actionMenuItems = useMemo(() => {
    const handlers = {
      edit: () => {
        carMaintenanceEvents.maintenance_home_click(locale, user, 'edit');
        onEditCar?.(car);
      },
      remove: () => {
        carMaintenanceEvents.maintenance_home_click(locale, user, 'delete');
        onRemoveCar?.(car);
      },
    };

    return GARAGE_CAR_MENU_ACTIONS.map((action) => ({
      key: action.id,
      icon: action.icon,
      variant: action.variant,
      label: t(action.labelKey),
      onSelect: handlers[action.id],
    }));
  }, [car, t, onEditCar, onRemoveCar]);

  const garageActions = useMemo(
    () => [
      {
        id: 'add-service',
        label: t('add_service'),
        icon: Plus,
        className: GARAGE_ADD_SERVICE_BTN_CLASS,
        onClick: (e) => {
          e.stopPropagation();
          onAddService?.(car);
        },
      },
      {
        id: 'view-history',
        label: t('view_history'),
        icon: History,
        className: GARAGE_ACTION_BTN_CLASS,
        href: isEmpty ? undefined : serviceDetailsHref,
        disabled: isEmpty,
        onClick: (e) => e.stopPropagation(),
      },
    ],
    [t, car, onAddService, isEmpty, serviceDetailsHref],
  );

  return (
    <BaseCard
      className={cn(
        GARAGE_CARD_CLASS,
        'relative flex flex-col justify-between gap-3 overflow-hidden rounded-2xl border border-gray-200 p-4 transition-shadow hover:shadow-md',
      )}
    >
      <NextLink
        href={serviceDetailsHref}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={car.displayName}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Text
            as="h3"
            weight="bold"
            className="truncate text-base text-gray-900"
          >
            {car.displayName}
          </Text>
          {car.subtitleItems?.length > 0 && (
            <InlineItems
              items={car.subtitleItems}
              className="mt-1 text-sm text-gray"
              spaceClass="gap-1"
            />
          )}
        </div>
        <div
          className={cn(
            'flex h-14 w-[100px] shrink-0 items-center justify-center',
            isListingPhoto && 'rounded-lg bg-white',
          )}
        >
          <NextImage
            src={imageSrc}
            alt={car.displayName}
            width={100}
            height={56}
            className={cn(
              'h-14 w-[100px] object-contain object-right',
              isEmpty && 'opacity-80',
            )}
          />
        </div>
      </div>

      {isEmpty ? (
        <Text
          as="p"
          className="relative z-10 line-clamp-2 text-center text-sm leading-snug text-gray-500"
        >
          {t('no_service_logged_yet')}
        </Text>
      ) : (
        <div className="relative z-10 rounded-xl bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-0">
            <div className="min-w-0">
              <Text as="p" className="text-xs text-gray-500">
                {servicePanelLabel}
              </Text>
              {car.nearestServiceName ? (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Text
                    as="p"
                    weight="semibold"
                    className="text-sm text-gray-900"
                  >
                    {car.nearestServiceName}
                  </Text>
                  {car.serviceDisplayDate && !isCompleted && (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                        datePillClass,
                      )}
                    >
                      <Calendar className="size-3.5 shrink-0" />
                      {formatDate(
                        car.serviceDisplayDate,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        },
                        locale,
                      )}
                    </span>
                  )}
                </div>
              ) : (
                <Text as="p" className="mt-1 text-sm text-gray-400">
                  —
                </Text>
              )}
            </div>

            <div className="flex min-w-0 flex-col items-end text-end">
              <Text as="p" className="text-xs text-gray-500">
                {t('total_services')}
              </Text>
              <NextLink
                href={serviceDetailsHref}
                className="mt-1 inline-flex items-center gap-0.5 text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Text as="span" weight="semibold" className="text-sm">
                  {car.totalServicesCount}
                </Text>
                <ChevronRight className="size-4 shrink-0 flipX" />
              </NextLink>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative z-10 flex shrink-0 gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {garageActions.map(
          ({
            id,
            label,
            icon: Icon,
            iconPosition,
            className,
            onClick,
            href,
            disabled,
          }) => (
            <Button
              key={id}
              type="button"
              variant="tertiary"
              size="default"
              icon={<Icon size={20} />}
              iconPosition={iconPosition}
              className={className}
              onClick={onClick}
              href={href}
              disabled={disabled}
            >
              {label}
            </Button>
          ),
        )}
        <DropdownIconMenu
          items={actionMenuItems}
          trigger={
            <span className="flex min-w-0 flex-1">
              <Button
                type="button"
                size="default"
                className={GARAGE_ACTIONS_MENU_BTN_CLASS}
                icon={isMobile ? <EllipsisVertical /> : <ChevronDown />}
                iconPosition="right"
                onClick={() =>
                  carMaintenanceEvents.maintenance_home_click(
                    locale,
                    user,
                    'actions',
                  )
                }
              >
                {!isMobile && t('actions')}
              </Button>
            </span>
          }
        />
      </div>
    </BaseCard>
  );
}
