import { apiClient } from '@/services/network/api-client';
import {
  mapNewCarsModelCatalog,
  mapNewCarsVariantCatalog,
} from '@/mappers/newCars';
import { convertQueryObjToString, isNumeric } from '@/utils/general';
import { cache } from 'react';
import {
  getShouldfetchVariantLevelAds,
  populateFiltersObject,
} from '@/utils/new-cars/listings';
import { newVehiclesCategorySlugs } from '@/constants';
import configs from '@/configs';
import { IMAGES_BASE_URL } from '@/constants';
import filterData from '@data';
import { buildFiltersQuery, mapEvFiltersToQuery } from '@/utils/apiUtils';
export const newVehiclePageSize = 20;

export const fetchNewCarsListingsData = async (
  filters,
  categorySlug,
  fetchVariantLevelAds = false,
  options,
) => {
  const {
    page = 1,
    sortby = filterData.NEW_VEHICLES_DEFAULT_SORT,
    make,
    model,
    price,
    body,
    transmission,
    fuel,
    discount,
    kmRange,
    batteryCapacity,
    ...rest
  } = filters;
  const fVariant = fetchVariantLevelAds ? 'notnull' : 'null';
  const sortbyMapped =
    filterData.getNewVehiclesSortFieldMapping(!fetchVariantLevelAds)[
      sortby.slug
    ];

  const query = {
    ...sortbyMapped,
    per_page: newVehiclePageSize,
    page: page,
    ...(categorySlug && { 'f[listing_category.slug]': categorySlug }),
    'f[variant]': fVariant,
    ...(discount && { [`f[discount]`]: discount }),
    ...rest,
  };

  // if (options.showListingsOnly) {
  //   query['f[imported.slug]'] = 'no';
  // }

  if (make && make.slug) {
    query['f[make.slug]'] = make.slug;
  }
  if (model && model.slug) {
    query['f[model.slug]'] = decodeURIComponent(model.slug);
  }

  if (price) {
    if (price.min) {
      query['f[price][gte]'] = price.min;
    }
    if (price.max !== undefined) {
      query['f[price][lte]'] = price.max;
    }
  }

  if (body && body.slug) {
    query['f[body_type.slug]'] = body.slug;
  }

  if (transmission && transmission.slug) {
    query['f[transmission.slug]'] = transmission.slug;
  }

  Object.assign(query, mapEvFiltersToQuery({ fuel, kmRange, batteryCapacity }));
  const queryString = convertQueryObjToString(query);

  const response = await apiClient.get(
    `/api/surge/consumer/new_listings${queryString}`,
  );

  if (response.error) {
    return response.error;
  }

  const pgn = response.pagination || {};
  return {
    data: fetchVariantLevelAds
      ? mapNewCarsVariantCatalog(response)
      : mapNewCarsModelCatalog(response),
    pagination: {
      totalCount: pgn.total_count,
      nextPage: pgn.next_page,
      prevPage: pgn.prev_page,
      totalPages: pgn.total_pages,
      currentPage: pgn.current_page,
    },
  };
};

export const fetchNewVehiclesFiltersData = async (
  filters = {},
  categorySlug,
  fetchVariantLevelAds,
  useDynamicFilters = true,
) => {
  const variantQuery = {
    'variant.id': fetchVariantLevelAds ? 'notnull' : 'null',
  };
  const { page, sortby, ...rest } = filters;
  const { make } = filters;

  const filtersToUse = useDynamicFilters ? { ...rest, ...variantQuery } : variantQuery;

  const promises = [
    fetchMakesData(categorySlug, filtersToUse),
    fetchBodyTypesData(categorySlug, filtersToUse),
    fetchFuelTypesData(categorySlug, filtersToUse),
  ];

  if (make?.slug || make) {
    promises.push(
      fetchModelsData(make?.slug || make, categorySlug, filtersToUse),
    );
  }

  const [makes, bodyTypes, fuelTypes, models] = await Promise.all(promises);

  return {
    makes,
    bodyTypes,
    fuelTypes,
    models,
    transmissions: filterData.newListingsFilterData.transmission,
    sortby: filterData.newListingsFilterData.sortby,
  };
};

export const fetchModelsData = async (makeSlug, categorySlug, filters = {}) => {
  const baseQuery = {
    'f[listing_category.slug]': categorySlug,
    ...(isNumeric(makeSlug)
      ? { 'f[make.id]': makeSlug }
      : { 'f[make.slug]': makeSlug }),
  };

  // Exclude model filter since we're fetching models
  const { model, ...rest } = filters;

  const query = { ...baseQuery, ...buildFiltersQuery(rest) };

  const response = await apiClient.get(
    `/api/surge/consumer/new_listings/models_aggregation${convertQueryObjToString(
      query,
    )}`,
  );
  return response.models;
};
export const fetchVariantsData = async (
  makeSlug,
  modelSlug,
  yearSlug,
  categorySlug,
  appendYearInLabel = false,
) => {
  let url = `/api/surge/consumer/new_listings/variants?f[make.slug]=${makeSlug}&f[listing_category.slug]=${categorySlug}&f[model.slug]=${decodeURIComponent(
    modelSlug,
  )}&f[variant]=notnull`;

  if (yearSlug) {
    url += `&f[launch_year]=${yearSlug}`;
  }

  const response = await apiClient.get(url);
  const variants = response.variants || [];

  if (!appendYearInLabel) return variants;
  return variants.map((variant) => {
    return {
      ...variant,
      label: `${variant?.year || ''} ${variant.label}`,
      label_l1: `${variant?.year || ''} ${variant.label_l1}`,
    };
  });
};

export const fetchMakesData = async (categorySlug, filters = {}) => {
  const baseQuery = {
    'f[listing_category.slug]': categorySlug,
  };

  // Exclude make filter since we're fetching makes
  const { make, ...rest } = filters;

  const query = { ...baseQuery, ...buildFiltersQuery(rest) };
  const queryString = convertQueryObjToString(query);

  const response = await apiClient.get(
    `/api/surge/consumer/new_listings/makes_aggregation${queryString}`,
  );
  return response?.error
    ? response
    : response?.makes?.map((make) => ({
        ...make,
        ...(!configs.USE_BRAND_SPRITE && {
          src: `${IMAGES_BASE_URL}/${make?.slug}/thumbnail.png`,
        }),
      }));
};
export const fetchBodyTypesData = async (categorySlug, filters = {}) => {
  const baseQuery = {
    'f[listing_category.slug]': categorySlug,
  };

  // Exclude body filter since we're fetching body types
  const { body, ...rest } = filters;

  const query = { ...baseQuery, ...buildFiltersQuery(rest) };
  const queryString = convertQueryObjToString(query);

  const response = await apiClient.get(
    `/api/surge/consumer/new_listings/body_types_aggregation${queryString}`,
  );
  return response.body_types;
};

export const fetchFuelTypesData = async (categorySlug, filters = {}) => {
  const baseQuery = {
    'f[listing_category.slug]': categorySlug,
  };

  // Exclude fuel filter since we're fetching fuel types
  const { fuel, ...rest } = filters;

  const query = { ...baseQuery, ...buildFiltersQuery(rest) };
  const queryString = convertQueryObjToString(query);

  const response = await apiClient.get(
    `/api/surge/consumer/new_listings/fuel_types_aggregation${queryString}`,
  );
  return response.fuel_types;
};
export const fetchNewListingOriginMakes = async (
  origin,
  vehicleParam,
  categorySlug,
) => {
  const response = await apiClient.get(
    `/api/surge/consumer/generics/new_listing_makes?origin=${origin}&f[listing_category.slug]=${categorySlug}`,
  );
  return response?.error
    ? response
    : response?.makes?.map((make) => ({
        ...make,
        href: `/${vehicleParam}/${make.slug}`,
        ...(!configs.USE_BRAND_SPRITE && {
          src: `${IMAGES_BASE_URL}/${make?.slug}/thumbnail.png`,
        }),
      }));
};

/* Todo Improvement: hit index to fetch exact facets objects */
export const getNewVehiclesFiltersData = cache(
  async (queryParams, categorySlug, fetchVariantLevelAds) => {
    const data = await fetchNewVehiclesFiltersData(
      queryParams,
      categorySlug,
      fetchVariantLevelAds,
    );
    return populateFiltersObject(data, queryParams);
  },
);

export const fetchTopSearchedNewVehicles = async (
  categorySlug = newVehiclesCategorySlugs.newCars,
) => {
  const query = {
    per_page: 10,
    'f[listing_category.slug]': categorySlug,
    'sort[rank]': 'asc',
    'f[rank][gt]': '0',
    'f[variant]': 'null',
  };
  const response = await apiClient.get(
    `/api/surge/consumer/new_listings${convertQueryObjToString(query)}`,
  );
  if (response.error) {
    return response.error;
  }
  return mapNewCarsModelCatalog(response);
};

export const fetchDiscountsAndOffersNewVehicles = async (
  categorySlug = newVehiclesCategorySlugs.newCars,
) => {
  const query = {
    per_page: 10,
    'f[listing_category.slug]': categorySlug,
    'f[variant]': 'null',
    /* f[] filters are AND-ed, so the offer types go in or[] branches to match
       listings that have either a discount or cashback. */
    'or[0][discount]': 'notnull',
    'or[1][cashback]': 'notnull',
  };
  const response = await apiClient.get(
    `/api/surge/consumer/new_listings${convertQueryObjToString(query)}`,
  );
  if (response.error) {
    return response.error;
  }
  return mapNewCarsModelCatalog(response);
};
