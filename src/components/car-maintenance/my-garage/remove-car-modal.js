'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { deleteUserMaintenanceCar } from '@/apis/maintenance';
import Button from '@/components/common/button/button';
import DrawerModal from '@/components/common/drawer-modal';
import Text from '@/components/common/text';
import { showToast } from '@/utils/notification-service';

export default function RemoveCarModal({ isOpen, onClose, car, onSuccess }) {
  const t = useTranslations('carMaintenance');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    if (!car?.id) return;

    setIsDeleting(true);

    try {
      const response = await deleteUserMaintenanceCar(car.id);

      if (response?.error) {
        showToast(
          'error',
          response.error?.message || t('car_delete_failed'),
        );
        return;
      }

      showToast('success', response?.message || t('car_deleted_success'));
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('[RemoveCarModal] delete failed:', err);
      showToast('error', t('car_delete_failed'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!car) return null;

  const title = t('remove_car_modal_title');

  const renderFooter = () => (
    <div className="flex w-full justify-between">
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
        {t('remove_car_confirm')}
      </Button>
    </div>
  );

  const renderContent = () => (
    <Text className="text-center text-sm leading-relaxed text-gray-600">
      {t('remove_car_modal_description')}
    </Text>
  );

  return (
    <DrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      contentClassName="py-2"
      containerClassName="md:max-w-[480px]"
      footer={renderFooter()}
    >
      {renderContent()}
    </DrawerModal>
  );
}
