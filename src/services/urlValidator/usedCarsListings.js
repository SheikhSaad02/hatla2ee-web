import { appPaths } from '@/constants';
import configs from '@/configs';
import { populateFilters } from '@/utils/used-cars/listings/parsingLayer';
import {
  decideMakeModelCorrection,
  MAKE_MODEL_OUTCOMES,
  MAKE_MODEL_SHAPES,
} from '@/utils/used-cars/listings/makeModelCorrection';
import {
  FILTER_CONFIG,
  parseUsedCarsListingsUrl,
} from '@/utils/used-cars/listings/prettyParser';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

/*
| Route                                                                 | If slug/route is misspelled                                     | If no data exists for valid URL                  |
|----------------------------------------------------------------------|----------------------------------------------------------------|--------------------------------------------------|
| `/:sf_culture/car`                                                   | No 404; no redirect                                            | Empty                                            |
| `/:sf_culture/car/search?...`                                        | No 404; no redirect                                            | Empty                                            |
| `/:sf_culture/car/city/:city_slug`                                   | 404 (`sfDoctrineRoute`)                                        | Empty + noindex                                  |
| `/:sf_culture/car/:brand_slug`                                       | 404 (`sfDoctrineRoute`)                                        | Empty + noindex                                  |
| `/:sf_culture/car/:brand_slug/:model_slug`                           | Typically redirect to `@car` (caught)                         | Empty + noindex                                  |
| NIMP: `/:sf_culture/car/:brand_slug/:model_slug/year/:year`                | Redirect to `@car` (301)                                       | Empty; if year not indexable → noindex           |
| `/:sf_culture/car/:brand_slug/:model_slug/teraz/:id`                 | Redirect to `@car`                                             | Empty; if not indexable → noindex                |
| `/:sf_culture/car/body/:body`                                        | Redirect to `@car` (invalid body)                             | Empty                                            |
| `/:sf_culture/car/city/:city/body/:body`                             | Both missing → `@car`; one missing → redirect to the other     | Empty + noindex                                  |
| `/:sf_culture/car/city/:city_slug/:brand_slug`                       | If city invalid → 301 to brand; may 404 if still invalid       | Empty + noindex (<2)                             |
| `/:sf_culture/car/city/:city_slug/:brand_slug/:model_slug`           | If city invalid → 301 to brand → `forward404Unless(city)` → 404 | Empty + noindex (<2)                             |
| `/:sf_culture/car/price-limit/:price`                                | No 404; no redirect                                            | Empty                                            |
| `/:sf_culture/car/cc/:cc`                                            | Redirect to `@homepage` (invalid cc)                          | Empty                                            |
| Specials:<br>`/kasr-zero`, `/taxi`, `/disabled`, `/hybrid`, `/classic`, `/electric`, `/used-car-financed`, `/used-car-pre-existing-installement` | No 404 (routed to `carSpecial`); no redirect | Empty |
*/

//Note: This does not handle page validation currently - tbd

const basePath = appPaths.usedCars;
export class UsedCarListingUrlValidatorService {
  SPECIAL_ROUTES = [
    ...FILTER_CONFIG.FIXED_TAGS,
    ...FILTER_CONFIG.FUEL_TAGS,
    ...FILTER_CONFIG.TRANSMISSION_TAGS,
  ];

  ROUTE_HANDLERS = {
    // Specials: always valid
    ...Object.fromEntries(this.SPECIAL_ROUTES.map((r) => [r, () => true])),

    'page/:page': (filters) => this.validatePage(filters),

    'city/:city': (filters) => this.validateCity(filters),
    'city/:city/body/:body': (filters) => this.validateCityBody(filters),
    'city/:city/:make': (filters) => this.validateCityMake(filters),
    'city/:city/:make/:model': (filters) => this.validateCityMakeModel(filters),

    'body/:body': (filters) => this.validateBody(filters),
    'cc/:cc': (filters) => this.validateCC(filters),
    'price-limit/:price': () => true, // always valid

    ':make': (filters) => this.validateMake(filters),
    ':make/:second': (filters, parsed, context) =>
      this.validateMakeSecond(filters, parsed, context),
    ':make/body/:body': (filters) => this.validateMakeBody(filters),
    ':make/year/:year': (filters) => this.validateMakeYear(filters),
    ':make/:model/year/:year': (filters, parsed, context) =>
      this.validateMakeModelYear(filters, parsed, context),
    ':make/:model/teraz/:id': (filters) => this.validateVariant(filters),
  };

  matchRoutePattern(slugParts) {
    for (const [pattern] of Object.entries(this.ROUTE_HANDLERS)) {
      if (this.matchesPattern(slugParts, pattern.split('/'))) {
        return pattern;
      }
    }
    return null;
  }

  matchesPattern(slugParts, patternParts) {
    if (slugParts.length !== patternParts.length) return false;
    return patternParts.every(
      (p, i) => p.startsWith(':') || p === slugParts[i],
    );
  }

  normalizeSlugParts(slugParts) {
    const pageIndex = slugParts.findIndex((part) => part === 'page');
    if (pageIndex !== -1) {
      if (slugParts.length === 2 && pageIndex === 0) {
        return slugParts;
      }
      return slugParts.slice(0, pageIndex);
    }
    return slugParts;
  }

  async validateUrl(slugParts = [], queryParams = {}, locale) {
    const normalizedParts = this.normalizeSlugParts(slugParts);
    const pattern = this.matchRoutePattern(normalizedParts);

    if (!pattern) notFound();

    const parsed = parseUsedCarsListingsUrl(slugParts, queryParams);
    const updatedFilters = await populateFilters(parsed);

    const handler = this.ROUTE_HANDLERS[pattern];
    const result = await handler(updatedFilters, parsed, { locale, slugParts });

    // Handle redirects first
    if (typeof result === 'string') {
      redirect(`/${locale}${result}`);
    }

    // Then valid routes
    if (result) return { updatedFilters };

    // Otherwise → 404
    notFound();
  }

  // --------------------
  // Validators (return: true | false | string for redirect)
  // --------------------

  validatePage({ page }) {
    const isValidPage = !!parseInt(page);
    return isValidPage ? isValidPage : appPaths.usedCarsListingsSearch;
  }

  validateCity({ city }) {
    return !!city;
  }

  validateCityBody({ city, body }) {
    if (!city && !body) return basePath;
    if (!city && body) return `${basePath}/body/${body.slug}`;
    if (city && !body) return `${basePath}/city/${city.slug}`;
    return true;
  }

  validateCityMake({ city, make }) {
    if (!city) return make ? `${basePath}/${make.slug}` : false;
    return !!make;
  }

  validateCityMakeModel({ city, make, model }) {
    if (!city) return make ? `${basePath}/${make.slug}` : false;
    if (!make || !model) return false;
    return true;
  }

  validateMake({ make }) {
    return !!make;
  }

  async validateMakeSecond(filters, parsed = {}, context = {}) {
    const { make, model, fuel, transmission } = filters;
    const currentBehaviour =
      !make || (!model && !fuel && !transmission) ? basePath : true;

    if (this.isRecognisedSecondSegment(filters, parsed)) return currentBehaviour;
    if (!configs.ENABLE_FACET_CASCADE_REDIRECT) return currentBehaviour;

    const slugParts = context.slugParts || [];
    // Only a numeric page segment is a page suffix worth rebuilding; anything
    // else is junk and is dropped rather than carried into the redirect target.
    const pageSegment = slugParts[2] === 'page' ? slugParts[3] : undefined;
    const isPagedShape = /^\d+$/.test(pageSegment || '');

    return this.resolveMakeModelCorrection({
      filters,
      parsed,
      locale: context.locale,
      currentBehaviour,
      shape: isPagedShape
        ? MAKE_MODEL_SHAPES.MAKE_MODEL_PAGE
        : MAKE_MODEL_SHAPES.MAKE_MODEL,
      page: isPagedShape ? pageSegment : undefined,
    });
  }

  async validateMakeModelYear(filters, parsed = {}, context = {}) {
    const { make, model } = filters;
    const currentBehaviour = !make || !model ? basePath : true; // year currently not handled

    if (this.isRecognisedSecondSegment(filters, parsed)) return currentBehaviour;
    if (!configs.ENABLE_FACET_CASCADE_REDIRECT) return currentBehaviour;

    return this.resolveMakeModelCorrection({
      filters,
      parsed,
      locale: context.locale,
      currentBehaviour,
      shape: MAKE_MODEL_SHAPES.MAKE_MODEL_YEAR,
      year: (context.slugParts || [])[3],
    });
  }

  /**
   * A second segment that resolved to a filter, or is a tag/shape slug, is not
   * a correctable make/model typo — it keeps today's redirect or 200.
   *
   * specialConditions is read from the raw parse as well as the resolved
   * filters: a FIXED_TAG that the tenant's filter data does not carry (e.g.
   * used-car-pre-existing-installement) parses as a tag but resolves to
   * nothing, and must still keep today's redirect.
   */
  isRecognisedSecondSegment(
    { model, fuel, transmission, specialConditions },
    parsed,
  ) {
    return (
      !!model ||
      !!fuel ||
      !!transmission ||
      !!specialConditions?.length ||
      !!parsed?.specialConditions?.length ||
      !!parsed?.model?.includes('-shape-')
    );
  }

  /**
   * EG only. Maps the shared make/model typo-correction decision onto this
   * service's return protocol: a resolvable-but-mis-formatted slug is 308'd to
   * the corrected URL, and anything we cannot correct keeps today's behaviour
   * (never a 404).
   */
  async resolveMakeModelCorrection({
    filters,
    parsed,
    locale,
    currentBehaviour,
    shape,
    year,
    page,
  }) {
    const { outcome, path } = await decideMakeModelCorrection({
      make: parsed.make,
      model: parsed.model,
      resolvedMake: filters?.make,
      locale,
      shape,
      year,
      page,
    });

    if (outcome === MAKE_MODEL_OUTCOMES.REDIRECT) permanentRedirect(path);

    return currentBehaviour;
  }

  validateVariant({ make, model, variant }) {
    return make && model && variant ? true : basePath;
  }

  validateBody({ body }) {
    return body ? true : basePath;
  }

  validateCC({ cc }) {
    return cc ? true : '/';
  }
  validateMakeBody({ make, body }) {
    if (!make) return basePath;
    if (!body) return `${basePath}/${make.slug}`;
    return true;
  }
  validateMakeYear({ make, year }) {
    if (!make) return basePath;
    if (!year?.min && !year?.max) return `${basePath}/${make.slug}`;
    return true;
  }

}

export const usedCarUrlValidator = new UsedCarListingUrlValidatorService();
