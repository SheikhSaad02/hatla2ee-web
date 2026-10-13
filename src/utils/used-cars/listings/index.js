import tenantData from '@data';
import { formatNumberValue, formatPriceRange } from '@/utils/numbers';
import { FILTER_CONFIG } from './prettyParser';
import { MULTI_VALUE_SEPARATOR } from '@/constants';

export function createPaginationWithQueryParams(pathname, searchParams, value) {
  const params = new URLSearchParams(searchParams);

  if (value === 1) {
    params.delete('page');
  } else {
    params.set('page', String(value));
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function extractBuckets(buckets, fieldKey) {
  return buckets?.map((bucket) => {
    const source =
      bucket?.label_value?.hits?.hits?.[0]?._source?.[fieldKey] || {};
    return {
      slug: bucket.key,
      label: source.label || '',
      label_l1: source.label_l1 || '',
      value: source.slug || '',
      count: bucket.doc_count,
      ...(source.id && { id: source.id }),
    };
  });
}

export function extractPriceRange(
  priceLimit,
  priceRanges = tenantData.usedListingsFilterData.priceRanges,
) {
  const numericLimit = Number(priceLimit);

  if (numericLimit === 200000) {
    return { min: 1000, max: numericLimit };
  }

  const index = priceRanges.findIndex((range) => range.slug === numericLimit);

  if (index > 0) {
    return {
      min: priceRanges[index - 1].slug,
      max: priceRanges[index].slug,
    };
  }

  return {
    min: 1000,
    max: priceLimit,
  };
}

export function getChipsFromData(_data, filterConfig, options) {
  const { t = (e) => e, locale, commonT } = options;
  const { page, sortby, ...data } = _data;
  const chips = [];

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && value?.length) {
      value.forEach((condition) =>
        chips.push({
          label: condition.label,
          label_l1: condition.label_l1,
          key: condition.slug,
          slug: condition.slug,
        }),
      );
    } else if (value && typeof value === 'object') {
      const isRange = 'min' in value || 'max' in value;
      chips.push({
        ...(isRange
          ? {
              label: getDisplayValue(value, t, commonT, {
                ...(filterConfig[key]?.formatting || {}),
                locale,
              }),
              label_l1: getDisplayValue(value, t, commonT, {
                ...(filterConfig[key]?.formatting || {}),
                locale,
              }),
              value: `${value.min}-${value.max}`,
            }
          : value),
        key,
      });
    }
  });

  return chips;
}

export function getFilterCount(_initialData) {
  const { page, sortby, ...initialData } = _initialData;
  if (!initialData || typeof initialData !== 'object') return 0;

  return Object.values(initialData).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    if (value !== null && value !== undefined && value !== '') {
      return count + 1;
    }
    return count;
  }, 0);
}

export function mapFiltersToQuery(filterValues) {
  const { page, ...restFilters } = filterValues;
  const queryObj = {};

  /* Theses keys will be removed once mileage and year keys are renamed */
  const rangeMapping = {
    price: { minKey: 'priceMin', maxKey: 'priceMax' },
    mileage: { minKey: 'kmMin', maxKey: 'kmMax' },
    year: { minKey: 'dateMin', maxKey: 'dateMax' },
  };
  const getBodyLegacyId = (item) => {
    const bodyId = Object.keys(FILTER_CONFIG.BODY_TYPE_ID_TO_SLUG_MAPPING).find(
      (id) => FILTER_CONFIG.BODY_TYPE_ID_TO_SLUG_MAPPING[id] === item?.slug,
    );
    return bodyId || item?.id;
  };
  const toQueryValue = (key, item) =>
    key === 'body' ? getBodyLegacyId(item) : (item?.id ?? item?.slug ?? item);

  Object.entries(restFilters).forEach(([key, value]) => {
    if (rangeMapping[key] && (value?.min != null || value?.max != null)) {
      const { minKey, maxKey } = rangeMapping[key];
      if (value.min) queryObj[minKey] = value.min;
      if (value.max) queryObj[maxKey] = value.max;
    } else if (key === 'specialConditions' && Array.isArray(value)) {
      value.forEach((item) => {
        if (item?.slug) {
          queryObj[item.slug] = 1;
        }
      });
    } else if (Array.isArray(value)) {
      if (value.length)
        queryObj[key] = value.map((v) => toQueryValue(key, v)).join(MULTI_VALUE_SEPARATOR);
    } else if (value !== null && value !== undefined && value !== '') {
      queryObj[key] = toQueryValue(key, value);
    }
  });

  return queryObj;
}

export const getDisplayValue = (value, t, commonT, options) => {
  const { isMulti, type, formatValue, locale, preffix, suffix } = options;
  if (isMulti && Array.isArray(value)) {
    return value.map((item) => t(item, 'label', commonT)).join(', ');
  }

  if (type === 'range') {
    let formattedValue = formatPriceRange(
      value?.min,
      value?.max,
      locale,
      formatValue ? formatNumberValue : (e) => e,
    );
    if (preffix && formattedValue) {
      formattedValue = `${preffix} ${formattedValue}`;
    }
    if (suffix && formattedValue) {
      formattedValue = `${formattedValue} ${suffix}`;
    }
    return formattedValue;
  }

  return t(value, 'label', commonT);
};

// Helper function to get parent city info
export function getParentCityInfo(location) {
  if (
    !location?.hierarchy ||
    !Array.isArray(location.hierarchy) ||
    !location.city_id
  ) {
    return null;
  }
  const parentCity = ((
    o = location.hierarchy.find((l) => l.level === location.level - 1),
  ) => o && { ...o, label: o.title, label_l1: o.title_l1 })();

  return parentCity;
}

export function attachCountsAndSort(items, countsMap = {}, options = {}) {
  const { key = 'slug', sort = true, direction = 'desc' } = options;

  let merged = items.reduce((acc, item) => {
    const count = countsMap[item[key]];
    if (count) {
      acc.push({ ...item, doc_count: count });
    }
    return acc;
  }, []);

  if (sort) {
    merged = merged.sort((a, b) =>
      direction === 'desc'
        ? b.doc_count - a.doc_count
        : a.doc_count - b.doc_count,
    );
  }

  return merged;
}

export const getDynamicLabel = ({ label, label_l1, value, locale, t }) => {
  const dynamicLabel = locale === 'ar' ? label_l1 || t(label) : label;
  if (value === 'info') {
    return `${dynamicLabel || ''} ${t('Info')}`.trim();
  }
  return dynamicLabel || '';
};

export const combinedGrid = ({ listings, quickFilter }) => {
  const combined = [];
  const pushToEnd = [];
  let listingIndex = 0;
  let filterIndex = 0;

  while (listingIndex < listings.length || filterIndex < quickFilter.length) {
    const nextListings = listings.slice(listingIndex, listingIndex + 4);
    nextListings.forEach((item) =>
      combined.push({
        type: 'listing',
        value: item,
      }),
    );
    listingIndex += nextListings.length;
    if (filterIndex < quickFilter?.length) {
      const filter = quickFilter[filterIndex];
      if (filter.value == 'info') {
        pushToEnd.push({ type: 'filter', value: filter });
      } else {
        combined.push({ type: 'filter', value: filter });
      }
      filterIndex++;
    }
  }
  combined.push(...pushToEnd);
  return combined;
};

export const LISTING_GRID_COLUMNS = 3;
export const FILLER_CARD_MAX_SPAN = 2;

/**
 * Places the filler card in the middle row of the grid, spanning the slots the
 * listings leave empty so it never adds a row and the grid stays gap free.
 * Returns null when the listings fill every row exactly.
 *
 * @returns {{ position: number, span: number } | null} position is a 1-based
 * item count: the card goes right after that many grid items.
 */
export const getFillerCardPlacement = ({ itemCount, columns, maxSpan }) => {
  if (!itemCount || columns < 1) return null;

  const emptySlots = (columns - (itemCount % columns)) % columns;
  const span = Math.min(maxSpan, emptySlots);
  if (span < 1) return null;

  const totalRows = Math.ceil((itemCount + span) / columns);
  const middleRow = Math.ceil(totalRows / 2);

  return { position: (middleRow - 1) * columns + (columns - span), span };
};
