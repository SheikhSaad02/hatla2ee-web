import { MULTI_VALUE_SEPARATOR } from '@/constants';

const SPECIAL_CONDITIONS_KEYS = new Set([
  'withImage',
  'imported',
  'kasr',
  'kasr-zero', //added since we use kasr-zero on pretty pages and kasr on dirty pages, so we use kase-zero and for existing to work, also add kasr with a condition in the parser
  'taxi',
  'classic',
  'disabled',
  'financed',
  'installement',
  'installementOld',
  'electric',
]);

const QUERY_KEYS_CONSISTENCY_MAPPING = {
  kasr: 'kasr-zero',
  installement: 'financed',
  installementOld: 'financed',
};

export function parseQueryParamsToFilters(queryParams) {
  const filters = {};
  const specialConditions = [];
  let make;
  let model;
  let variant;
  let page = 1;
  let city;

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) {
      return;
    }

    if (key === 'make') {
      make = Number(value);
    } else if (key === 'model') {
      model = Number(value);
    } else if (key === 'variant' || key === 'variant') {
      variant = Number(value);
    } else if (key === 'page') {
      page = parseInt(value, 10);
    } else if (key === 'city') {
      city = value;
    } else if (key === 'priceMax' || key === 'priceMin') {
      filters.price = {
        ...filters.price,
        ...(key === 'priceMax' && { max: value }),
        ...(key === 'priceMin' && { min: value }),
      };
    } else if (key === 'dateMin' || key === 'dateMax') {
      filters.year = {
        ...filters.year,
        ...(key === 'dateMax' && { max: value }),
        ...(key === 'dateMin' && { min: value }),
      };
    } else if (key === 'kmMin' || key === 'kmMax') {
      filters.mileage = {
        ...filters.mileage,
        ...(key === 'kmMax' && { max: value }),
        ...(key === 'kmMin' && { min: value }),
      };
    } else {
      if (SPECIAL_CONDITIONS_KEYS.has(key)) {
        if (QUERY_KEYS_CONSISTENCY_MAPPING[key]) {
          specialConditions.push(QUERY_KEYS_CONSISTENCY_MAPPING[key]);
        } else {
          specialConditions.push(key);
        }
      } else {
        const parts = String(value)
          .split(MULTI_VALUE_SEPARATOR)
          .filter(Boolean);
        filters[key] = parts.length > 1 ? parts : parts[0];
      }
    }
  });

  const result = {
    ...(make && { make }),
    ...(model && { model }),
    ...(specialConditions.length && { specialConditions }),
    ...(variant && { variant }),
    ...(page !== 1 && { page }),
    ...(city && { city }),
    ...filters,
  };

  return result;
}
