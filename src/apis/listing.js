import { mapCarAdDetails } from '@/mappers/listings';
import { appPaths } from '@/constants';
import { apiClient } from '@/services/network/api-client';
import { buildNewCarPriceParams } from '@/utils/apiUtils';
import { mapReviewDetail } from '@/mappers/reviews';
import { getLocaleString } from '@/utils/general';

const mapNewCarGenerationsPriceData = (listings, vehicle) => {
  return listings?.map(
    ({ make, model, new_listing_images, shape, all_variants = [] }) => {
      // Build model slug with shape if it exists
      let modelSlug = model.slug;
      if (shape?.slug) {
        modelSlug = `${model.slug}-shape-${shape.slug}`;
      }

      return {
        title: `${make?.label} ${model.label}`,
        title_l1: `${make?.label_l1} ${model.label_l1}`,
        href: `${appPaths[`new-${vehicle}`]}/${make?.slug}/${modelSlug}`,
        hrefTitle: `${make?.label} ${model.label}`,
        make,
        model,
        shape,
        modelImage: new_listing_images?.[0]?.sizes?.medium,
        variantsTableData: all_variants.map((variant) => {
          return {
            overview: {
              title: `${variant?.make?.label} ${variant?.model?.label} ${variant?.variant?.label} ${variant?.launch_year}`,
              title_l1: `${variant?.make?.label_l1} ${variant?.model?.label_l1} ${variant?.variant?.label_l1} ${variant?.launch_year}`,
              features: [
                ...(variant?.power?.value
                  ? [{ label: variant?.power?.value, slug: 'power' }]
                  : []),
              ].filter(Boolean),
              href: `${appPaths[`new-${vehicle}`]}/${variant.make.slug}/${
                variant.model.slug
              }/${variant?.variant?.id}`,
            },
            officialPrice: variant.price ?? variant.official_price,
            marketPrice: {
              min: variant.price_ranges?.min_market_price,
              max: variant.price_ranges?.max_market_price,
            },
          };
        }),
      };
    },
  );
};

export async function fetchListingDetail(listingID, condition = 'used') {
  const response = await apiClient.get(
    `/api/surge/consumer/listings/${listingID}?condition=${condition}`,
  );
  return response?.error
    ? response
    : mapCarAdDetails(response?.listings, 'detail');
}

export async function fetchNewListingPricesMakeLevelDetail({
  makeSlug,
  vehicle = 'car',
  locale,
}) {
  const current_year = new Date().getFullYear();
  const year_min = current_year - 1;
  const year_max = current_year + 1;

  const queryParams = buildNewCarPriceParams({
    make: makeSlug,
    vehicle,
    limit: 100,
  });

  const res = await apiClient.get(
    `/api/surge/consumer/new_listings/listings_by_make?` +
      `&f[group_by]=model_shape_slug` +
      `&sort[price]=asc` +
      `&f[imported.slug]=no` +
      `&${queryParams}`,
  );

  const listings = mapNewCarGenerationsPriceData(res?.listings, vehicle) || [];
  const localizedListings = await Promise.all(
    listings.map(async (item) => {
      const [title, makeLabel, modelLabel, shapeLabel] = await Promise.all([
        getLocaleString(item, 'title', locale),
        getLocaleString(item?.make, 'label', locale),
        getLocaleString(item?.model, 'label', locale),
        getLocaleString(item?.shape, 'label', locale),
      ]);

      return {
        ...item,
        title,
        makeModelLabel: `${makeLabel} ${modelLabel}${
          shapeLabel ? ` ${shapeLabel}` : ''
        }`,
      };
    }),
  );

  return {
    meta: {
      ...listings[0]?.make,
      label: await getLocaleString(listings[0]?.make, 'label', locale),
    },
    listings: localizedListings,
  };
}

export async function fetchUsedCarPriceRange({ model, modelYear }) {
  const res = await apiClient.get(
    `/api/surge/consumer/used_car_prices/?f[model_slug]=${model}&f[model_year]=${modelYear}}`,
  );
  if (!res?.car_price_avgs?.length) {
    return null;
  }
  const transformedData = {
    minPrice: res?.car_price_avgs?.[0]?.min_price,
    maxPrice: res?.car_price_avgs?.[0]?.max_price,
    avgPrice: res?.car_price_avgs?.[0]?.avg_price,
  };

  return transformedData;
}

export async function fetchReviews(makeSlug, modelSlug, modelYear) {
  let url = `/api/surge/consumer/reviews/?f[make_slug]=${makeSlug}&f[model_slug]=${modelSlug}`;

  // Add model year filter if modelYear is provided
  if (modelYear) {
    url += `&f[year]=${modelYear}`;
  }

  const res = await apiClient.get(url);

  if (!res?.reviews?.length) {
    return null;
  }

  const result = mapReviewDetail(res?.reviews?.[0]);
  return result;
}

export async function fetchListingComparison(
  makeSlug,
  modelSlug,
  page = 1,
  per_page = 10,
) {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('per_page', per_page);

  if (makeSlug) {
    params.append('f[make_slug]', makeSlug);
  }

  if (modelSlug) {
    params.append('f[model_slug]', modelSlug);
  }

  const res = await apiClient.get(
    `/api/surge/consumer/comparisons?${params.toString()}`,
  );

  if (!res?.comparison?.length) {
    return {
      data: null,
      pagination: null,
    };
  }

  return {
    data: res?.comparison,
    pagination: res?.pagination,
  };
}
