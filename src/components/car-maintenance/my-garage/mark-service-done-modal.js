'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';

import { updateMaintenanceLog } from '@/apis/maintenance';
import Button from '@/components/common/button/button';
import { DatePickerField } from '@/components/common/datePicker';
import DrawerModal from '@/components/common/drawer-modal';
import Input from '@/components/common/input/input';
import NextImage from '@/components/common/nextImage';
import Text from '@/components/common/text';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  mapMaintenanceLogMarkAsDonePayload,
  mapMaintenanceLogToMarkDoneFormValues,
} from '@/mappers/maintenanceLogs';
import { createMarkServiceDoneSchema } from '@/validators/car-maintenance/markServiceDoneSchema';
import { showToast } from '@/utils/notification-service';
import { getAsset } from '@/utils/general';
import configs from '@/configs';

const MARK_SERVICE_DONE_IMAGE = getAsset('/assets/mark-service-done.webp');

const FIELD_PROPS = {
  className: 'h-[46px] w-full',
  containerClassName: 'w-full',
  inputClassName: 'text-sm',
};

const DEFAULT_VALUES = {
  maintenance_service_cost: '',
  current_kms_driven: '',
  service_completion_date: '',
};

export default function MarkServiceDoneModal({
  isOpen,
  onClose,
  log,
  car,
  onSuccess,
}) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currencyLabel = configs?.currency?.[locale]?.label ?? 'EGP';
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const schema = useMemo(() => createMarkServiceDoneSchema(t), [t]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset(DEFAULT_VALUES);
      return;
    }

    if (log) {
      form.reset(mapMaintenanceLogToMarkDoneFormValues(log));
    }
  }, [isOpen, log, form]);

  const handleConfirm = form.handleSubmit(async (formValues) => {
    if (!log?.id) return;

    setIsSubmitting(true);

    const payload = mapMaintenanceLogMarkAsDonePayload(formValues);
    const response = await updateMaintenanceLog(log.id, payload);

    setIsSubmitting(false);

    if (response?.error) {
      showToast(
        'error',
        response.error?.message || t('service_mark_as_done_failed'),
      );
      return;
    }

    showToast('success', response?.message || t('service_marked_done_success'));
    onClose();
    onSuccess?.();
  });

  if (!log) return null;

  const renderFooter = () => (
    <div className="flex w-full justify-between gap-1 md:p-5">
      <Button
        type="button"
        size="lg"
        variant="ghost"
        className="flex-1 text-gray-500"
        disabled={isSubmitting}
        onClick={onClose}
      >
        {t('cancel')}
      </Button>
      <Button
        type="button"
        size="lg"
        className="flex-1"
        loading={isSubmitting}
        disabled={isSubmitting}
        onClick={handleConfirm}
      >
        {t('mark_as_done')}
      </Button>
    </div>
  );

  const renderContent = () => (
    <>
      <div className="w-full bg-primary-100">
        <NextImage
          src={MARK_SERVICE_DONE_IMAGE}
          alt=""
          width={480}
          height={200}
          className="h-auto w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-5 px-6 pb-2 pt-5 text-start">
        <div className="flex flex-col gap-3">
          <Text as="p" weight="bold" className="text-lg text-gray-900">
            {t('mark_service_done_modal_title')}
          </Text>
          <Text as="p" className="text-sm leading-relaxed text-gray-600">
            {t('mark_service_done_modal_description')}
          </Text>
        </div>

        <Form {...form}>
          <form className="flex w-full flex-col gap-4">
            <FormField
              control={form.control}
              name="current_kms_driven"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      {...FIELD_PROPS}
                      inputMode="numeric"
                      placeholder={t('current_kms_placeholder')}
                      inputTitle={t('service_done_at')}
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
              name="maintenance_service_cost"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      {...FIELD_PROPS}
                      inputMode="decimal"
                      placeholder={t('service_cost_placeholder')}
                      inputTitle={t('maintenance_service_cost')}
                      suffix={
                        <Text className="text-xs italic text-gray-light">
                          {currencyLabel}
                        </Text>
                      }
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d.]/g, ''))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_completion_date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <DatePickerField
                      {...field}
                      {...FIELD_PROPS}
                      max={todayIso}
                      placeholder={t('select_date')}
                      inputTitle={t('service_completion_date')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </>
  );

  return (
    <DrawerModal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      fullScreen={false}
      containerClassName="max-w-[480px] overflow-hidden p-0 lg:gap-6 md:gap-0 xl:gap-0"
      contentClassName="flex flex-col gap-0 py-0"
      childrenClassName="flex flex-col p-0 max-sm:mt-[-20px] z-[-1]"
      footer={renderFooter()}
    >
      {renderContent()}
    </DrawerModal>
  );
}
