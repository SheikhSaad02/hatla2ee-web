'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';

import { createMaintenanceLog, updateMaintenanceLog } from '@/apis/maintenance';
import configs from '@/configs';
import {
  getReminderDate,
  MAINTENANCE_SERVICE_TYPES,
  mapMaintenanceLogFormToPayload,
  mapMaintenanceLogToFormValues,
} from '@/mappers/maintenanceLogs';
import { createAddServiceSchema } from '@/validators/car-maintenance/addServiceSchema';
import { showToast } from '@/utils/notification-service';
import { carMaintenanceEvents } from '@/services/analyticsService/events';
import { useUser } from '@/providers/user';

export const ADD_SERVICE_DEFAULT_VALUES = {
  service_type: null,
  completion_status: null,
  maintenance_service_cost: '',
  current_kms_driven: '',
  next_service_due_at_km: '',
  service_completion_date: '',
  service_type_other: '',
  reminder: null,
  schedule_next_service_date: '',
};

export function useAddServiceForm({ isOpen, car, log, onClose, onSuccess }) {
  const t = useTranslations('carMaintenance');
  const locale = useLocale();
  const { user } = useUser();
  const isEdit = Boolean(log?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleNextServiceEnabled, setScheduleNextServiceEnabled] =
    useState(false);

  const currencyLabel = configs?.currency?.[locale]?.label ?? 'EGP';
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const schema = useMemo(() => createAddServiceSchema(t), [t]);

  const serviceTypeOptions = useMemo(
    () =>
      Object.entries(MAINTENANCE_SERVICE_TYPES)
        .filter(([, config]) => config.formOption !== false)
        .map(([value, { labelKey }]) => ({
          value,
          label: t(labelKey),
        })),
    [t],
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: ADD_SERVICE_DEFAULT_VALUES,
  });

  const completionStatus = useWatch({
    control: form.control,
    name: 'completion_status',
  });
  const serviceType = useWatch({ control: form.control, name: 'service_type' });
  const reminder = useWatch({ control: form.control, name: 'reminder' });
  const customReminderDate = useWatch({
    control: form.control,
    name: 'schedule_next_service_date',
  });

  const isCompleted = completionStatus === 'yes';
  const isNotCompleted = completionStatus === 'no';
  const isOtherService = serviceType?.value === 'other';

  const reminderDate = useMemo(
    () => getReminderDate(reminder, customReminderDate),
    [reminder, customReminderDate],
  );

  useEffect(() => {
    if (!isOpen) return;

    const values = isEdit
      ? mapMaintenanceLogToFormValues(log, serviceTypeOptions)
      : ADD_SERVICE_DEFAULT_VALUES;

    form.reset(values ?? ADD_SERVICE_DEFAULT_VALUES);
    setScheduleNextServiceEnabled(
      Boolean(values?.reminder || values?.schedule_next_service_date),
    );
  }, [isOpen, car?.id, log, isEdit, form, serviceTypeOptions]);

  const clearScheduleFields = () => {
    form.setValue('reminder', null);
    form.setValue('schedule_next_service_date', '');
  };

  const handleCompletionStatusChange = (slug, onChange) => {
    onChange(slug);
    clearScheduleFields();
    setScheduleNextServiceEnabled(false);

    if (slug === 'no') {
      form.setValue('service_completion_date', '');
    }
  };

  const handleScheduleToggle = (enabled) => {
    setScheduleNextServiceEnabled(enabled);
    if (!enabled) clearScheduleFields();
  };

  const onSubmit = async (formValues) => {
    if (!car?.id) return;

    setIsSubmitting(true);

    const payload = mapMaintenanceLogFormToPayload(car.id, formValues);
    const response = isEdit
      ? await updateMaintenanceLog(log.id, payload)
      : await createMaintenanceLog(payload);

    setIsSubmitting(false);

    if (response?.error) {
      showToast(
        'error',
        response.error?.message ||
          (isEdit ? t('service_update_failed') : t('service_add_failed')),
      );
      return;
    }

    showToast(
      'success',
      response?.message ||
        (isEdit ? t('service_updated_success') : t('service_added_success')),
    );

    if (!isEdit) {
      carMaintenanceEvents.submit_maintenance_service(locale, user);
    }

    onClose();
    onSuccess?.();
  };

  return {
    form,
    isEdit,
    isSubmitting,
    isCompleted,
    isNotCompleted,
    isOtherService,
    reminder,
    reminderDate,
    scheduleNextServiceEnabled,
    serviceTypeOptions,
    currencyLabel,
    todayIso,
    handleCompletionStatusChange,
    handleScheduleToggle,
    onSubmit,
    stripDigits: (value) => value.replace(/\D/g, ''),
    stripDecimal: (value) => value.replace(/[^\d.]/g, ''),
  };
}
