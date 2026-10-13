import { extractPriceRange } from '.';

export const FILTER_CONFIG = {
  TRANSMISSION_TAGS: new Set(['manual', 'automatic']),
  FIXED_TAGS: new Set([
    'kasr-zero',
    'taxi',
    'classic',
    'disabled',
    'used-car-financed',
    'used-car-pre-existing-installement',
    'imported-car',
    'imported',
  ]),
  FUEL_TAGS: new Set([
    'hybrid',
    'diesel',
    'electric',
    'gas',
    'plug-in-hybrid',
    'natural-gas',
  ]),
  TAG_INDEX_MAPPING: {
    'kasr-zero': { kasr_zero: true },
    taxi: { 'taxi.slug': 'yes' },
    classic: { classic: true },
    disabled: { 'disabled.slug': 'yes' },
    financed: { 'financed.slug': 'yes' },
    'used-car-pre-existing-installement': { installementOld: true },
    hybrid: { 'fuel_type.slug': 'hybrid' },
    electric: { 'fuel_type.slug': 'electric' },
    diesel: { 'fuel_type.slug': 'diesel' },
    gas: { 'fuel_type.slug': 'gas' },
    'plug-in-hybrid': { 'fuel_type.slug': 'plug-in-hybrid' },
    'natural-gas': { 'fuel_type.slug': 'natural-gas' },
    imported: { 'imported.slug': 'yes' },
    manual: { 'transmission.slug': 'manual' },
    automatic: { 'transmission.slug': 'automatic' },
  },
  BODY_TYPE_ID_TO_SLUG_MAPPING: {
    1: 'sedan',
    2: 'hatchback',
    3: 'coupe',
    4: '4x4',
    6: 'minivan',
    12: 'suv',

    23: 'pickup',
    21: 'light-pickup',
    26: 'medium-truck',

    16: 'minibus',
    14: 'microbus',
    19: 'van',

    30: 'scooter',
    28: 'standard',
    32: 'tricycle',
  },
  SPECIAL_CONDITIONS_KEYS_MAPPING_QUERY_PARAMS: {
    'used-car-financed': 'financed',
    'imported-car': 'imported',
  },
};

export function parseUsedCarsListingsUrl(slugParts, queryParams) {
  const { sortby, page: queryPage = 1, ...rest } = queryParams;

  const filters = {};
  const specialConditions = [];
  let body;
  const makeModel = [];
  let variant;
  let page = Number(queryPage);
  let city;

  for (let i = 0; i < slugParts?.length; i++) {
    const key = slugParts[i];
    const next = slugParts[i + 1];
    if (key === 'page' && next && !isNaN(Number(next))) {
      page = Number(next);
      i++;
    } else if (key === 'teraz' && next) {
      variant = next;
      i++;
    } else if (key === 'price-limit' && next) {
      const price = extractPriceRange(next);
      filters.price = { min: price.min, max: price.max };
      i++;
    } else if (key === 'year' && next) {
      filters.year = {
        ...{ max: next },
        ...{ min: next },
      };
      i++;
    } else if (key === 'cc' && next) {
      filters.cc = next;
      i++;
    } else if (key === 'body' && next) {
      body = next;
      i++;
    } else if (key === 'city' && next && i === 0) {
      city = next;
      i++;
    } else if (FILTER_CONFIG.FIXED_TAGS.has(key)) {
      if (!specialConditions.includes(key)) {
        if (FILTER_CONFIG.SPECIAL_CONDITIONS_KEYS_MAPPING_QUERY_PARAMS[key]) {
          specialConditions.push(
            FILTER_CONFIG.SPECIAL_CONDITIONS_KEYS_MAPPING_QUERY_PARAMS[key],
          );
        } else {
          specialConditions.push(key);
        }
      }
    } else if (FILTER_CONFIG.FUEL_TAGS.has(key)) {
      filters['fuel'] = key;
    } else if (FILTER_CONFIG.TRANSMISSION_TAGS.has(key)) {
      filters['transmission'] = key;
    } else {
      makeModel.push(key);
    }
  }

  return {
    ...(makeModel?.[0] && { make: makeModel?.[0] }),
    ...(makeModel?.[1] && { model: decodeURIComponent(makeModel?.[1]) }),
    ...(specialConditions.length && { specialConditions }),
    ...(variant && { variant }),
    ...(page !== 1 && { page }),
    ...(body && { body }),
    ...(city && { city: decodeURIComponent(city) }),
    ...(sortby && { sortby }),
    ...filters,
    ...rest,
  };
}
