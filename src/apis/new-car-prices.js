import {
  mapNewCarPriceChanges,
  newCarPriceMakesMapper,
  newCarPricingDataMapper,
} from '@/mappers/newCarPrices';
import { apiClient } from '@/services/network/api-client';
import { buildNewCarPriceParams } from '@/utils/apiUtils';
import { cacheBySerializedKey } from '@/utils/cacheBySerializedKey';

export async function fetchNewCarPrices({
  min,
  max,
  make,
  model,
  page,
  vehicle,
  limit,
} = {}) {
  const queryParams = buildNewCarPriceParams({
    min,
    max,
    make,
    model,
    page,
    vehicle,
    limit,
  });

  const url =
    `/api/surge/consumer/new_listings` +
    `?f[display]=true` +
    `&sort[price]=desc` +
    `&f[variant]=notnull` +
    `&${queryParams}`;

  const res = await apiClient.get(url);

  return {
    meta: res?.meta || {},
    data: newCarPricingDataMapper(res?.listings || [], vehicle),
    pagination: res?.pagination || {},
  };
}

export async function fetchNewCarPricesMakes({
  min,
  max,
  vehicle = 'car',
  priceChange = false,
} = {}) {
  const queryParams = buildNewCarPriceParams({
    vehicle,
    limit: 100,
  });

  if (min) {
    queryParams.set('f[min_official_price][gte]', min);
  }
  if (max) {
    queryParams.set('f[min_official_price][lte]', max);
  }
  if (priceChange) {
    queryParams.set('f[price_difference]', 'notnull');
    queryParams.set('f[variant.id]', 'notnull');
  } else {
    queryParams.set('f[imported.slug]', 'no');
    queryParams.set('f[variant.id]', 'null');
  }

  const url = `/api/surge/consumer/new_listings/makes_aggregation?${queryParams}`;
  const res = await apiClient.get(url);

  return newCarPriceMakesMapper({
    apiData: res?.makes || [],
    priceChange,
    vehicle,
  });
}

export async function fetchNewCarPricesModels({
  make,
  vehicle = 'car',
  priceChange = false,
} = {}) {
  const queryParams = buildNewCarPriceParams({
    make,
    vehicle,
    limit: 100,
  });
  if (priceChange) {
    queryParams.set('f[price_difference]', 'notnull');
    queryParams.set('f[variant.id]', 'notnull');
  }

  const url = `/api/surge/consumer/new_listings/models_aggregation?${queryParams}`;
  const res = await apiClient.get(url);

  return newCarPriceMakesMapper({
    apiData: res?.models || [],
    priceChange,
    make,
    vehicle,
  });
}

async function fetchPriceChanges({
  makeSlug,
  modelSlug,
  variantId,
  page,
  limit = 10,
  vehicle,
}) {
  const queryParams = buildNewCarPriceParams({
    make: makeSlug,
    model: modelSlug,
    variantId,
    page,
    vehicle,
  });
  const res = await apiClient.get(
    `/api/surge/consumer/price_logs?per_page=${limit}&${queryParams}`,
  );
  const transformedData = mapNewCarPriceChanges(res);

  return {
    data: transformedData,
    pagination: res?.pagination,
  };
}

export const getPriceChanges = cacheBySerializedKey(fetchPriceChanges);

export async function fetchNewCarVariantPrice({ make, model, year, variant }) {
  const queryParams = buildNewCarPriceParams({
    make,
    model,
    variantId: variant,
  });

  let url = `/api/surge/consumer/new_listings?${queryParams}&sort[price]=asc`;

  if (year) {
    url += `&f[launch_year][gte]=${year}&f[launch_year][lte]=${year}`;
  }

  url += `&f[variant]=notnull`;

  const res = await apiClient.get(url);

  // A model can span a price range across its variants, so take the lower end
  const prices = (res?.listings || [])
    .map((listing) => Number(listing?.price))
    .filter((price) => price > 0);

  return prices.length ? Math.min(...prices) : null;
}
