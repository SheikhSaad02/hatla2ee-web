import {
  getMaintenanceLogServiceName,
  isPastDueDate,
  MAINTENANCE_CARD_STATES,
} from '@/mappers/maintenanceLogsDisplay';
import { getListingTitleByLevel, getLocaleString } from '@/utils/general';

const MAINTENANCE_CAR_TITLE_ORDER = ['make', 'model', 'variant'];

function getMaintenanceCarDisplayName(car, locale) {
  if (car?.manual_make_model) return car.manual_make_model;

  return getListingTitleByLevel(
    { make: car?.make, model: car?.model, variant: car?.variant },
    'variant',
    locale,
    false,
    { order: MAINTENANCE_CAR_TITLE_ORDER },
  );
}

function getMaintenanceCarSubtitleItems(car, locale, kmLabel = 'KM') {
  const items = [];
  const location = car?.location
    ? getLocaleString(car.location, 'title', locale)
    : '';

  if (location) {
    items.push({ label: location });
  }

  const kms = car?.kms_driven != null ? car.kms_driven.toLocaleString() : '';
  if (kms) {
    items.push({ label: `${kms} ${kmLabel}` });
  }

  return items;
}

export function getMaintenanceCardState(car) {
  const nearest = car?.nearest_service;
  const totalServices = car?.total_services_count ?? 0;

  if (!nearest && totalServices === 0) {
    return MAINTENANCE_CARD_STATES.empty;
  }

  if (nearest?.completion_status === true) {
    return MAINTENANCE_CARD_STATES.completed;
  }

  if (!nearest) {
    return totalServices > 0
      ? MAINTENANCE_CARD_STATES.upcoming
      : MAINTENANCE_CARD_STATES.empty;
  }

  if (isPastDueDate(nearest.schedule_next_service_date)) {
    return MAINTENANCE_CARD_STATES.overdue;
  }

  return MAINTENANCE_CARD_STATES.upcoming;
}

export function mapUserMaintenanceCar(car, locale, t) {
  const nearest = car?.nearest_service;
  const cardState = getMaintenanceCardState(car);
  const isCompleted = cardState === MAINTENANCE_CARD_STATES.completed;

  return {
    id: car.id,
    raw: car,
    cardState,
    displayName: getMaintenanceCarDisplayName(car, locale),
    subtitleItems: getMaintenanceCarSubtitleItems(
      car,
      locale,
      t('km_suffix'),
    ),
    totalServicesCount: car?.total_services_count ?? 0,
    nearestServiceName: nearest
      ? getMaintenanceLogServiceName(nearest, t)
      : undefined,
    serviceDisplayDate: isCompleted
      ? undefined
      : nearest?.schedule_next_service_date,
  };
}

export function mapRawCarToCarSelection(raw) {
  if (raw?.manual_make_model) {
    return { manual_make_model: raw.manual_make_model };
  }

  if (!raw?.make || !raw?.model || !raw?.year) return null;

  return {
    brand: {
      id: raw.make.id,
      slug: raw.make.slug,
      label: raw.make.label,
      label_l1: raw.make.label_l1,
      logo: raw.make.logo,
    },
    model: {
      id: raw.model.id,
      slug: raw.model.slug,
      label: raw.model.label,
      label_l1: raw.model.label_l1,
    },
    year: {
      slug: String(raw.year),
      label: String(raw.year),
    },
    class: raw.variant
      ? {
          id: raw.variant.id,
          variant_id: raw.variant.id,
          slug: raw.variant.slug,
          label: raw.variant.label,
          label_l1: raw.variant.label_l1,
        }
      : null,
  };
}

export function mapCarFormValuesFromRaw(raw) {
  return {
    kms_driven: raw?.kms_driven != null ? String(raw.kms_driven) : '',
    avg_daily_kms: raw?.avg_daily_kms != null ? String(raw.avg_daily_kms) : '',
    location: raw?.location
      ? {
          id: raw.location.id,
          title: raw.location.title,
          title_l1: raw.location.title_l1,
          slug: raw.location.slug,
        }
      : null,
  };
}

export function hasValidCarSelection(carSelection) {
  if (carSelection?.manual_make_model?.trim()) return true;
  return ['brand', 'model', 'year'].every((step) => carSelection?.[step]);
}

export function mapCarSelectionToPayload(carSelection, formValues) {
  const payload = {
    kms_driven: Number(formValues.kms_driven),
  };

  if (carSelection?.manual_make_model?.trim()) {
    payload.manual_make_model = carSelection.manual_make_model.trim();
  } else {
    payload.make_id = carSelection?.brand?.id;
    payload.model_id = carSelection?.model?.id;
    payload.year = Number(
      carSelection?.year?.slug || carSelection?.year?.label,
    );

    const variantId =
      carSelection?.class?.variant_id || carSelection?.class?.id;
    if (variantId) {
      payload.variant_id = variantId;
    }
  }

  if (formValues.avg_daily_kms !== '' && formValues.avg_daily_kms != null) {
    payload.avg_daily_kms = Number(formValues.avg_daily_kms);
  }

  if (formValues.location?.id) {
    payload.location_id = formValues.location.id;
  }

  return payload;
}
