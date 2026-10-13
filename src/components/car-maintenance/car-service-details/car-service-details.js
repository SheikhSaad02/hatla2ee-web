'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import AddServiceModal from '@/components/car-maintenance/my-garage/add-service-modal';
import MarkServiceDoneModal from '@/components/car-maintenance/my-garage/mark-service-done-modal';
import RemoveServiceModal from '@/components/car-maintenance/my-garage/remove-service-modal';
import PanelBanner from '@/components/common/panel-banner/panel-banner';
import MaintenanceLogItem from '@/components/car-maintenance/car-service-details/maintenance-log-item';
import ServiceDueCard from '@/components/car-maintenance/car-service-details/service-due-card';
import BaseCard from '@/components/common/baseCard/baseCard';
import Text from '@/components/common/text';
import { BottomBar } from '@/components/common/bottomBar';
import Button from '@/components/common/button/button';
import { Illustrator } from '@/components/common/illustrator/illustrator';
import { CarServiceDetailsSkeleton } from '@/components/common/loading';
import ScrollArea from '@/components/common/scrollArea';
import NextImage from '@/components/common/nextImage';
import { useMaintenanceCarListingImage } from '@/hooks/useMaintenanceCarListingImage';
import { partitionMaintenanceLogs } from '@/mappers/maintenanceLogsDisplay';
import { useUser } from '@/providers/user';
import { carMaintenanceEvents } from '@/services/analyticsService/events';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { fetchCarServiceDetails } from '@/utils/car-maintenance/fetchMappedCars';

const GARAGE_PLACEHOLDER = getAsset('/assets/garage-placeholder.webp');
const SERVICE_LOGS_PLACEHOLDER = getAsset(
  '/assets/service-logs-placeholder.webp',
);

export default function CarServiceDetails({ isMobile }) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId');
  const { user } = useUser();
  const [serviceModal, setServiceModal] = useState(null);
  const [logAction, setLogAction] = useState(null);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const { car, logs } = await fetchCarServiceDetails(carId, locale, t);
      setDetails(car ? { car, logs } : null);
    } catch {
      setDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [carId, locale, t]);

  const shouldOpenAddService = searchParams.get('addService') === '1';

  const openAddServiceModal = useCallback(() => {
    carMaintenanceEvents.add_maintenance_service(locale, user);
    setServiceModal({ log: null });
  }, [locale, user]);

  const openEditServiceModal = useCallback((log) => {
    setServiceModal({ log });
  }, []);

  const closeServiceModal = useCallback(() => {
    setServiceModal(null);
  }, []);

  const handleServiceModalSuccess = useCallback(() => {
    closeServiceModal();
    refetch();
  }, [closeServiceModal, refetch]);

  const car = details?.car ?? null;
  const logs = details?.logs ?? [];

  const { due: dueLogs, completed: completedLogs } = useMemo(
    () => partitionMaintenanceLogs(logs),
    [logs],
  );

  const { imageSrc } = useMaintenanceCarListingImage({
    model: car?.raw?.model,
    make: car?.raw?.make,
    manualMakeModel: car?.raw?.manual_make_model,
    enabled: Boolean(car?.raw?.model?.slug),
    fallbackImage: GARAGE_PLACEHOLDER,
    size: 'thumbnail',
  });

  const openLogAction = useCallback((log, action) => {
    setLogAction({ log, action });
  }, []);

  const closeLogAction = useCallback(() => {
    setLogAction(null);
  }, []);

  const handleLogActionSuccess = useCallback(() => {
    closeLogAction();
    refetch();
  }, [closeLogAction, refetch]);
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (shouldOpenAddService && car) {
      setServiceModal({ log: null });
    }
  }, [shouldOpenAddService, car]);

  if (isLoading) {
    return <CarServiceDetailsSkeleton />;
  }

  if (!details) {
    return (
      <div className="py-10 text-center text-gray-500">
        {t('car_not_found')}
      </div>
    );
  }

  const activeLog = logAction?.log;

  const renderSectionTitle = (children) => (
    <Text
      as="h3"
      weight="bold"
      className="md:mb-4 shrink-0 text-lg text-gray-800 md:text-xl max-sm:p-3"
    >
      {children}
    </Text>
  );

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[688px_1fr] lg:gap-10',
          isMobile && 'pb-24',
        )}
      >
        <BaseCard
          className={cn(
            'min-h-[320px] gap-0 overflow-hidden bg-white p-0 lg:h-[818px]',
            isMobile &&
              'max-md:-mx-4 max-md:rounded-none max-md:border-x-0 max-md:border-t-0',
          )}
        >
          <PanelBanner
            title={car.displayName}
            subtitleItems={car.subtitleItems}
            imageSrc={imageSrc}
            imageAlt={car.displayName}
            isMobile={isMobile}
            actionButton={{
              label: t('add_service'),
              onClick: openAddServiceModal,
            }}
          />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-0 md:p-6">
            {renderSectionTitle(t('services_due', { count: dueLogs.length }))}
            {dueLogs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                {t('no_services_due')}
              </div>
            ) : (
              <ScrollArea className="min-h-0 flex-1 pr-1">
                <div className="flex flex-col gap-4">
                  {dueLogs.map((log) => (
                    <ServiceDueCard
                      key={log.id}
                      log={log}
                      onEdit={() => openEditServiceModal(log)}
                      onDelete={() => openLogAction(log, 'delete')}
                      onMarkDone={() => openLogAction(log, 'mark-done')}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </BaseCard>

        <BaseCard className="min-h-[320px] gap-0 overflow-hidden bg-white p-0 lg:h-[818px]">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5 md:p-6">
            {renderSectionTitle(t('service_maintenance_log'))}
            {completedLogs.length === 0 ? (
              <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center rounded-xl bg-gray-50 px-6 py-12">
                <Illustrator
                  image={
                    <NextImage
                      src={SERVICE_LOGS_PLACEHOLDER}
                      width={isMobile ? 140 : 180}
                      height={isMobile ? 120 : 150}
                    />
                  }
                  description={t('no_service_logs_yet')}
                />
              </div>
            ) : (
              <ScrollArea className="min-h-0 flex-1 pr-1">
                {completedLogs.map((log) => (
                  <MaintenanceLogItem key={log.id} log={log} />
                ))}
              </ScrollArea>
            )}
          </div>
        </BaseCard>
      </div>

      {isMobile && (
        <BottomBar>
          <Button
            type="button"
            size="xl"
            className="w-full"
            icon={<Plus />}
            onClick={openAddServiceModal}
          >
            {t('add_service')}
          </Button>
        </BottomBar>
      )}

      <AddServiceModal
        isOpen={serviceModal !== null}
        car={car}
        log={serviceModal?.log ?? null}
        onClose={closeServiceModal}
        onSuccess={handleServiceModalSuccess}
      />

      <MarkServiceDoneModal
        isOpen={logAction?.action === 'mark-done'}
        log={activeLog}
        car={car}
        onClose={closeLogAction}
        onSuccess={handleLogActionSuccess}
      />

      <RemoveServiceModal
        isOpen={logAction?.action === 'delete'}
        log={activeLog}
        onClose={closeLogAction}
        onSuccess={handleLogActionSuccess}
      />
    </>
  );
}
