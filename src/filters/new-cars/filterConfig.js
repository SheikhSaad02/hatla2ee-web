import { fetchModelsData } from '@/apis/new-cars-listings';
import configs from '@/configs';
import { BATTERY_CAPACITY_OPTIONS } from '@/components/evLanding/data';

export const filterKeys = {
  make: 'make',
  model: 'model',
  body: 'body',
  price: 'price',
  transmission: 'transmission',
  fuel: 'fuel',
  kmRange: 'kmRange',
  batteryCapacity: 'batteryCapacity',
};

export function buildFilterConfig({ locale, filterData = {}, t }) {
  const { make, model, body, transmission, fuel } = filterData;

  return {
    [filterKeys.make]: {
      key: filterKeys.make,
      label: t('Brand'),
      defaultValue: '',
      href: null,
      linkable: false,
      options: make,
      component: 'FilterScrollCard',
      dependents: [filterKeys.model],
      showSuffix: false,
    },
    [filterKeys.model]: {
      key: filterKeys.model,
      label: t('Model'),
      defaultValue: '',
      href: null,
      options: model,
      linkable: false,
      component: 'FilterScrollCard',
      dataFetcher: ({ newValue, categorySlug }) =>
        fetchModelsData(newValue.slug, categorySlug, { 'variant.id': 'notnull' }),
      showSuffix: false,
    },
    [filterKeys.price]: {
      key: filterKeys.price,
      label: t('Price'),
      defaultValue: '',
      href: null,
      linkable: false,
      component: 'FilterRange',
      min: 1000,
      max: 90000000,
      formatting: {
        type: 'range',
        formatValue: true,
        preffix: configs.currency[locale].label,
      },
      showSuffix: false,
    },
    [filterKeys.body]: {
      key: filterKeys.body,
      label: t('Body Type'),
      defaultValue: '',
      href: null,
      options: body,
      linkable: false,
      component: 'FilterScrollCard',
      showSuffix: false,
    },
    [filterKeys.transmission]: {
      key: filterKeys.transmission,
      label: t('Transmission'),
      defaultValue: '',
      href: null,
      options: transmission,
      linkable: false,
      component: 'FilterRadioOption',
      showSuffix: false,
    },
    [filterKeys.fuel]: {
      key: filterKeys.fuel,
      label: t('Fuel Type'),
      defaultValue: '',
      href: null,
      options: fuel,
      linkable: false,
      component: 'FilterScrollCard',
      isMulti: true,
      showSuffix: false,
    },
    // KM Range — mirrors the Price range filter (min/max slider).
    [filterKeys.kmRange]: {
      key: filterKeys.kmRange,
      label: t('KM Range'),
      defaultValue: '',
      href: null,
      linkable: false,
      component: 'FilterRange',
      min: 0,
      max: 1500,
      step: 50,
      formatting: {
        type: 'range',
        formatValue: true,
        suffix: t('km'),
      },
      showSuffix: false,
    },
    // Battery Capacity — mirrors the CC-range scroll card (single-select buckets).
    [filterKeys.batteryCapacity]: {
      key: filterKeys.batteryCapacity,
      label: t('Battery Capacity'),
      defaultValue: '',
      href: null,
      options: BATTERY_CAPACITY_OPTIONS,
      linkable: false,
      component: 'FilterScrollCard',
      showSuffix: false,
    },
  };
}
