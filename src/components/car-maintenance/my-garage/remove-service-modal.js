'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { deleteMaintenanceLog } from '@/apis/maintenance';
import Button from '@/components/common/button/button';
import DrawerModal from '@/components/common/drawer-modal';
import Text from '@/components/common/text';
import { getMaintenanceLogServiceName } from '@/mappers/maintenanceLogsDisplay';
import { showToast } from '@/utils/notification-service';
import { cn } from '@/utils';

export default function RemoveServiceModal({
  isOpen,
  onClose,
  log,
  onSuccess,
}) {
  const t = useTranslations('carMaintenance');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    if (!log?.id) return;

    setIsDeleting(true);

    try {
      const response = await deleteMaintenanceLog(log.id);

      if (response?.error) {
        showToast(
          'error',
          response.error?.message || t('service_delete_failed'),
        );
        return;
      }

      showToast('success', response?.message || t('service_deleted_success'));
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('[RemoveServiceModal] delete failed:', err);
      showToast('error', t('service_delete_failed'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!log) return null;

  const serviceName = getMaintenanceLogServiceName(log, t);
  const title = t('remove_service_modal_title');

  const renderFooter = () => (
    <div className="flex w-full justify-between md:p-5">
      <Button
        type="button"
        size="lg"
        variant="ghost"
        className="flex-1 text-gray-500"
        disabled={isDeleting}
        onClick={onClose}
      >
        {t('cancel')}
      </Button>
      <Button
        type="button"
        size="lg"
        variant="destructive"
        className="flex-1"
        loading={isDeleting}
        disabled={isDeleting}
        onClick={handleRemove}
      >
        {t('remove_service_confirm')}
      </Button>
    </div>
  );

  const renderContent = () => (
    <Text className="text-center text-sm leading-relaxed text-gray-600">
      {t('remove_service_modal_description', { serviceName })}
    </Text>
  );

  return (
    <DrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      contentClassName={cn("py-2")}
      footer={renderFooter()}
      fullScreen={false}
    >
      {renderContent()}
    </DrawerModal>
  );
}
