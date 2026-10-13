import configs from '@/configs';
import { translations } from '@/data/tFunctionTranslation';
import { FiltersService } from '@/services/elasticsearch/filter-service';
import { LocationsService } from '@/services/elasticsearch/location-service';

export const filterKeys = {
  make: 'make',
  model: 'model',
  variant: 'variant',
  year: 'year',
  city: 'city',
  body: 'body',
  price: 'price',
  specialConditions: 'specialConditions',
  condition: 'condition',
  transmission: 'transmission',
  fuel: 'fuel',
  mileage: 'mileage',
  color: 'color',
  cc: 'cc',
  badges: 'badges',
  spec: 'spec',
  goodDeal: 'good_deal',
};

export function buildFilterConfig({ locale, filterData = {}, t }) {
  const {
    make,
    model,
    variant,
    body,
    city,
    specialConditions,
    cc,
    color,
    transmission,
    fuel,
    condition,
    badges,
    spec,
  } = filterData;

  return {
    [filterKeys.make]: {
      key: filterKeys.make,
      label: t('Brand'),
      defaultValue: '',
      href: null,
      linkable: false,
      options: make,
      component: 'FilterScrollCard',
      dependents: [filterKeys.model, filterKeys.variant],
    },
    [filterKeys.model]: {
      key: filterKeys.model,
      label: t('Model'),
      defaultValue: '',
      href: null,
      options: model,
      linkable: false,
      component: 'FilterScrollCard',
      dependents: [filterKeys.variant],
      dataFetcher: async (filterValues) => {
        const { [filterKeys.make]: make } = filterValues;
        const response = await FiltersService.getFiltersWithCounts(
          { make: make.slug },
          ['models'],
          { models: FILTERS_AGG_CONFIG.model },
        );
        return response.models;
      },
    },
    [filterKeys.variant]: {
      key: filterKeys.variant,
      label: t('Class'),
      defaultValue: '',
      href: null,
      options: variant,
      linkable: false,
      component: 'FilterScrollCard',
      dataFetcher: async (filterValues) => {
        const { [filterKeys.make]: make, [filterKeys.model]: model } =
          filterValues;
        if (!make || !model) return Promise.resolve(null);

        const response = await FiltersService.getFiltersWithCounts(
          { make: make.slug, model: model.slug },
          ['variants'],
          { variants: FILTERS_AGG_CONFIG.variant },
        );
        return response.variants;
      },
    },
    [filterKeys.year]: {
      key: filterKeys.year,
      label: t('Year'),
      defaultValue: '',
      href: null,
      options: body,
      linkable: false,
      component: 'FilterRange',
      min: 1970,
      max: Number(new Date().getFullYear()) + 1,
      step: 1,
      formatting: {
        type: 'range',
        formatValue: false,
      },
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
    },
    ...(configs.ENABLE_SELLABLE_BADGES
      ? {
          [filterKeys.badges]: {
            key: filterKeys.badges,
            label: t('Badges'),
            defaultValue: '',
            href: null,
            options: badges,
            linkable: false,
            component: 'FilterScrollCard',
            isMulti: true,
            allowSearch: false,
            showCountInTrigger: true,
          },
        }
      : {}),
    [filterKeys.city]: {
      key: filterKeys.city,
      label: t('City'),
      defaultValue: '',
      href: null,
      options: city,
      linkable: false,
      component: 'FilterScrollCard',
    },
    [filterKeys.condition]: {
      key: filterKeys.condition,
      label: t('Condition'),
      defaultValue: '',
      href: null,
      options: condition,
      linkable: false,
      component: 'FilterCheckBox',
      isMulti: true,
    },
    [filterKeys.mileage]: {
      key: filterKeys.mileage,
      label: t("KM's Driven"),
      defaultValue: '',
      href: null,
      formatting: {
        type: 'range',
        formatValue: true,
        suffix: t('km'),
      },
      options: [],
      linkable: false,
      showSlider: false,
      component: 'FilterRange',
      min: 0,
      max: 1000000,
    },
    [filterKeys.color]: {
      key: filterKeys.color,
      label: t('Color'),
      defaultValue: '',
      href: null,
      options: color,
      linkable: false,
      component: 'FilterScrollCard',
      isMulti: true,
    },
    [filterKeys.body]: {
      key: filterKeys.body,
      label: t('Body Type'),
      defaultValue: '',
      href: null,
      options: body,
      linkable: false,
      component: 'FilterScrollCard',
      isMulti: true,
    },
    [filterKeys.transmission]: {
      key: filterKeys.transmission,
      label: t('Transmission'),
      defaultValue: '',
      href: null,
      options: transmission,
      linkable: false,
      component: 'FilterCheckBox',
      isMulti: true,
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
    },
    [filterKeys.specialConditions]: {
      key: filterKeys.specialConditions,
      label: t('Special Conditions'),
      defaultValue: '',
      href: null,
      options: specialConditions,
      linkable: false,
      component: 'FilterCheckBox',
      isMulti: true,
    },
    [filterKeys.cc]: {
      key: filterKeys.cc,
      label: t('CC Ranges'),
      defaultValue: '',
      href: null,
      options: cc,
      linkable: false,
      component: 'FilterScrollCard',
    },
    ...(configs.spec_visibility
      ? {
          [filterKeys.spec]: {
            key: filterKeys.spec,
            label: t('Spec'),
            defaultValue: '',
            href: null,
            linkable: false,
            options: spec,
            component: 'FilterScrollCard',
          },
        }
      : {}),
  };
}

export const FILTERS_AGG_CONFIG = {
  goodDeal: {
    field: 'good_deal',
    key: 'good_deal',
    customQuery: () => ({
      aggs: { good_deal: { filter: { term: { good_deal: true } } } },
    }),
    customMapper: (aggregations) => aggregations?.good_deal?.doc_count ?? 0,
  },
  badges: { field: 'badges.slug', key: 'badges', size: 20 },
  make: { field: 'make.slug', key: 'make', size: 1000 },
  model: { field: 'model.slug', key: 'model', size: 1000 },
  variant: { field: 'variant.slug', key: 'variant', size: 200 },
  bodyType: { field: 'body_type.slug', key: 'body_type', size: 50 },
  fuelType: { field: 'fuel_type.slug', key: 'fuel_type', size: 20 },
  transmission: {
    field: 'transmission.slug',
    key: 'transmission',
    size: 10,
  },
  color: { field: 'exterior_color.slug', key: 'exterior_color', size: 100 },
  cc: {
    field: 'power',
    key: 'power',
    size: 50,
    transform: (value) => ({
      id: value,
      slug: value,
      label: translations.en.power(value),
      label_l1: translations.ar.power(value),
    }),
  },
  location: {
    field: 'location.slug',
    key: 'location',
    size: 1000,
    source: [
      'location.id',
      'location.slug',
      'location.title',
      'location.title_l1',
      'location.loc_2',
      'location.loc_3',
      'location.loc_4',
      'location.level',
    ],

    //Custom aggregation: multi-level terms, no nested wrapper
    customQuery: (activeFilters) => ({
      aggs: {
        level_2_locations: {
          terms: { field: 'location.loc_2', size: 500 },
        },
        level_3_locations: {
          terms: { field: 'location.loc_3', size: 500 },
        },
        level_4_locations: {
          terms: { field: 'location.loc_4', size: 500 },
        },
      },
    }),

    // Custom mapper: flatten levels and use LocationsService for labels
    customMapper: async (aggregations) => {
      const allLocations = await LocationsService.fetchAllLocations();
      const locationMap = new Map(allLocations.map((loc) => [loc.id, loc]));

      const formatBuckets = (buckets) =>
        (buckets || [])
          .map((bucket) => {
            const loc = locationMap.get(bucket.key);
            if (!loc) return null;

            return {
              id: bucket.key,
              label: loc.title,
              label_l1: loc.title_l1,
              slug: loc.slug,
              count: bucket.doc_count,
            };
          })
          .filter(Boolean);

      const data = [
        ...formatBuckets(aggregations?.level_2_locations?.buckets || []),
        ...formatBuckets(aggregations?.level_3_locations?.buckets || []),
        ...formatBuckets(aggregations?.level_4_locations?.buckets || []),
      ];

      return data.sort((a, b) => b.count - a.count);
    },
  },

  mileage: { field: 'km', key: 'km', size: 1000 },
  year: { field: 'year', key: 'year', size: 1000 },
  price: { field: 'price', key: 'price', size: 1000 },

  ['kasr-zero']: {
    field: 'kasr_zero',
    key: 'kasr_zero',
    value: true,
    size: 10,
  },
  financed: { field: 'financed.slug', key: 'financed', value: 'yes', size: 10 },
  imported: { field: 'imported.slug', key: 'imported', value: 'yes', size: 10 },
  electric: { field: 'fuel_type.slug', key: 'fuel_type', size: 10 },
  taxi: { field: 'taxi.slug', key: 'taxi', value: 'yes', size: 10 },
  classic: { field: 'classic', key: 'classic', value: true, size: 10 },
  disabled: { field: 'disabled.slug', key: 'disabled', value: 'yes', size: 10 },
};
