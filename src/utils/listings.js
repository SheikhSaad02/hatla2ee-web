import { getListingTitleByLevel as func } from './general';
import { getLocale } from 'next-intl/server';

export const getListingTitleByLevel = async (obj, level, options = {}) => {
  const locale = await getLocale();
  return func(obj, level, locale, undefined, {
    ...options,
  });
};

export function slotAds(categoryData, categories, page, perPage) {
  const results = [];
  let remainingSlots = perPage;

  for (let { type, perPage: categoryQuota } of categories) {
    const startIndex = (page - 1) * categoryQuota;
    const endIndex = startIndex + categoryQuota;

    const ads = categoryData[type].slice(startIndex, endIndex);

    if (ads.length > 0) {
      results.push(...ads);
      remainingSlots -= ads.length;
    }
  }

  if (remainingSlots > 0) {
    for (let { type } of categories) {
      const allAds = categoryData[type];
      const alreadyUsedCount = results.filter((ad) => ad.type === type).length;
      const remaining = allAds.slice(
        alreadyUsedCount,
        alreadyUsedCount + remainingSlots,
      );
      results.push(...remaining);
      remainingSlots -= remaining.length;
      if (remainingSlots <= 0) break;
    }
  }

  return results;
}

export function extractCtaTrackingItem(item) {
  if (!item) return undefined;
  const breadcrumbs = item?.location?.breadcrumbs || [];
  const safeBreadcrumb = (idx) =>
    breadcrumbs?.[idx]?.title ? { title: breadcrumbs[idx].title } : undefined;

  return {
    condition: { slug: item?.condition?.slug },
    make: { slug: item?.make?.slug },
    model: { slug: item?.model?.slug },
    price: item?.price,
    year: item?.year,
    location: {
      breadcrumbs: [
        safeBreadcrumb(0),
        safeBreadcrumb(1),
        safeBreadcrumb(2),
      ].filter(Boolean),
    },
    transmission: { slug: item?.transmission?.slug },
    fuel_type: { slug: item?.fuel_type?.slug },
    id: item?.listing_id,
  };
}

export function extractFlatCtaTrackingItem(item) {
  if (!item) return undefined;
  const breadcrumbs = item?.location?.breadcrumbs || [];
  return {
    condition: item?.condition?.slug,
    brand: item?.make?.slug,
    model: item?.model?.slug,
    price: item?.price,
    year: item?.year,
    city: breadcrumbs?.[1]?.title,
    neighborhood: breadcrumbs?.[0]?.title,
    body_type: item?.body_type?.slug,
    transmission: item?.transmission?.slug,
    fuel_type: item?.fuel_type?.slug,
    listing_id: item?.listing_id,
    agency_name: item?.agency?.name,
    cc_range: item?.power,
    class: item?.variant?.slug,
    color: item?.exterior_color?.slug,
  };
}

export function extractNewVehicleTrackingItem(item) {
  if (!item) return undefined;
  return {
    make: { slug: item?.make?.slug },
    model: { slug: item?.model?.slug },
    prices: {
      market: {
        min: item?.prices?.market?.min,
        max: item?.prices?.market?.max,
      },
    },
  };
}
