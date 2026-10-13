import { appPaths } from '@/constants';
import { MakesService } from '@/services/elasticsearch/makes-service';
import { ModelsService } from '@/services/elasticsearch/models-service';

export const MAKE_MODEL_SHAPES = {
  MAKE_MODEL: 'makeModel',
  MAKE_MODEL_YEAR: 'makeModelYear',
  MAKE_MODEL_PAGE: 'makeModelPage',
  USED_PRICES: 'usedPrices',
};

export const RESOLUTION_STATUS = {
  MATCHED: 'matched',
  INVALID: 'invalid',
  INDETERMINATE: 'indeterminate',
};

export const MAKE_MODEL_OUTCOMES = {
  KEEP_CURRENT: 'keepCurrent',
  REDIRECT: 'redirect',
};

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeSlug(value) {
  if (typeof value !== 'string') return '';
  return safeDecode(value).trim().toLowerCase().replace(/\s+/g, '-');
}

/**
 * Re-resolves raw URL segments against makes/models on a normalized form, so a
 * casing, encoding or spacing difference (e.g. `500c` vs `500C`, `1 .1` vs
 * `1.1`) can be corrected to the canonical slug.
 *
 * INDETERMINATE means the data could not be read — getAllMakes /
 * getAllModelsForMake return [] on API failure, which is indistinguishable from
 * "nothing exists". Callers fall back to today's behaviour on it so a transient
 * Elasticsearch blip never rewrites a valid URL.
 */
export async function resolveWithNormalisation({ make, model, resolvedMake }) {
  const makeSlug = await resolveMakeSlug({ make, resolvedMake });
  if (makeSlug.status !== RESOLUTION_STATUS.MATCHED) return makeSlug;

  // A second segment that normalizes away to nothing resolves to no model, so
  // it is invalid rather than a make-only match. The resolved make is carried
  // through so an invalid model can fall back to its make page.
  const normalizedModel = normalizeSlug(model);
  if (!normalizedModel) {
    return { status: RESOLUTION_STATUS.INVALID, make: makeSlug.make };
  }

  const models = await ModelsService.getAllModelsForMake(makeSlug.make);
  if (!Array.isArray(models) || !models.length) {
    return { status: RESOLUTION_STATUS.INDETERMINATE };
  }

  const matchedModel = models.find(
    (item) => normalizeSlug(item?.slug) === normalizedModel,
  );
  if (!matchedModel) {
    return { status: RESOLUTION_STATUS.INVALID, make: makeSlug.make };
  }

  return {
    status: RESOLUTION_STATUS.MATCHED,
    make: makeSlug.make,
    model: matchedModel.slug,
  };
}

/**
 * Prefers the make populateFilters already resolved — it matches on id as well
 * as slug (matchOne), so a numeric-id make URL keeps working and we skip a
 * redundant getAllMakes round trip. Only falls back to a slug lookup when the
 * make did not resolve at all.
 */
async function resolveMakeSlug({ make, resolvedMake }) {
  if (resolvedMake?.slug) {
    return { status: RESOLUTION_STATUS.MATCHED, make: resolvedMake.slug };
  }

  const normalizedMake = normalizeSlug(make);
  if (!normalizedMake) return { status: RESOLUTION_STATUS.INVALID };

  const makes = await MakesService.getAllMakes();
  if (!Array.isArray(makes) || !makes.length) {
    return { status: RESOLUTION_STATUS.INDETERMINATE };
  }

  const matchedMake = makes.find(
    (item) => normalizeSlug(item?.slug) === normalizedMake,
  );
  if (!matchedMake) return { status: RESOLUTION_STATUS.INVALID };

  return { status: RESOLUTION_STATUS.MATCHED, make: matchedMake.slug };
}

/**
 * The single make/model typo-correction decision, shared by the search routes
 * and the used-prices route so the two can never drift:
 *   KEEP_CURRENT — data unreadable, nothing to correct, or the slug is not a
 *                  correctable typo. Today's behaviour stands (no 404).
 *   REDIRECT     — a mis-formatted but resolvable make/model, 308 to `path`.
 *
 * This deliberately never 404s: an unresolvable make/model keeps today's
 * behaviour rather than being treated as not-found.
 */
export async function decideMakeModelCorrection({
  make,
  model,
  resolvedMake,
  locale,
  shape,
  year,
  page,
}) {
  const resolution = await resolveWithNormalisation({
    make,
    model,
    resolvedMake,
  });

  // Unreadable data → leave today's behaviour untouched, never redirect on a
  // transient blip.
  if (resolution.status === RESOLUTION_STATUS.INDETERMINATE) {
    return { outcome: MAKE_MODEL_OUTCOMES.KEEP_CURRENT };
  }
  // Valid make but the model does not resolve → fall back to the make page
  // rather than keeping today's /car redirect. An invalid make itself carries
  // no resolved make and keeps today's behaviour.
  if (resolution.status === RESOLUTION_STATUS.INVALID) {
    if (!resolution.make) return { outcome: MAKE_MODEL_OUTCOMES.KEEP_CURRENT };
    return {
      outcome: MAKE_MODEL_OUTCOMES.REDIRECT,
      path: buildMakePath({ locale, shape, make: resolution.make }),
    };
  }
  // Redirecting to the slugs we already have would loop. Route params arrive
  // URL-encoded (`MG+One` as `MG%2BOne`), so compare on the decoded form.
  if (
    resolution.make === safeDecode(make) &&
    resolution.model === safeDecode(model)
  ) {
    return { outcome: MAKE_MODEL_OUTCOMES.KEEP_CURRENT };
  }

  return {
    outcome: MAKE_MODEL_OUTCOMES.REDIRECT,
    path: buildCorrectedPath({
      locale,
      shape,
      make: resolution.make,
      model: resolution.model,
      year,
      page,
    }),
  };
}

export function buildMakePath({ locale, shape, make }) {
  const base = `/${locale}${appPaths.usedCars}`;
  return shape === MAKE_MODEL_SHAPES.USED_PRICES
    ? `${base}/used-prices/${make}`
    : `${base}/${make}`;
}

export function buildCorrectedPath({ locale, shape, make, model, year, page }) {
  const base = `/${locale}${appPaths.usedCars}`;

  switch (shape) {
    case MAKE_MODEL_SHAPES.MAKE_MODEL_YEAR:
      return `${base}/${make}/${model}/year/${year}`;
    case MAKE_MODEL_SHAPES.MAKE_MODEL_PAGE:
      return `${base}/${make}/${model}/page/${page}`;
    case MAKE_MODEL_SHAPES.USED_PRICES:
      return `${base}/used-prices/${make}/${model}/${year}`;
    default:
      return `${base}/${make}/${model}`;
  }
}
