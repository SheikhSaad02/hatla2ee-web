import { appPaths } from '@/constants';
import {
  extractPriceRange,
  mapFiltersToQuery,
} from '@/utils/used-cars/listings';
import { FILTER_CONFIG } from '@/utils/used-cars/listings/prettyParser';
import { ListingUrlBuilder } from '@/services/urlBuilder/ListingUrlBuilder';

/**
 * Pretty routes: string templates use `f[param].slug`; objects use `route` + optional `config.buildUrl`.
 */
const USED_PRETTY = {
  specialConditions: {
    route: ':tag',
    config: {
      buildUrl(f) {
        const s = f.specialConditions;
        if (!Array.isArray(s) || s.length !== 1 || !s[0]?.slug) return null;
        const slug = s[0].slug;
        const mapped = Object.entries(
          FILTER_CONFIG.SPECIAL_CONDITIONS_KEYS_MAPPING_QUERY_PARAMS,
        ).find(([, v]) => v === slug)?.[0];
        const tag = mapped ?? slug;
        if (!tag) return null;
        if (tag === 'used-car-financed') return null;
        return this.route.replace(/:tag/g, () => tag);
      },
    },
  },
  fuel: ':fuel',
  transmission: ':transmission',
  cc: 'cc/:cc',
  'city|make|model': 'city/:city/:make/:model',
  'body|city': 'city/:city/body/:body',
  'city|make': 'city/:city/:make',
  city: 'city/:city',
  body: 'body/:body',
  'make|model|variant|year': {
    route: ':make/:model/teraz/:id',
    config: {
      buildUrl(f) {
        if (
          f.year?.min == null ||
          f.year?.max == null ||
          f.year.min !== f.year.max
        ) {
          return null;
        }
        const make = f.make?.slug;
        const model = f.model?.slug;
        const id = f.variant?.id;
        if (!make || !model || id == null || id === '') return null;
        return this.route
          .replace(/:make/g, () => make)
          .replace(/:model/g, () => model)
          .replace(/:id/g, () => String(id));
      },
    },
  },
  'make|model|year': {
    route: ':make/:model/year/:year',
    config: {
      buildUrl(f) {
        if (
          f.year?.min == null ||
          f.year?.max == null ||
          f.year.min !== f.year.max
        )
          return null;
        const make = f.make?.slug;
        const model = f.model?.slug;
        const year = f.year.min;
        if (!make || !model || !year) return null;
        return this.route
          .replace(/:make/g, () => make)
          .replace(/:model/g, () => model)
          .replace(/:year/g, () => year);
      },
    },
  },
  'make|model': ':make/:model',
  price: {
    route: 'price-limit/:price',
    config: {
      buildUrl(f) {
        const min = Number(f.price?.min);
        const max = Number(f.price?.max);
        if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
        const e = extractPriceRange(String(max));
        if (Number(e.min) !== min || Number(e.max) !== max) return null;
        return this.route.replace(/:price/g, () => String(max));
      },
    },
  },
  'body|make': ':make/body/:body',
  'fuel|make': ':make/:fuel',
  'make|transmission': ':make/:transmission',
  'make|year': {
    route: ':make/year/:year',
    config: {
      buildUrl(f) {
        if (f.model) return null;
        if (
          f.year?.min == null ||
          f.year?.max == null ||
          f.year.min !== f.year.max
        ) {
          return null;
        }
        const make = f.make?.slug;
        const year = String(f.year.min);
        if (!make || !year) return null;
        return this.route
          .replace(/:make/g, () => make)
          .replace(/:year/g, () => year);
      },
    },
  },
  make: ':make',
};

class UsedCarListingUrlBuilder extends ListingUrlBuilder {
  constructor() {
    super({
      basePath: appPaths.usedCars,
      searchPath: appPaths.usedCarsListingsSearch,
    });
  }

  mapToQuery(f) {
    return mapFiltersToQuery(f);
  }

  normalize(f) {
    const out = { ...f };
    Object.keys(out).forEach((k) => {
      if (
        k !== 'specialConditions' &&
        Array.isArray(out[k]) &&
        out[k].length === 1
      ) {
        out[k] = out[k][0];
      }
    });
    if (out.priceMin != null || out.priceMax != null) {
      out.price = {
        min: out.priceMin ?? undefined,
        max: out.priceMax ?? undefined,
      };
    }
    if ((out.dateMin != null || out.dateMax != null) && !out.year) {
      out.year = { min: out.dateMin, max: out.dateMax };
    }
    return out;
  }

  activeKeyString(f) {
    const skip = new Set([
      'page',
      'sortby',
      'priceMin',
      'priceMax',
      'dateMin',
      'dateMax',
    ]);
    const keys = Object.keys(f).filter((k) => {
      if (skip.has(k)) return false;
      const v = f[k];
      if (v == null || v === '') return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    });
    return keys.length ? [...keys].sort().join('|') : '';
  }

  get prettyRegistry() {
    return USED_PRETTY;
  }
}

const usedCarListingUrlBuilderInstance = new UsedCarListingUrlBuilder();

export function buildUsedCarListingUrl(filters = {}) {
  return usedCarListingUrlBuilderInstance.buildUrl(filters);
}

export const usedCarListingUrlBuilder = { buildUrl: buildUsedCarListingUrl };
