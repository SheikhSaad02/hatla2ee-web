export const MAINTENANCE_CARD_STATES = {
  empty: 'empty',
  upcoming: 'upcoming',
  overdue: 'overdue',
  completed: 'completed',
};

export function isPastDueDate(dateStr) {
  if (!dateStr) return false;
  return String(dateStr).split('T')[0] < new Date().toLocaleDateString('en-CA');
}

import { getMaintenanceServiceLabelKey } from '@/mappers/maintenanceLogs';

export function getServiceDueStatus(log) {
  if (log?.completion_status === true) {
    return MAINTENANCE_CARD_STATES.completed;
  }

  if (isPastDueDate(log?.schedule_next_service_date)) {
    return MAINTENANCE_CARD_STATES.overdue;
  }

  return MAINTENANCE_CARD_STATES.upcoming;
}

export function getMaintenanceLogServiceName(log, t) {
  if (log?.service_type === 'other') {
    return log?.service_type_other?.trim() || t('other');
  }

  const labelKey = getMaintenanceServiceLabelKey(log?.service_type);
  if (labelKey) return t(labelKey);
  return log?.service_type_other || log?.service_type || '';
}

export function partitionMaintenanceLogs(logs = []) {
  const due = [];
  const completed = [];

  logs.forEach((log) => {
    if (log?.completion_status === true) {
      completed.push(log);
    } else {
      due.push(log);
    }
  });

  return { due, completed };
}
