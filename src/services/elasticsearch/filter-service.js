import tenantData from '@tenantData';
import client from './client';

export class FiltersService {
  static filterRequestedFacets(activeFilters, requestedFacets) {
    //make it generic
    return requestedFacets.filter((facet) => {
      if (facet === 'model' && !activeFilters.make) return false;
      if (facet === 'variant' && (!activeFilters.make || !activeFilters.model))
        return false;
      return true;
    });
  }

  static async getFiltersWithCounts(
    activeFilters = {},
    _requestedFacets,
    filtersConfig,
    apiOptions = {},
  ) {
    const requestedFacets = _requestedFacets || Object.keys(filtersConfig);
    const validFacets = this.filterRequestedFacets(
      activeFilters,
      requestedFacets,
    );
    const citiesToOmit = tenantData?.usedListingsFilterData?.citiesToOmit;

    // Build must filters using FILTERS_AGG_CONFIG field mappings
    const mustFilters = [];
    for (const [filterKey, filterValue] of Object.entries(
      activeFilters || {},
    )) {
      if (filterValue == null || filterValue === '') continue;

      const cfg = filtersConfig[filterKey];
      const field = cfg?.field ?? `${filterKey}.slug`;
      // Use cfg.value if provided, otherwise use filterValue
      const finalValue = cfg?.value ?? filterValue;

      // If customFilters exists, use it
      if (cfg?.customFilters) {
        const additional = cfg.customFilters(activeFilters);
        if (additional) mustFilters.push(additional);
        continue;
      }

      if (filterKey === 'location' && activeFilters.location) {
        const { id, level } = activeFilters.location;
        const locationQuery = this.buildLocationMustQuery(id, level);
        if (locationQuery) mustFilters.push(locationQuery);
        continue;
      }

      // Range-like object e.g. { min, max }
      if (
        typeof filterValue === 'object' &&
        (filterValue.min != null || filterValue.max != null)
      ) {
        const rangeBody = {};
        if (filterValue.min != null) rangeBody.gte = filterValue.min;
        if (filterValue.max != null) rangeBody.lte = filterValue.max;
        mustFilters.push({ range: { [field]: rangeBody } });
        continue;
      }

      if (Array.isArray(filterValue) && filterValue.length > 0) {
        mustFilters.push({ terms: { [field]: finalValue } });
        continue;
      }

      if (
        typeof finalValue === 'boolean' ||
        finalValue === 'yes' ||
        finalValue === 'no'
      ) {
        mustFilters.push({ term: { [field]: finalValue } });
        continue;
      }

      if (typeof filterValue === 'object' && finalValue.slug != null) {
        mustFilters.push({ term: { [field]: finalValue.slug } });
        continue;
      }

      // scalar -> term
      mustFilters.push({ term: { [field]: finalValue } });
    }

    // 3️⃣ Build must_not filters
    const mustNotFilters = [];
    if (citiesToOmit && Array.isArray(citiesToOmit)) {
      citiesToOmit.forEach((city) => {
        mustNotFilters.push({ term: { 'location.id': city.id } });
      });
    }

    // Build aggregations for requested facets
    const aggs = {};
    const facetToConfigMap = {};
    validFacets.forEach((facet) => {
      const cfg = filtersConfig[facet];
      if (!cfg?.field) return;
      const baseField = cfg.key;
      facetToConfigMap[facet] = { facet, config: cfg };

      if (cfg.customQuery) {
        Object.assign(aggs, cfg.customQuery(activeFilters).aggs);
      } else {
        aggs[facet] = {
          terms: {
            field: cfg.field,
            size: cfg.size ?? 100,
            order: { _count: 'desc' },
          },
          aggs: {
            sample: {
              top_hits: {
                size: 1,
                _source: cfg.source || [
                  `${baseField}.id`,
                  `${baseField}.slug`,
                  `${baseField}.label`,
                  `${baseField}.label_l1`,
                ],
              },
            },
          },
        };
      }
    });

    const body = {
      size: 0,
      query: {
        bool: {
          ...(mustFilters.length ? { must: mustFilters } : {}),
          // ...(mustNotFilters.length ? { must_not: mustNotFilters } : {}),
        },
      },
      aggs,
    };

    const response = await client.searchAds({ body, options: apiOptions });
    if (!response || response.error || !response.aggregations) return {};

    // Map aggregations
    const result = {};
    for (const [facet, cfgData] of Object.entries(facetToConfigMap)) {
      const cfg = cfgData.config;

      if (cfg.customMapper) {
        // Use custom mapper for this facet
        result[facet] = await cfg.customMapper(response.aggregations);
      } else {
        const buckets = response.aggregations[facet]?.buckets ?? [];
        let mappedResults = buckets.map((bucket) => {
          const base = {
            id: bucket.key,
            count: bucket.doc_count,
            slug: bucket.key,
            label: `${bucket.key}`,
            label_l1: `${bucket.key}`,
          };
          const sampleHitSource = bucket.sample?.hits?.hits?.[0]?._source;
          if (!sampleHitSource) return base;

          const firstKey = Object.keys(sampleHitSource)[0];
          const entity = sampleHitSource[firstKey];
          const transformedEntity = cfg.transform
            ? cfg.transform(entity ?? bucket.key)
            : entity;

          return { ...base, ...(transformedEntity || {}) };
        });

        mappedResults = mappedResults.sort((a, b) => b.count - a.count);
        result[facet] = mappedResults;
      }
    }

    return result;
  }

  static buildLocationMustQuery(id, level) {
    if (!id || level == null) return null;

    const locFields = [];
    for (let i = level; i <= 4; i++) {
      locFields.push(`location.loc_${i}`);
    }

    return {
      bool: {
        should: locFields.map((field) => ({
          term: { [field]: id },
        })),
        minimum_should_match: 1,
      },
    };
  }
}
