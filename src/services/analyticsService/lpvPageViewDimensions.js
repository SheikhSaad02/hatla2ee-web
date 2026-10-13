import { formatPriceRange } from '@/utils/numbers';

const DIMENSION_KEYS = {
  make: 'brand',
  model: 'model',
  city: 'location',
  body: 'body_type',
  fuel: 'fuel_type',
};

const buildPriceRangeSlug = (price) => {
  const result = formatPriceRange(
    price?.min,
    price?.max,
    undefined,
    (n) => String(n),
    false,
  );
  return result?.toString().replace(/\s/g, '') ?? null;
};

export function getLpvDimensionsFromFilters(filters) {
  if (!filters) return {};

  const dimensions = {};

  for (const filterKey in DIMENSION_KEYS) {
    const slug = filters[filterKey]?.slug;
    if (slug) dimensions[DIMENSION_KEYS[filterKey]] = slug;
  }

  const priceRange = buildPriceRangeSlug(filters.price);
  if (priceRange) dimensions.price_range = priceRange;

  return dimensions;
}
