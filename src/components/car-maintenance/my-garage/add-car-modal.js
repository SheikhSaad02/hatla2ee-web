'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { useUser } from '@/providers/user';
import { carMaintenanceEvents } from '@/services/analyticsService/events';
import { ChevronDown } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createUserMaintenanceCar,
  updateUserMaintenanceCar,
} from '@/apis/maintenance';
import Button from '@/components/common/button/button';
import Input from '@/components/common/input/input';
import Label from '@/components/common/label';
import Text from '@/components/common/text';
import DrawerModal from '@/components/common/drawer-modal';
import LocationSearch from '@/components/common/locationSearch';
import MaintenanceCarSelector from '@/components/car-maintenance/my-garage/maintenance-car-selector';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { MAINTENANCE_FIELD_PROPS } from '@/components/car-maintenance/styles';
import {
  mapCarFormValuesFromRaw,
  mapCarSelectionToPayload,
  mapRawCarToCarSelection,
} from '@/mappers/userMaintenanceCars';
import { createAddCarSchema } from '@/validators/car-maintenance/addCarSchema';
import { showToast } from '@/utils/notification-service';
import { cn } from '@/utils';

const FIELD_PROPS = MAINTENANCE_FIELD_PROPS;

const DEFAULT_VALUES = {
  carSelection: null,
  kms_driven: '',
  avg_daily_kms: '',
  location: null,
};

export default function AddCarModal({
  isOpen,
  onClose,
  isMobile,
  onSuccess,
  car = null,
}) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const { user } = useUser();
  const isEdit = Boolean(car?.id);
  const schema = useMemo(() => createAddCarSchema(t), [t]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset(DEFAULT_VALUES);
      return;
    }

    if (isEdit && car?.raw) {
      form.reset({
        ...mapCarFormValuesFromRaw(car.raw),
        carSelection: mapRawCarToCarSelection(car.raw),
      });
      return;
    }

    form.reset(DEFAULT_VALUES);
  }, [isOpen, isEdit, car, form]);

  const onSubmit = async (formValues) => {
    setIsSubmitting(true);

    const payload = mapCarSelectionToPayload(
      formValues.carSelection,
      formValues,
    );
    const response = isEdit
      ? await updateUserMaintenanceCar(car.id, payload)
      : await createUserMaintenanceCar(payload);

    setIsSubmitting(false);

    if (response?.error) {
      showToast(
        'error',
        response.error?.message ||
          (isEdit ? t('car_update_failed') : t('car_add_failed')),
      );
      return;
    }

    showToast(
      'success',
      response?.message ||
        (isEdit ? t('car_updated_success') : t('car_added_success')),
    );
    if (!isEdit) {
      carMaintenanceEvents.submit_maintenance_car(locale, user);
    }
    onClose();
    onSuccess?.();
  };

  const title = isEdit ? t('edit_car_modal_title') : t('add_car_modal_title');
  const description = isEdit
    ? t('edit_car_modal_subtitle')
    : t('add_car_modal_subtitle');

  const renderFooter = () => (
    <Button
      type="button"
      size="lg"
      className="w-full"
      loading={isSubmitting}
      disabled={isSubmitting}
      onClick={form.handleSubmit(onSubmit)}
    >
      {isEdit ? t('save_changes') : t('add_your_car')}
    </Button>
  );

  const renderContent = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7"
      >
        <FormField
          control={form.control}
          name="carSelection"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <MaintenanceCarSelector
                  isMobile={isMobile}
                  value={field.value}
                  isError={!!fieldState.error}
                  readOnly={isEdit}
                  onChange={field.onChange}
                  onClear={() => field.onChange(null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 lg:gap-y-7 gap-x-6 lg:gap-x-10">
          <FormField
            control={form.control}
            name="kms_driven"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    {...FIELD_PROPS}
                    inputMode="numeric"
                    placeholder={t('total_driven_placeholder')}
                    inputTitle={t('total_driven')}
                    suffix={
                      <Text className="text-xs italic text-gray-light">
                        {t('km_suffix')}
                      </Text>
                    }
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ''))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avg_daily_kms"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    {...FIELD_PROPS}
                    inputMode="numeric"
                    placeholder={t('avg_daily_kms_placeholder')}
                    inputTitle={`${t('avg_daily_kms')} (${t('Optional')})`}
                    suffix={
                      <Text className="text-xs italic text-gray-light">
                        {t('km_suffix')}
                      </Text>
                    }
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ''))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <Label>{`${t('location')} (${t('Optional')})`}</Label>
                <FormControl>
                  <LocationSearch
                    value={field.value}
                    onSelect={(val) => field.onChange(val)}
                    triggerProps={{
                      suffix: (
                        <ChevronDown className="h-4 w-4 text-gray-light" />
                      ),
                      className: cn('text-sm', FIELD_PROPS.className),
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );

  return (
    <DrawerModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      contentClassName="flex flex-col gap-7 py-2"
      containerClassName="md:max-w-[700px]"
      footer={renderFooter()}
    >
      {renderContent()}
    </DrawerModal>
  );
}
