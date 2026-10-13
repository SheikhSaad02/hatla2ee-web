'use client';

import { useTranslations } from 'next-intl';

import Button from '@/components/common/button/button';
import DrawerModal from '@/components/common/drawer-modal';
import AddServiceForm from '@/components/car-maintenance/my-garage/add-service-form';
import { useAddServiceForm } from '@/components/car-maintenance/my-garage/useAddServiceForm';
import { useIsMobile } from '@/providers/isMobile';
import { cn } from '@/utils';

export default function AddServiceModal({
  isOpen,
  onClose,
  car,
  log,
  onSuccess,
}) {
  const t = useTranslations('carMaintenance');
  const isMobile = useIsMobile() ?? false;
  const addService = useAddServiceForm({ isOpen, car, log, onClose, onSuccess });

  if (!car) return null;

  const { form, isEdit, isSubmitting, onSubmit } = addService;

  return (
    <DrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit ? t('edit_service_modal_title') : t('add_service_modal_title')
      }
      description={t(
        isEdit
          ? 'edit_service_modal_description'
          : 'add_service_modal_description',
        { carName: car.displayName },
      )}
      contentClassName={cn(
        'flex flex-col gap-7 py-2',
      )}
      containerClassName={cn(
        'md:max-w-[700px]',
      )}
      footer={
        <Button
          type="button"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isEdit ? t('save_changes') : t('add_service')}
        </Button>
      }
    >
      <AddServiceForm car={car} isMobile={isMobile} addService={addService} />
    </DrawerModal>
  );
}
