import { USED_CAR_PRICES_MONTH_FILTER, MULTI_VALUE_SEPARATOR } from '@/constants';
import {
  KM_RANGE_QUERY_FIELD,
  BATTERY_CAPACITY_QUERY_FIELD,
} from '@/components/evLanding/data';

export function mapEvFiltersToQuery({ fuel, kmRange, batteryCapacity } = {}) {
  const query = {};

  if (fuel) {
    const fuelSlugs = (Array.isArray(fuel) ? fuel : [fuel])
      .flatMap((f) =>
        typeof f === 'string' ? f.split(MULTI_VALUE_SEPARATOR) : f?.slug,
      )
      .filter(Boolean);
    if (fuelSlugs.length) {
      query['f[fuel_type.slug]'] = fuelSlugs;
    }
  }

  if (kmRange) {
    if (kmRange.min) {
      query[`f[${KM_RANGE_QUERY_FIELD}][gte]`] = kmRange.min;
    }
    if (kmRange.max !== undefined && kmRange.max !== '') {
      query[`f[${KM_RANGE_QUERY_FIELD}][lte]`] = kmRange.max;
    }
  }

  if (batteryCapacity && batteryCapacity.value != null) {
    const operator = batteryCapacity.op === 'gt' ? 'gte' : 'lte';
    query[`f[${BATTERY_CAPACITY_QUERY_FIELD}][${operator}]`] =
      batteryCapacity.value;
  }

  return query;
}

export function buildUsedCarPriceParams({
  min,
  max,
  make,
  model,
  year,
  page,
  limit = 50,
  month,
} = {}) {
  const params = new URLSearchParams();

  if (min != null) params.set('f[min_avg_price]', min);
  if (max != null) params.set('f[max_avg_price]', max);
  if (page != null) params.set('page', page);
  if (make != null) params.set('f[make_slug]', make);
  if (model != null) params.set('f[model_slug]', decodeURIComponent(model));
  if (year != null) params.set('f[model_year]', year);
  if (limit) params.set('per_page', limit);
  if (month) params.set('f[month][gte]', USED_CAR_PRICES_MONTH_FILTER);

  return params;
}

export function buildNewCarPriceParams({
  min,
  max,
  make,
  model,
  variantId,
  year,
  page,
  limit = 50,
  vehicle = 'car',
} = {}) {
  const params = new URLSearchParams();

  if (min != null) params.set('f[price][gte]', min);
  if (max != null) params.set('f[price][lte]', max);
  if (page != null) params.set('page', page);
  if (limit) params.set('limit', limit);
  if (make) params.set('f[make.slug]', make);
  if (model != null) params.set('f[model.slug]', decodeURIComponent(model));
  if (variantId != null) params.set('f[variant.id]', variantId);
  if (year != null) params.set('f[model_year]', year);
  if (vehicle != null) params.set('f[listing_category.slug]', vehicle);

  return params;
}

export function buildFiltersQuery({
  make,
  body,
  transmission,
  fuel,
  price,
  discount,
  model,
  variant,
  kmRange,
  batteryCapacity,
  ...rest
} = {}) {
  const query = {};

  // Apply make filter if present
  if (make && make.slug) {
    query['f[make.slug]'] = make.slug;
  }

  // Apply body filter if present
  if (body && body.slug) {
    query['f[body_type.slug]'] = body.slug;
  }

  // Apply transmission filter if present
  if (transmission && transmission.slug) {
    query['f[transmission.slug]'] = transmission.slug;
  }

  // Apply model filter if present
  if (model && model.slug) {
    query['f[model.slug]'] = decodeURIComponent(model.slug);
  }

  // Apply variant filter if present
  if (variant) {
    query['f[variant]'] = variant;
  }

  // Apply price filters if present
  if (price) {
    if (price.min) {
      query['f[price][gte]'] = price.min;
    }
    if (price.max !== undefined) {
      query['f[price][lte]'] = price.max;
    }
  }

  // Apply discount filter if present
  if (discount) {
    query['f[discount]'] = discount;
  }

  Object.assign(query, mapEvFiltersToQuery({ fuel, kmRange, batteryCapacity }));

  // Apply any other filters
  Object.keys(rest).forEach((key) => {
    if (rest[key] !== undefined && rest[key] !== null) {
      query[`f[${key}]`] = rest[key];
    }
  });

  return query;
}
