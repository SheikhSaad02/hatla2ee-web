import { getNewVehiclesFiltersData } from '@/apis/new-cars-listings';
import {
  appPaths,
  newVehiclesCategorySlugs,
  vehicleSlugLabel,
} from '@/constants';
import { NewVehiclesListingSEOStrategy } from '@/services/seoStrategy/newVehiclesListingPage';
import { AssembledPageSEOStrategy } from '@/services/seoStrategy/assembledPage';
import { getAsset, getListingTitleByLevel } from '@/utils/general';
import { isNumeric } from '@/utils/general';
import { capitalizeFirstLetter } from '@/utils/general';
import { getCountryObject } from '@/utils/countryValidation';
import { FILTER_CONFIG } from '@/utils/used-cars/listings/prettyParser';
import { getTranslations } from 'next-intl/server';
import { decodeSearchParams } from '@/utils/url';
import { BATTERY_CAPACITY_OPTIONS } from '@/components/evLanding/data';
import { MULTI_VALUE_SEPARATOR } from '@/constants';

export function generateNewCarsListingUrl(filters, operandMode = 'slug') {
  const { page, ...restFilters } = filters;
  const query = {};

  Object.entries(restFilters).forEach(([key, value]) => {
    if (value?.min != null || value?.max != null) {
      if (value.min) query[`${key}Min`] = value.min;
      if (value.max) query[`${key}Max`] = value.max;
    } else if (Array.isArray(value)) {
      const joined = value
        .map((v) => v?.[operandMode] ?? v)
        .filter(Boolean)
        .join(MULTI_VALUE_SEPARATOR);
      if (joined) query[key] = joined;
    } else if (value?.[operandMode]) {
      query[key] = value[operandMode];
    } else if (typeof value === 'string') {
      query[key] = value;
    }
  });

  return query;
}

export const parseUrlSearchParams = (searchParams) => {
  const _searchParams = searchParams;
  const { source, priceMin, priceMax, kmRangeMin, kmRangeMax, ...rest } =
    _searchParams;

  const isSearch = source === 'search';

  if (priceMin != null || priceMax != null) {
    rest.price = {
      ...(priceMin != null && { min: priceMin }),
      ...(priceMax != null && { max: priceMax }),
    };
  }

  // KM Range — same min/max handling as price.
  if (kmRangeMin != null || kmRangeMax != null) {
    rest.kmRange = {
      ...(kmRangeMin != null && { min: kmRangeMin }),
      ...(kmRangeMax != null && { max: kmRangeMax }),
    };
  }

  return { isSearch, queryParams: rest };
};

export const populateFiltersObject = (data, queryParams) => {
  const findItem = (array, value) => {
    /* This function caters selection for slug based urls & legacy id based urls, so it prioritizes
    searching by slug over ids catering both the styles
    */
    if (!value) return null;
    let match = array.find((item) => item.slug === value);
    if (!match && isNumeric(value)) {
      match = array.find((item) => item.id === parseInt(value));
    }
    return match;
  };

  const { makes, models, bodyTypes, fuelTypes, transmissions, sortby } = data;
  const {
    make,
    model,
    body,
    fuel,
    transmission,
    page,
    sortby: _sortby,
    price,
    kmRange,
    batteryCapacity,
  } = queryParams;
  let newFilters = {};
  if (make) {
    newFilters.make = findItem(makes, make);
  }
  if (make && model) {
    newFilters.model = findItem(models, model);
  }
  if (body) {
    newFilters.body = findItem(
      bodyTypes,
      FILTER_CONFIG.BODY_TYPE_ID_TO_SLUG_MAPPING[body] ?? body,
    );
  }
  if (price) {
    newFilters.price = price;
  }
  // KM Range — carried through like price (min/max object).
  if (kmRange) {
    newFilters.kmRange = kmRange;
  }
  // Battery Capacity — resolve slug to a bucket option (mirrors body/fuel).
  if (batteryCapacity) {
    newFilters.batteryCapacity = findItem(
      BATTERY_CAPACITY_OPTIONS,
      batteryCapacity,
    );
  }
  // Fuel is multi-select: split slug_and_slug and resolve each to an option.
  if (fuel && fuelTypes) {
    const resolvedFuel = String(fuel)
      .split(MULTI_VALUE_SEPARATOR)
      .map((slug) => findItem(fuelTypes, slug))
      .filter(Boolean);
    if (resolvedFuel.length) {
      newFilters.fuel = resolvedFuel;
    }
  }
  if (transmission) {
    newFilters.transmission = findItem(transmissions, transmission);
  }
  if (page) {
    newFilters.page = page;
  }
  if (sortby) {
    newFilters.sortby = sortby.find((item) => item.slug === _sortby);
  }
  return newFilters;
};

export const getPagesHrefsForCategorySlug = (categorySlug, type = 'search') => {
  const categoryPaths = {
    [newVehiclesCategorySlugs.newCars]: {
      landing: appPaths['new-car'],
      search: appPaths.newCarsListingsSearch,
    },
    [newVehiclesCategorySlugs.newTrucks]: {
      landing: appPaths['new-trucks'],
      search: appPaths.newTrucksSearch,
    },
    [newVehiclesCategorySlugs.newBus]: {
      landing: appPaths['new-bus'],
      search: appPaths.newBusSearch,
    },
    [newVehiclesCategorySlugs.newMotorcycle]: {
      landing: appPaths['new-motorcycle'],
      search: appPaths.newMotorcycleSearch,
    },
  };

  const paths = categoryPaths[categorySlug];

  if (!paths) {
    return appPaths.newCarsListingsSearch;
  }

  return paths[type] || paths.landing;
};

export const getNewVehiclesLandingMetaData = async ({
  params,
  searchParams,
  categorySlug,
}) => {
  const queryParams = decodeSearchParams(await searchParams);
  const { locale } = await params;

  // Get the actual URL path from headers
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const currentPath =
    headersList.get('x-pathname') || `/${locale}/${categorySlug}`;

  const seoStrategy = new NewVehiclesListingSEOStrategy({
    data: queryParams,
    language: locale,
    isSearch: false,
    isLanding: true,
    categorySlug: categorySlug,
    currentPath: currentPath,
    absoluteTitle: true,
  });

  const [h1, title, description, canonical, languages] = await Promise.all([
    seoStrategy.generateH1(),
    seoStrategy.generateMetaTitle(),
    seoStrategy.generateMetaDescription(),
    seoStrategy.generateCanonical(),
    seoStrategy.generateLanguages(),
  ]);

  return {
    h1,
    title,
    description: description,
    alternates: {
      canonical,
      languages,
    },
  };
};

export async function getNewVehiclesSearchMetaData({
  params,
  searchParams,
  categorySlug,
}) {
  const _searchParams = decodeSearchParams(await searchParams);
  const { queryParams, isSearch } = parseUrlSearchParams(_searchParams);
  const { locale } = await params;

  const filters = await getNewVehiclesFiltersData(
    queryParams,
    categorySlug,
    getShouldfetchVariantLevelAds(isSearch, queryParams),
  );

  // Get the actual URL path from headers
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const currentPath =
    headersList.get('x-pathname') || `/${locale}/${categorySlug}`;

  const seoStrategy = new NewVehiclesListingSEOStrategy({
    language: locale,
    data: filters,
    isSearch: isSearch,
    categorySlug: categorySlug,
    currentPath: currentPath,
    absoluteTitle: true,
  });

  const [h1, title, description, canonical, openGraph, languages] =
    await Promise.all([
      seoStrategy.generateH1(),
      seoStrategy.generateMetaTitle(),
      seoStrategy.generateMetaDescription(),
      seoStrategy.generateCanonical(),
      seoStrategy.generateOpenGraph(),
      seoStrategy.generateLanguages(),
    ]);

  const robotTags = await seoStrategy.generateRobotsTag();

  return {
    h1,
    title: title,
    description: description,
    alternates: {
      canonical,
      languages,
    },
    robots: robotTags,
    openGraph: openGraph,
  };
}

export const getNewCarsListingSectionProps = (item, index, locale) => ({
  key: `variant-${index}`,
  href: `${appPaths['new-car']}/${item?.make?.slug}/${item?.model?.slug}`,
  title: getListingTitleByLevel(
    { ...item, year: item.launch_year },
    'variant',
    locale,
  ),
  count: item?.variantCount,
  price: item?.prices,
  img:
    item?.images?.[0]?.medium || getAsset('/assets/new-car-placeholder.webp'),
});

export function checkFilterConfigDependencies(filterConfig, filterValues, key) {
  const parents = Object.values(filterConfig).filter((f) =>
    (f.dependents || []).includes(key),
  );

  return {
    met: parents.every((p) => !!filterValues[p.key]),
    parents,
  };
}

export const getShouldfetchVariantLevelAds = (isSearch, searchParams) =>
  !!(isSearch || searchParams.price);

export async function generateAssembledMetadata(
  params,
  searchParams,
  categorySlug,
) {
  const { locale, country } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: 'countries' });

  const assembledSEO = new AssembledPageSEOStrategy({
    language: locale,
    country: t(getCountryObject(country).label),
    vehicleType: vehicleSlugLabel[categorySlug],
    category: vehicleSlugLabel[categorySlug],
  });

  const seoData = await assembledSEO.generateSEO(page);

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
  };
}
