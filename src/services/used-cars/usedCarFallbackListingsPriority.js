import configs from '@/configs';
import { ListingsService } from '@/services/elasticsearch/listings-service';

const FALLBACK_LISTINGS_SORTBY = { slug: 'updated_at_desc' };
export const USED_CAR_FALLBACK_THRESHOLD = 14;
export const USED_CAR_FALLBACK_FETCH_SIZE = 40;

function mergeTierResults(tierResultArrays, cap) {
  // Since exclusions guarantee uniqueness, we can simply concatenate results
  const merged = [];
  for (const items of tierResultArrays) {
    if (!items?.length) continue;
    for (const item of items) {
      if (item?.listing_id != null) {
        merged.push(item);
        if (merged.length >= cap) return merged;
      }
    }
  }
  return merged;
}

function findL2ParentInHierarchy(city) {
  const h = city?.hierarchy;
  return h?.find((l) => Number(l.level) === 2) ?? null;
}

function expandPriceRange(price) {
  if (!price) return undefined;
  const result = {};
  if (price.min) result.min = Math.floor((Number(price.min) * 9) / 10);
  if (price.max) result.max = Math.ceil((Number(price.max) * 11) / 10);
  return Object.keys(result).length ? result : undefined;
}

export function buildFallbackQueries(filters) {
  const { city, make, model, year, price } = filters;
  const originalFilters = { city, make, model, year, price };
  const expandedPrice = expandPriceRange(price);

  const steps = [];
  let current = { city, make, model, year, price: expandedPrice };
  let lastExclude = {};

  const clean = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

  const push = (filterObj, excludeObj = {}) => {
    const cleanedFilters = clean(filterObj);
    const cleanedExcludes = clean(excludeObj);
    if (Object.keys(cleanedFilters).length > 0) {
      steps.push({
        filters: cleanedFilters,
        excludes: cleanedExcludes,
      });
    }
  };

  // normalize city (if level > 2)
  if (city && city.level > 2) {
    current = { ...current, city: findL2ParentInHierarchy(city) };
    push(current, {});
  }

  // drop city
  if (city) {
    const droppedCity = current.city;
    current = { ...current, city: undefined };
    lastExclude = { city: droppedCity };
    push(current, lastExclude);
  }

  // drop price
  if (price) {
    current = { ...current, price: undefined };
    lastExclude = { price: expandedPrice };
    push(current, lastExclude);
  }

  // drop year — next tier excludes only this year
  if (year) {
    current = { ...current, year: undefined };
    lastExclude = { year: originalFilters.year };
    push(current, lastExclude);
  }

  // drop model — next tier excludes only this model
  if (model) {
    current = { ...current, model: undefined };
    lastExclude = { model: originalFilters.model };
    push(current, lastExclude);
  }

  // drop make — global tier will exclude only this make
  if (make) {
    lastExclude = { make: originalFilters.make };
  }

  // Global fallback — excludes only what the last non-global tier had
  steps.push({
    filters: {},
    excludes: clean(lastExclude),
  });

  return steps;
}

export function getFallbackTitleKey(originalFilters, plans) {
  const { city, make, model, year, price } = originalFilters;

  if (city && city.level > 2) {
    return 'exploreOtherCarsInLocation';
  }

  if (price && (make || model || year)) {
    return 'exploreMoreCarsInSimilarPriceRange';
  }

  const hasGlobalFallback = plans.some(
    (plan) => Object.keys(plan.filters).length === 0,
  );

  const originalFilterCount = Object.keys(originalFilters).filter(
    (key) => originalFilters[key],
  ).length;

  if (hasGlobalFallback && originalFilterCount <= 1) {
    return 'discoverOtherCarsForSale';
  }

  return 'discoverSimilarCarsForSale';
}

/**
 * @param {unknown[]} [excludeListingIds]
 */
export async function fetchUsedCarFallbackListingsPriority({
  updatedFilters = {},
  primaryGridCount = 0,
  excludeListingIds = [],
}) {
  const fallbackCap = Math.max(
    0,
    configs.slotting.usedCars.pageSize - primaryGridCount,
  );
  if (fallbackCap === 0)
    return { listings: [], titleKey: 'discoverSimilarCarsForSale' };

  const plans = buildFallbackQueries(updatedFilters);
  if (!plans.length) {
    return { listings: [], titleKey: 'discoverSimilarCarsForSale' };
  }

  const titleKey = getFallbackTitleKey(updatedFilters, plans);

  const tierResults = await Promise.all([
    ...plans.map(async (tierPlan) => {
      const { items } = await ListingsService.getUsedCarsListings({
        filters: { ...tierPlan.filters, sortby: FALLBACK_LISTINGS_SORTBY },
        page: 1,
        pageSize: fallbackCap,
        additionalOptions: {
          excludeListingIds,
          excludeFilters: tierPlan.excludes,
        },
      });
      return items ?? [];
    }),
  ]);

  return {
    listings: mergeTierResults(tierResults, fallbackCap),
    titleKey: titleKey,
  };
}
