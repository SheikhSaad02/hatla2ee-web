import { appPaths } from '@/constants';

/**
 * Decodes URL search params that may contain encoded characters like %26 (&)
 * and re-parses them into a proper params object.
 * Example: { city: '85%26make=12' } → { city: '85', make: '12' }
 */
export const decodeSearchParams = (params) => {
  if (!params || typeof params !== 'object') return {};
  const rawQueryString = new URLSearchParams(params).toString();
  const decodedQueryString = decodeURIComponent(rawQueryString);
  return Object.fromEntries(new URLSearchParams(decodedQueryString));
};

export const convertQueryObjToString = (obj) => {
  if (!obj) return '';
  const keys = Object.keys(obj);
  return keys
    .map((key) =>
      obj[key]
        ? Array.isArray(obj[key])
          ? obj[key].map((item) => `${key}[]=${item}`).join('&')
          : `${key}=${obj[key]}`
        : '',
    )
    .filter((e) => !!e)
    .join('&');
};

export const generateUsedCarDetailUrl = (item) => {
  return `${appPaths.usedCars}/${item?.make?.slug}/${item?.model?.slug}/${item?.listing_id}`;
};

export const generateUsedImportedCarDetailUrl = (item) => {
  return `${appPaths.usedCars}/${item?.make?.slug}/${item?.model?.slug}/${item?.listing_id}`;
};

export const generateNewCarDetailUrl = (item) => {
  const variantId = item?.variant?.id || 'unit';
  return `${appPaths[`new-${item.listing_category.slug}`]}/${
    item?.make?.slug
  }/${item?.model?.slug}/${variantId}/${item?.listing_external_id}`;
};

export const generateNewImportedCarDetailUrl = (item) => {
  return `${appPaths.newImportedCars}/${item?.make?.slug}/${item?.model?.slug}/${item?.listing_id}`;
};
export const generateListingDetailUrl = (item) => {
  const isNew = item?.condition?.slug === 'new';
  const isImported = item?.imported?.slug === 'yes';

  if (!isNew && isImported) {
    return generateUsedImportedCarDetailUrl(item);
  }

  if (isNew && isImported) {
    return generateNewImportedCarDetailUrl(item);
  }

  if (isNew) {
    return generateNewCarDetailUrl(item);
  }

  return generateUsedCarDetailUrl(item);
};
