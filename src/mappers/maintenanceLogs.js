const REMINDER_MONTH_OFFSETS = {
  3: 3,
  6: 6,
  12: 12,
};

export function addMonthsToDate(baseDate, months) {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

export function getReminderDate(reminder, customDate) {
  if (!reminder) return null;
  if (reminder === 'custom') return customDate || null;
  const offset = REMINDER_MONTH_OFFSETS[reminder];
  if (!offset) return null;
  return addMonthsToDate(new Date(), offset);
}

export function getKmSuggestions(kmsDriven) {
  const base = Math.max(
    10000,
    Math.floor((Number(kmsDriven) || 80000) / 10000) * 10000,
  );
  return [base, base + 10000, base + 20000];
}

export function mapMaintenanceLogFormToPayload(carId, formValues) {
  const isCompleted = formValues.completion_status === 'yes';
  const serviceType = formValues.service_type?.value || formValues.service_type;

  const payload = {
    user_maintenance_car_id: Number(carId),
    service_type: serviceType,
    completion_status: isCompleted,
  };

  if (serviceType === 'other' && formValues.service_type_other) {
    payload.service_type_other = formValues.service_type_other;
  }

  if (formValues.maintenance_service_cost !== '') {
    payload.maintenance_service_cost = Number(
      formValues.maintenance_service_cost,
    );
  }

  if (formValues.current_kms_driven !== '') {
    payload.current_kms_driven = Number(formValues.current_kms_driven);
  }

  if (formValues.next_service_due_at_km !== '') {
    payload.next_service_due_at_km = Number(formValues.next_service_due_at_km);
  }

  if (isCompleted) {
    payload.service_completion_date = formValues.service_completion_date;
  }

  const scheduleDate = getReminderDate(
    formValues.reminder,
    formValues.schedule_next_service_date,
  );
  if (scheduleDate) {
    payload.schedule_next_service_date = scheduleDate;
  }

  return payload;
}

/** PATCH payload when marking an overdue / due log as completed. */
export function mapMaintenanceLogToFormValues(log, serviceTypeOptions = []) {
  if (!log) return null;

  const serviceTypeValue = log.service_type;
  const matchedOption = serviceTypeOptions.find(
    (opt) => opt.value === serviceTypeValue,
  );
  const service_type = matchedOption ?? {
    value: serviceTypeValue,
    label: serviceTypeValue,
  };

  const isCompleted = log.completion_status === true;
  const scheduleDate = log.schedule_next_service_date
    ? String(log.schedule_next_service_date).split('T')[0]
    : '';
  const completionDate = log.service_completion_date
    ? String(log.service_completion_date).split('T')[0]
    : '';

  return {
    service_type,
    completion_status: isCompleted ? 'yes' : 'no',
    maintenance_service_cost:
      log.maintenance_service_cost != null
        ? String(log.maintenance_service_cost)
        : '',
    current_kms_driven:
      log.current_kms_driven != null ? String(log.current_kms_driven) : '',
    next_service_due_at_km:
      log.next_service_due_at_km != null
        ? String(log.next_service_due_at_km)
        : '',
    service_completion_date: completionDate,
    service_type_other: log.service_type_other || '',
    reminder: scheduleDate ? 'custom' : null,
    schedule_next_service_date: scheduleDate,
  };
}

export function mapMaintenanceLogToMarkDoneFormValues(log) {
  const completionDate = log?.service_completion_date
    ? String(log.service_completion_date).split('T')[0]
    : '';

  return {
    maintenance_service_cost:
      log?.maintenance_service_cost != null
        ? String(log.maintenance_service_cost)
        : '',
    current_kms_driven: '',
    service_completion_date: completionDate,
  };
}

export function mapMaintenanceLogMarkAsDonePayload(formValues) {
  return {
    completion_status: true,
    service_completion_date: formValues.service_completion_date,
    maintenance_service_cost: Number(formValues.maintenance_service_cost),
    current_kms_driven: Number(formValues.current_kms_driven),
  };
}

export const MAINTENANCE_SERVICE_TYPES = {
  oil_change: { labelKey: 'oil_change' },
  tyre_change: { labelKey: 'tyre_change' },
  tyre_rotation: { labelKey: 'tyre_rotation', formOption: false },
  general_service: { labelKey: 'general_service' },
  air_filter: { labelKey: 'air_filter' },
  brakes: { labelKey: 'brakes' },
  battery: { labelKey: 'battery' },
  engine_work: { labelKey: 'engine_work' },
  oil_leakage: { labelKey: 'oil_leakage' },
  other: { labelKey: 'other' },
};

export function getMaintenanceServiceLabelKey(serviceType) {
  return MAINTENANCE_SERVICE_TYPES[serviceType]?.labelKey ?? null;
}
