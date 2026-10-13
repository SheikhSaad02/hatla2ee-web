import {
  generateNewCarsListingUrl,
  getPagesHrefsForCategorySlug,
} from '@/utils/new-cars/listings';
import { ListingUrlBuilder } from '@/services/urlBuilder/ListingUrlBuilder';

/**
 * Pretty routes for new-vehicle listings — only filter combinations whose pretty
 * URL is a `next.config.mjs` rewrite *to the search page* (i.e. an equivalent of
 * the faceted results). Everything else falls back to the faceted `search?…` URL.
 *
 * make + model is intentionally excluded: `/:make/:model` is a separate model
 * landing page, not a rewrite to search, so it is NOT an equivalent and stays
 * faceted.
 *
 *   make        → /:make               (rewrites to ?make=:make)
 *   body        → /body/:body          (rewrites to ?body=:body)
 *   price (max) → /price-limit/:price  (rewrites to ?priceMax=:price)
 */
const NEW_VEHICLE_PRETTY = {
  make: ':make',
  body: 'body/:body',
  price: {
    route: 'price-limit/:price',
    config: {
      buildUrl(f) {
        const max = f.price?.max;
        if (f.price?.min || max == null || max === '') return null;
        return this.route.replace(/:price/g, () => String(max));
      },
    },
  },
};

class NewCarListingUrlBuilder extends ListingUrlBuilder {
  constructor(categorySlug) {
    super({
      basePath: getPagesHrefsForCategorySlug(categorySlug, 'landing'),
      searchPath: getPagesHrefsForCategorySlug(categorySlug, 'search'),
    });
  }

  mapToQuery(f) {
    return generateNewCarsListingUrl(f);
  }

  activeKeyString(f) {
    const skip = new Set(['page', 'sortby']);
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
    return NEW_VEHICLE_PRETTY;
  }
}

// One stateless builder per category, reused across calls (buildUrl only reads
// config; filters are passed per call).
const newCarListingUrlBuilders = {};

export function buildNewVehicleListingUrl(filters = {}, categorySlug) {
  let builder = newCarListingUrlBuilders[categorySlug];
  if (!builder) {
    builder = new NewCarListingUrlBuilder(categorySlug);
    newCarListingUrlBuilders[categorySlug] = builder;
  }

  return builder.buildUrl(filters);
}
