import { appPaths, IMAGES_BASE_URL } from '@/constants';
import {
  carEvaluationMapper,
  usedCarPricingDataMapper,
  usedCarPricingDetailDataMapper,
} from '@/mappers/usedCarPrices';
import { apiClient } from '@/services/network/api-client';
import { buildUsedCarPriceParams } from '@/utils/apiUtils';
import { formatMonthYear } from '@/utils/date';
import configs from '@/configs';
export async function fetchUsedCarPrices({
  min,
  max,
  make,
  model,
  year,
  page,
  limit,
  sortParam = 'avg_price',
  monthFilter,
} = {}) {
  const params = buildUsedCarPriceParams({
    min,
    max,
    make,
    model,
    year,
    page,
    month: monthFilter,
    limit,
  });

  const res = await apiClient.get(
    `/api/surge/consumer/used_car_prices?sort[${sortParam}]=desc&${params}`,
  );

  if (res?.error) {
    return { error: res.error };
  }

  const transformedData = usedCarPricingDataMapper(
    res?.car_price_avgs,
    make,
    model,
  );
  return {
    meta: transformedData.meta,
    data: transformedData.data,
    pagination: res?.pagination,
  };
}

export async function fetchUsedCarPricesDetail({
  make,
  model,
  year,
  page,
  locale,
  sortParam = 'month',
} = {}) {
  const params = buildUsedCarPriceParams({ make, model, year, page });

  const res = await apiClient.get(
    `/api/surge/consumer/used_car_prices/detail?sort[${sortParam}]=desc&${params}`,
  );

  if (res?.error) {
    return { error: res.error };
  }

  const transformedData = usedCarPricingDetailDataMapper(
    res?.car_price_avgs,
    locale,
  );
  return {
    meta: transformedData.meta,
    data: transformedData.data,
    pagination: res?.pagination,
  };
}

export async function fetchUsedCarPriceMakeModels({ make, min, max }) {
  const params = new URLSearchParams();

  if (make) {
    params.set('f[type]', 'model');
    params.set('f[make_slug]', make);
  } else {
    params.set('f[type]', 'make');
  }

  if (min) {
    params.set('f[avg_price][gte]', min);
  }
  if (max) {
    params.set('f[avg_price][lte]', max);
  }

  const { response } = await apiClient.get(
    `/api/surge/consumer/used_car_prices/make_model_options?${params.toString()}&f[month][gte]=2`,
  );

  const items =
    response?.map((item) => ({
      ...item,
      image: make
        ? item?.logo
        : item?.logo || `${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`,
      label: make ? `${item?.make?.label} ${item?.label}` : item?.label,
      label_l1: make
        ? `${item?.make?.label_l1} ${item?.label_l1}`
        : item?.label_l1,
      href: make
        ? `${appPaths['usedCarPrices']}/${make}/${item?.slug}`
        : `${appPaths['usedCarPrices']}/${item?.slug}`,
      ...(!configs.USE_BRAND_SPRITE && {
        src: `${IMAGES_BASE_URL}/${item?.slug}/thumbnail.png`,
      }),
    })) ?? [];
  return (
    {
      ...(make && {
        meta: {
          ...items[0]?.make,
          ...(!configs.USE_BRAND_SPRITE && {
            src: `${IMAGES_BASE_URL}/${items[0]?.make?.slug}/thumbnail.png`,
          }),
        },
      }),
      items,
    } ?? {}
  );
}

/**
 * Next keys the fetch data cache on the request URL, not on `next.revalidate`, so
 * every caller of this endpoint shares one entry and inherits whichever TTL wrote
 * it first. The m-web detail page caches for 24h, which silently made the used-car
 * price pages a day stale. `cacheScope` puts a caller on its own cache entry; the
 * backend ignores the extra param.
 */
export async function fetchUsedCarPricesStats({
  make,
  model,
  year,
  locale,
  sortParam = 'month',
  cacheScope,
  fetchOptions = {},
} = {}) {
  const params = buildUsedCarPriceParams({ make, model, year });
  const scope = cacheScope ? `&cache_scope=${cacheScope}` : '';

  const { response } = await apiClient.get(
    `/api/surge/consumer/used_car_prices/stats?sort[${sortParam}]=asc&${params}${scope}`,
    fetchOptions,
  );

  const transformedData = response?.map((item) => ({
    name: formatMonthYear(item.month, locale),
    value: item.avg_price,
  }));

  return transformedData;
}

export async function getCarEvaluation({ make, model, year } = {}) {
  const params = buildUsedCarPriceParams({ make, model, year });
  const res = await apiClient.get(
    `/api/surge/consumer/car_evaluations/get_offer?${params}`,
  );

  return carEvaluationMapper(res?.car_evaluation);
}
