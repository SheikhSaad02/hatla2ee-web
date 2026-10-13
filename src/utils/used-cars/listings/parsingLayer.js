import { ListingsService } from '@/services/elasticsearch/listings-service';
import { LocationsService } from '@/services/elasticsearch/location-service';
import { FILTER_CONFIG } from './prettyParser';
import { MakesService } from '@/services/elasticsearch/makes-service';
import { isNumeric, sanitizeData } from '@/utils/general';
import { ModelsService } from '@/services/elasticsearch/models-service';
import tenantFilterData from '@data';
export function normalizeUiFiltersToQuery(filters) {
  const query = {};

  if (filters.makeModal?.make) {
    query.make = filters.makeModal?.make;
  }

  if (filters.makeModal?.model) {
    query.model = filters.makeModal?.model;
  }

  if (filters.city) {
    query.city = filters.city;
  }
  if (filters.range) {
    let { min, max } = filters.range;

    if (min && max && min > max) {
      [min, max] = [max, min];
    }

    if (min) query.priceMin = min;
    if (max) query.priceMax = max;
  }

  if (filters.year) {
    let { min, max } = filters.year;

    if (min && max && min > max) {
      [min, max] = [max, min];
    }

    if (min) query.dateMin = min;
    if (max) query.dateMax = max;
  }

  if (filters.condition && filters.condition !== 'all') {
    query.condition = filters.condition;
  }

  if (filters.fuel?.length) {
    query.fuel = filters.fuel;
  }

  return query;
}

export async function populateFilters(filters, config = {}) {
  const matchOne = (array, value) => {
    if (!value) return null;
    let match = array.find((item) => item.slug === value);
    if (!match && isNumeric(value)) {
      match = array.find((item) => item.id === parseInt(value));
    }
    return match;
  };

  const findItem = (array, value, mapToken = (v) => v) => {
    if (Array.isArray(value)) {
      const matches = value
        .map((v) => matchOne(array, mapToken(v)))
        .filter(Boolean);
      return matches.length ? matches : undefined;
    }
    return matchOne(array, mapToken(value));
  };

  const {
    city,
    make,
    model,
    variant,
    body,
    fuel,
    color,
    transmission,
    sortby,
    condition,
    cc,
    badges,
    spec,
  } = filters;

  const { fetchYearWithVariant = true } = config;

  const fetchedFilters = {};

  const cityPromise = city ? LocationsService.fetchAllLocations() : null;
  const makePromise = make ? MakesService.getAllMakes() : null;
  const modelPromise = model
    ? ModelsService.getAllModelsForMake(filters?.make)
    : null;
  const variantPromise = variant
    ? ListingsService.getVariantDetail(filters?.variant)
    : null;
  const ccPromise = cc ? ListingsService.getCCRanges() : null;
  const fuelType = fuel ? ListingsService.getFuelTypes() : null;
  const bodyType = body ? ListingsService.getBodyTypes() : null;
  const colors = color ? ListingsService.getColors() : null;
  const { usedListingsFilterData } = tenantFilterData;

  const [
    cityRes,
    makeRes,
    modelRes,
    variantRes,
    ccRes,
    fuelRes,
    bodyRes,
    colorsRes,
  ] = await Promise.all([
    cityPromise,
    makePromise,
    modelPromise,
    variantPromise,
    ccPromise,
    fuelType,
    bodyType,
    colors,
  ]);

  if (cityRes) {
    fetchedFilters.city = findItem(cityRes, city);
  }

  if (makeRes) {
    fetchedFilters.make = findItem(makeRes, make);
  }

  if (modelRes) {
    fetchedFilters.model = findItem(modelRes, filters?.model);
  }

  if (variant) {
    fetchedFilters.variant = variantRes?._source?.variant;
    if (variantRes) {
      const { year } = variantRes?._source;
      if (fetchYearWithVariant && year) {
        fetchedFilters.year = { min: year, max: year };
      }
    }
  }

  if (body) {
    fetchedFilters.body = findItem(
      bodyRes,
      body,
      (v) => FILTER_CONFIG.BODY_TYPE_ID_TO_SLUG_MAPPING[v] ?? v,
    );
  }

  if (filters?.specialConditions) {
    const keysInUrl = filters.specialConditions;
    const matched = usedListingsFilterData.specialConditions.filter((c) =>
      keysInUrl.includes(c.slug),
    );
    if (matched?.length) {
      fetchedFilters.specialConditions = matched;
    }
  }

  if (fuelRes) {
    fetchedFilters.fuel = findItem(fuelRes, fuel);
  }

  if (color) {
    fetchedFilters.color = findItem(colorsRes, color);
  }

  if (transmission) {
    fetchedFilters.transmission = findItem(
      usedListingsFilterData.transmission,
      transmission,
    );
  }

  if (badges) {
    fetchedFilters.badges = findItem(usedListingsFilterData.badges, badges);
  }

  if (sortby) {
    fetchedFilters.sortby = usedListingsFilterData.sortby.find(
      (item) => item.slug === filters.sortby,
    );
  }

  if (condition) {
    fetchedFilters.condition = findItem(
      usedListingsFilterData.condition,
      condition,
    );
  }

  if (ccRes) {
    fetchedFilters.cc = findItem(ccRes.items, parseInt(cc));
  }

  if (spec) {
    fetchedFilters.spec = findItem(usedListingsFilterData.spec, spec);
  }

  return sanitizeData({
    ...filters,
    ...fetchedFilters,
  });
}
