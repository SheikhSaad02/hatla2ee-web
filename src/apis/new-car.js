import { apiClient } from '@/services/network/api-client';
import {
  mapDifferencewithOtherClasses,
  mapNewCarsModelCatalog,
  mapNewCarsVariantCatalog,
  mapNewListingModelLevelResponse,
  mapNewListingVariantLevelResponse,
} from '@/mappers/newCars';
import { convertQueryObjToString } from '@/utils/general';
import { cache } from 'react';

export async function getNewCarsData(vehicleType, queryParams) {
  const params = {
    'f[variant]': 'null',
    'f[listing_category.slug]': vehicleType,
    'sort[created_at]': 'desc',
    per_page: 10,
    ...queryParams,
  };

  const res = await apiClient.get(
    `/api/surge/consumer/new_listings${convertQueryObjToString(params)}`,
    { next: { revalidate: 60 } },
  );
  // Callers can request variant-level cards by passing f[variant]=notnull
  // (needed to scope by variant-only fields like f[fuel_type.slug]); use the
  // matching mapper so each item carries its own variant id.
  const result =
    params['f[variant]'] === 'notnull'
      ? mapNewCarsVariantCatalog(res)
      : mapNewCarsModelCatalog(res);
  return res?.error ? res : result;
}

export async function fetchListingsByMake(make, vehicleType, queryParams) {
  const params = {
    ...(make && { 'f[make.slug]': make }),
    ...(vehicleType && { 'f[listing_category.slug]': vehicleType }),
    'f[group_by]': 'model_generation_slug',
    ...queryParams,
  };

  const res = await apiClient.get(
    `/api/surge/consumer/new_listings/listings_by_make${convertQueryObjToString(
      params,
    )}`,
  );

  const result = mapNewCarsModelCatalog(res);
  return res?.error ? res : result;
}

export const fetchNewCarsByModel = cache(async (model, vehicleType) => {
  const res = await apiClient.get(
    `/api/surge/consumer/new_listings/?f[variant]=notnull&f[model.slug]=${decodeURIComponent(
      model,
    )}&?f[listing_category.slug]=${vehicleType}`,
  );

  const result = mapNewCarsVariantCatalog(res);
  return res?.error ? res : result;
});

export async function fetchNewListingVariantLevelDetail(variantID) {
  const timestamp = Date.now(); // to prevent cached response
  const res = await apiClient.get(
    `/api/surge/consumer/new_listings/${variantID}?_=${timestamp}`,
  );
  const transformedData = mapNewListingVariantLevelResponse(res?.listing);

  return res?.error ? res : transformedData;
}

export async function fetchNewListingModelLevelDetail(
  makeSlug,
  modelSlug,
  year,
  variant,
  categorySlug,
) {
  const params = new URLSearchParams();

  params.append('f[make.slug]', makeSlug);
  params.append('f[model.slug]', decodeURIComponent(modelSlug));
  params.append('f[group_by]', 'model_generation_slug');
  params.append('sort[launch_date]', 'desc');

  if (categorySlug) params.append('f[listing_category.slug]', categorySlug);

  if (variant) {
    params.append('f[variant.slug]', variant);
  }
  if (year) {
    params.append('f[launch_year][lte]', year);
    params.append('f[launch_year][gte]', year);
  }

  const queryString = params.toString();
  const url = `/api/surge/consumer/new_listings/listings_by_make?${queryString}`;
  const res = await apiClient.get(url);
  const transformedData = mapNewListingModelLevelResponse(res, true);

  return res?.error ? res : transformedData;
}

export const fetchDifferenceWithOtherClasses = cache(async (variantId) => {
  const res = await apiClient.get(
    `/api/surge/consumer/new_listings/variant_differences?listing_id=${variantId}`,
  );
  const transformedData = mapDifferencewithOtherClasses(res, true);

  return res?.error ? res : transformedData;
});
