import { mapCarAdDetails, orderAdsByIds } from '@/mappers/listings';

import { apiCacheConfig } from '@/configs/cacheConfig';
import { extractBuckets } from '@/utils/used-cars/listings';
import { FILTER_CONFIG } from '@/utils/used-cars/listings/prettyParser';
import client from './client';
import { FILTERS_AGG_CONFIG } from '@/filters/filterConfig';
import { FiltersService } from './filter-service';
import filterData from '@data';
import { LocationsService } from './location-service';
import { cacheBySerializedKey } from '@/utils/cacheBySerializedKey';

export class ListingsService {
  static buildUsedCarsListingsMustQueries(filters = {}) {
    const mustQueries = [];

    const buildFacetClause = (field, value) => {
      if (Array.isArray(value)) {
        const slugs = value.map((v) => v?.slug).filter(Boolean);
        return slugs.length ? { terms: { [field]: slugs } } : null;
      }
      return value?.slug ? { term: { [field]: value.slug } } : null;
    };

    if (filters.make?.slug) {
      mustQueries.push({ term: { 'make.slug': filters.make.slug } });
    }
    if (filters.model?.slug) {
      mustQueries.push({ term: { 'model.slug': filters.model.slug } });
    }
    if (filters.variant?.slug) {
      mustQueries.push({ term: { 'variant.slug': filters.variant.slug } });
    }
    if (filters.city?.slug) {
      const locationClauses = this.buildLocationMustFilters(filters.city);
      if (locationClauses.length) {
        mustQueries.push(...locationClauses);
      }
    }

    const colorClause = buildFacetClause('exterior_color.slug', filters.color);
    if (colorClause) mustQueries.push(colorClause);
    if (filters?.mileage) {
      mustQueries.push({
        range: {
          km: {
            lte: Number(filters.mileage.max),
            gte: Number(filters.mileage.min),
          },
        },
      });
    }
    if (filters?.price) {
      mustQueries.push({
        range: {
          price: {
            ...(filters.price.max && { lte: Number(filters.price.max) }),
            ...(filters.price.min && { gte: Number(filters.price.min) }),
          },
        },
      });
    }

    if (filters?.year) {
      mustQueries.push({
        range: {
          year: {
            ...(filters.year.min && { gte: Number(filters.year.min) }),
            ...(filters.year.max && { lte: Number(filters.year.max) }),
          },
        },
      });
    }

    const bodyClause = buildFacetClause('body_type.slug', filters.body);
    if (bodyClause) mustQueries.push(bodyClause);

    if (filters.cc) {
      mustQueries.push({ term: { power: Number(filters.cc.slug) } });
    }

    const transmissionClause = buildFacetClause(
      'transmission.slug',
      filters.transmission,
    );
    if (transmissionClause) mustQueries.push(transmissionClause);

    const fuelClause = buildFacetClause('fuel_type.slug', filters.fuel);
    if (fuelClause) mustQueries.push(fuelClause);

    const specClause = buildFacetClause('spec.slug', filters.spec);
    if (specClause) mustQueries.push(specClause);

    const conditionClause = buildFacetClause(
      'condition.slug',
      filters.condition,
    );
    if (conditionClause) mustQueries.push(conditionClause);

    const badgesClause = buildFacetClause('badges.slug', filters.badges);
    if (badgesClause) mustQueries.push(badgesClause);
    if (filters.specialConditions) {
      filters.specialConditions.forEach(({ slug }) => {
        const queryTerm = FILTER_CONFIG.TAG_INDEX_MAPPING[slug];
        if (queryTerm) mustQueries.push({ term: queryTerm });
      });
    }

    if (filters?.good_deal) {
      mustQueries.push({ term: { good_deal: true } });
    }

    return mustQueries;
  }

  static buildUsedCarsListingsMustNotQueries(additionalOptions = {}) {
    const mustNot = [];
    const { excludeListingIds = [], excludeFilters = {} } = additionalOptions;
    const { make, model, year, city, price } = excludeFilters;

    // Exclude specific listing IDs
    const excludeIds = (excludeListingIds || [])
      .map((id) => Number(id))
      .filter((n) => Number.isFinite(n));
    if (excludeIds.length) {
      mustNot.push({ terms: { listing_id: excludeIds } });
    }

    // Exclude based on filters
    if (make?.slug) {
      mustNot.push({ term: { 'make.slug': make.slug } });
    }
    if (model?.slug) {
      mustNot.push({ term: { 'model.slug': model.slug } });
    }
    if (year?.min && year?.max) {
      mustNot.push({
        range: {
          year: {
            gte: Number(year.min),
            lte: Number(year.max),
          },
        },
      });
    }
    if (city?.slug) {
      const locationClauses = this.buildLocationMustFilters(city);
      if (locationClauses.length) {
        mustNot.push(...locationClauses);
      }
    }
    if (price?.min || price?.max) {
      mustNot.push({
        range: {
          price: {
            ...(price.min && { gte: Number(price.min) }),
            ...(price.max && { lte: Number(price.max) }),
          },
        },
      });
    }

    return mustNot;
  }

  static async getUsedCarsListings({
    filters = {},
    page = 1,
    pageSize = 40,
    type, // 'premium' | 'simple' | undefined
    additionalOptions = {},
  }) {
    const mustQueries = this.buildUsedCarsListingsMustQueries(filters);
    const mustNot = this.buildUsedCarsListingsMustNotQueries(additionalOptions);
    const from = (page - 1) * pageSize;

    // Apply type filter if specified
    if (type === 'turbo') {
      mustQueries.push({
        term: { 'products_information.slug': 'turbo' },
      });
    } else if (type === 'premium') {
      mustQueries.push({
        term: { 'products_information.slug': 'signature-listing' },
      });
    } else if (type === 'simple') {
      mustQueries.push({
        bool: {
          must_not: [
            { term: { 'products_information.slug': 'signature-listing' } },
            { term: { 'products_information.slug': 'turbo' } },
          ],
        },
      });
    }
    // If type is undefined, fetch ALL listings (both premium and simple)

    // Determine sort
    const sort = filters.sortby?.slug
      ? filterData.SORT_FIELD_MAPPING[filters.sortby.slug]
      : filterData.SORT_FIELD_MAPPING[filterData.DEFAULT_SORT.slug];

    const body = {
      from,
      size: pageSize,
      sort,
      track_total_hits: true,
      query: {
        bool: {
          must: mustQueries,
          ...(mustNot.length ? { must_not: mustNot } : {}),
        },
      },
    };

    const response = await client.searchAds({ body });

    const items =
      response?.hits?.hits?.map(({ _source }) =>
        mapCarAdDetails(_source, 'list'),
      ) || [];

    return {
      items,
      totalCount: response.hits?.total?.value ?? 0,
      totalPages: Math.ceil((response.hits?.total?.value ?? 0) / pageSize),
    };
  }

  static async getUsedCarsListingsCount({ filters = {} } = {}) {
    const mustQueries = this.buildUsedCarsListingsMustQueries(filters);

    const body = {
      size: 0,
      track_total_hits: true,
      query: {
        bool: {
          must: mustQueries,
        },
      },
    };

    const response = await client.searchAds({
      body,
      options: { ...apiCacheConfig.usedCarsListings },
    });
    return response?.hits?.total?.value ?? 0;
  }

  static async getBodyTypes() {
    const response = await FiltersService.getFiltersWithCounts(
      {},
      ['bodyType'],
      { bodyType: { field: 'body_type.slug', key: 'body_type', size: 12 } },
      {
        next: apiCacheConfig.bodyTypes,
      },
    );
    if (response.error) return [];
    return response.bodyType;
  }

  static async getVariantDetail(variantId, limit = 1) {
    const body = {
      size: limit,
      query: { bool: { must: [{ term: { 'variant.id': variantId } }] } },
    };

    const response = await client.searchAds({ body });
    return response.error ? response : response.hits.hits[0];
  }

  static async getMinMaxAvgPrice(make, model, variant, modelYear) {
    try {
      const response = await client.searchAds({
        size: 0,
        body: {
          size: 0,
          query: {
            bool: {
              must: [
                { term: { 'make.slug': make } },
                { term: { 'model.slug': model } },
              ],
              should: [
                ...(variant ? [{ term: { 'variant.id': variant } }] : []),
                ...(modelYear ? [{ term: { year: modelYear } }] : []),
              ],
            },
          },
          aggs: {
            price_min: { min: { field: 'price' } },
            price_max: { max: { field: 'price' } },
          },
        },
      });

      const minPrice = Math.round(
        response?.aggregations?.price_min?.value || 0,
      );
      const maxPrice = Math.round(
        response?.aggregations?.price_max?.value || 0,
      );
      const avgPrice = (maxPrice - minPrice) / 2;

      return {
        minPrice,
        maxPrice,
        avgPrice,
      };
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch price data');
    }
  }

  static async getPriceRanges({ make, model, variant, modelYear }) {
    try {
      const res = await this.getMinMaxAvgPrice(make, model, variant, modelYear);
      const interval = (res?.maxPrice - res?.minPrice) / 20;
      const response = await client.searchAds({
        size: 0,
        body: {
          query: {
            bool: {
              must: [
                { term: { 'make.slug': make } },
                { term: { 'model.slug': model } },
              ],
              should: [
                ...(variant ? [{ term: { 'variant.id': variant } }] : []),
                ...(modelYear ? [{ term: { year: modelYear } }] : []),
              ],
            },
          },
          aggs: {
            price_min: {
              min: {
                field: 'price',
              },
            },
            price_max: {
              max: {
                field: 'price',
              },
            },
            price_ranges: {
              histogram: {
                field: 'price',
                interval: interval > 0 ? interval : 1,
                offset: res?.minPrice,
                min_doc_count: 0,
              },
            },
          },
        },
      });
      const buckets = response?.aggregations.price_ranges.buckets || [];
      if (buckets.length === 0) {
        return {
          minPrice: 0,
          maxPrice: 0,
          avgPrice: 0,
          priceRanges: [],
        };
      }
      let totalSum = 0;
      let totalCount = 0;
      const priceRanges = buckets.map(({ key, doc_count }) => {
        totalSum += key * doc_count;
        totalCount += doc_count;
        return {
          price: key,
          count: doc_count,
        };
      });
      const prices = buckets.map(({ key }) => key);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = Math.round(totalSum / totalCount);
      return {
        minPrice,
        maxPrice,
        avgPrice,
        priceRanges,
      };
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch price data');
    }
  }
  static async getRecentUsedCars({ make, model, year, queryParams = {} }) {
    try {
      const mustConditions = [];

      if (make) {
        mustConditions.push({ term: { 'make.slug': make } });
      }
      if (model) {
        // Check if model slug contains "shape" and extract the part before it
        let processedModel = model;
        if (model.includes('-shape-')) {
          processedModel = model.split('-shape-')[0];
        }
        mustConditions.push({ term: { 'model.slug': processedModel } });
      }
      if (year) {
        mustConditions.push({ term: { year: year } });
      }

      if (queryParams?.condition) {
        mustConditions.push({
          term: { 'condition.slug': queryParams?.condition },
        });
      }

      if (queryParams?.year_from && queryParams?.year_to) {
        mustConditions.push({
          range: {
            year: {
              gte: queryParams.year_from,
              lte: queryParams.year_to,
            },
          },
        });
      }

      if (queryParams?.transmission) {
        mustConditions.push({
          term: { 'transmission.slug': queryParams?.transmission },
        });
      }

      if (queryParams?.body) {
        mustConditions.push({
          term: { 'body_type.slug': queryParams?.body },
        });
      }

      if (queryParams?.fuel?.length) {
        const fuelSlugs = queryParams.fuel
          .map((f) => f?.slug || f)
          .filter(Boolean);
        if (fuelSlugs.length) {
          mustConditions.push({ terms: { 'fuel_type.slug': fuelSlugs } });
        }
      }

      if (queryParams?.exclude) {
        if (queryParams?.condition === 'new') {
          mustConditions.push({
            bool: {
              must_not: {
                term: { listing_external_id: queryParams.exclude },
              },
            },
          });
        } else {
          mustConditions.push({
            bool: {
              must_not: {
                term: { listing_id: queryParams.exclude },
              },
            },
          });
        }
      }

      if (queryParams?.listingCategory) {
        mustConditions.push({
          term: { 'listing_category.slug': queryParams?.listingCategory },
        });
      }

      const filterConditions = [];

      if (queryParams.city) {
        mustConditions.push({
          term: { 'location.slug': queryParams.city },
        });
      }

      if (queryParams.priceRange) {
        const priceRange = queryParams.priceRange;
        if (typeof priceRange === 'object' && priceRange !== null) {
          const { min, max } = priceRange;
          filterConditions.push({
            range: {
              price: {
                ...(min && { gte: min }),
                ...(max && { lte: max }),
              },
            },
          });
        } else {
          // Filter cars with price >= current unit price
          filterConditions.push({
            range: {
              price: {
                gte: priceRange,
              },
            },
          });
        }
      }

      const isPremium = queryParams.isPremium;
      const isBasic = queryParams.isBasic;
      const totalLimit = Number(queryParams?.maxSize) || 12;
      let premiumLimit = Number(queryParams?.maxSize) || 7;
      let turboLimit = Number(queryParams?.maxSize) || 5;
      let nonPremiumLimit = totalLimit;
      if (isPremium) premiumLimit = totalLimit;

      // Determine sort order - use price ascending only when priceRange is provided
      const sortOrder = queryParams.priceRange
        ? [{ price: 'asc' }]
        : [{ latest_product_application_date: 'desc' }];

      const turboQuery = !!(!queryParams.priceRange && !isPremium && !isBasic)
        ? {
            size: turboLimit,
            body: {
              size: turboLimit,
              query: {
                bool: {
                  must: [
                    ...mustConditions,
                    {
                      term: {
                        'products_information.slug': 'turbo',
                      },
                    },
                  ],
                  filter: filterConditions,
                },
              },
              sort: sortOrder,
            },
          }
        : null;
      const premiumQuery =
        !queryParams.priceRange && !isBasic
          ? {
              size: premiumLimit,
              body: {
                size: premiumLimit,
                query: {
                  bool: {
                    must: [
                      ...mustConditions,
                      {
                        term: {
                          'products_information.slug': 'signature-listing',
                        },
                      },
                    ],
                    filter: filterConditions,
                  },
                },
                sort: sortOrder,
              },
            }
          : null;

      const nonPremiumQuery =
        !isPremium && nonPremiumLimit > 0
          ? {
              size: nonPremiumLimit,
              body: {
                size: nonPremiumLimit,
                query: {
                  bool: {
                    must: mustConditions,
                    must_not: [
                      {
                        term: {
                          'products_information.slug': 'signature-listing',
                        },
                      },
                      {
                        term: {
                          'products_information.slug': 'turbo',
                        },
                      },
                    ],
                    filter: filterConditions,
                  },
                },
                sort: sortOrder,
              },
            }
          : null;

      const [premiumResponse, turboResponse, nonPremiumResponse] =
        await Promise.all([
          premiumQuery ? client.searchAds(premiumQuery) : Promise.resolve(null),
          turboQuery ? client.searchAds(turboQuery) : Promise.resolve(null),
          nonPremiumQuery
            ? client.searchAds(nonPremiumQuery)
            : Promise.resolve(null),
        ]);
      const turboCars =
        turboResponse?.hits?.hits?.map(({ _source }) =>
          mapCarAdDetails(_source, 'list'),
        ) || [];
      const premiumCars =
        premiumResponse?.hits?.hits?.map(({ _source }) =>
          mapCarAdDetails(_source, 'list'),
        ) || [];

      const nonPremiumCars =
        nonPremiumResponse?.hits?.hits?.map(({ _source }) =>
          mapCarAdDetails(_source, 'list'),
        ) || [];

      return [...turboCars, ...premiumCars, ...nonPremiumCars].slice(
        0,
        totalLimit,
      );
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch recent listings data');
    }
  }

  static async getCCRanges() {
    const response = await FiltersService.getFiltersWithCounts(
      {},
      ['cc'],
      {
        cc: FILTERS_AGG_CONFIG.cc,
      },
      {
        next: apiCacheConfig.ccRanges,
      },
    );

    return {
      label: 'CC Ranges',
      value: 'cc',
      items: response.cc || [],
      hasCount: true,
    };
  }

  static async getTopCitiesForAds(limit = 6) {
    const response = await FiltersService.getFiltersWithCounts(
      {},
      ['location'],
      {
        location: FILTERS_AGG_CONFIG.location,
      },
      {
        next: apiCacheConfig.topLocationsByCount,
      },
    );
    return {
      label: 'Cities',
      value: 'city',
      items: response.location.slice(0, limit),
      hasCount: true,
    };
  }

  static async getAdsByIds(listingIds) {
    try {
      if (!listingIds?.length) {
        return [];
      }

      const usedListings = [];
      const newListings = [];

      listingIds.forEach((id) => {
        if (typeof id === 'string' && id.startsWith('new-')) {
          const stripped = id.replace('new-', '');
          if (!isNaN(stripped)) newListings.push(stripped);
        } else if (!isNaN(id)) {
          usedListings.push(Number(id));
        }
      });

      const shouldQueries = [];

      if (usedListings.length > 0) {
        shouldQueries.push({
          terms: {
            listing_id: usedListings,
          },
        });
      }

      if (newListings.length > 0) {
        shouldQueries.push({
          terms: {
            listing_external_id: newListings,
          },
        });
      }

      if (shouldQueries.length === 0) {
        return [];
      }

      const response = await client.searchAds({
        body: {
          query: {
            bool: {
              should: shouldQueries,
              minimum_should_match: 1,
            },
          },
          size: listingIds.length,
        },
      });

      const hits = response?.hits?.hits || [];
      const mappedAds =
        hits?.map(({ _source }) => mapCarAdDetails(_source, 'list')) || [];

      return orderAdsByIds(mappedAds, listingIds);
    } catch (error) {
      console.error('Elastic search error', error);
      return [];
    }
  }

  static async getListingById(id) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) return null;

      const response = await client.searchAds({
        body: {
          query: {
            term: { listing_id: numericId },
          },
          size: 1,
        },
      });

      const hit = response?.hits?.hits?.[0];
      if (!hit) return null;
      return mapCarAdDetails(hit._source, 'list');
    } catch (error) {
      console.error('Elastic search error', error);
      return null;
    }
  }

  /* Returns all available makes with their counts. */
  static async getMakesData(options = {}) {
    try {
      const {
        limit = null,
        sortBy = 'count',
        sortOrder = 'desc',
        citySlug = null,
      } = options;

      let orderConfig;
      if (sortBy === 'slug') {
        orderConfig = { _key: sortOrder };
      } else {
        orderConfig = { _count: sortOrder };
      }

      const size = limit || 10000;

      const body = {
        size: 0,
        aggs: {
          make_counts: {
            terms: {
              field: 'make.slug',
              order: orderConfig,
              size: size,
            },
            aggs: {
              label_value: {
                top_hits: {
                  size: 1,
                  _source: [
                    'make.id',
                    'make.label',
                    'make.label_l1',
                    'make.slug',
                  ],
                },
              },
            },
          },
        },
      };

      // Add city filter if provided
      if (citySlug) {
        body.query = {
          term: {
            'location.slug': citySlug,
          },
        };
      }

      const response = await client.searchAds({
        body,
      });

      return extractBuckets(
        response.aggregations?.make_counts?.buckets,
        'make',
      );
    } catch (error) {
      console.log('Error fetching make counts:', error);
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch make counts');
    }
  }

  /* function to get model counts and data with optional make filtering and sorting. */
  static async getModelData(makeSlug = null, options = {}) {
    try {
      const {
        limit = null,
        sortBy = 'count',
        sortOrder = 'desc',
        citySlug = null,
      } = options;

      let orderConfig;
      if (sortBy === 'slug') {
        orderConfig = { _key: sortOrder };
      } else {
        orderConfig = { _count: sortOrder };
      }

      const size = limit || 10000;

      const body = {
        size: 0,
        aggs: {
          model_counts: {
            terms: {
              field: 'model.slug',
              order: orderConfig,
              size: size,
            },
            aggs: {
              label_value: {
                top_hits: {
                  size: 1,
                  _source: [
                    'model.id',
                    'model.label',
                    'model.label_l1',
                    'model.slug',
                  ],
                },
              },
            },
          },
        },
      };

      // Build query filters
      const mustClauses = [];

      if (makeSlug) {
        if (typeof makeSlug === 'string') {
          mustClauses.push({ term: { 'make.slug': makeSlug } });
        } else {
          mustClauses.push({ term: { 'make.id': makeSlug } });
        }
      }

      if (citySlug) {
        mustClauses.push({ term: { 'location.slug': citySlug } });
      }

      if (mustClauses.length > 0) {
        body.query = {
          bool: {
            must: mustClauses,
          },
        };
      }

      const response = await client.searchAds({
        body,
      });

      return extractBuckets(
        response.aggregations.model_counts.buckets,
        'model',
      );
    } catch (error) {
      console.log('Error fetching model counts:', error);
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch model counts');
    }
  }

  /**
   * Top models on /car/city/:slug — same location scope as FiltersService /
   * buildLocationMustQuery (loc_level … loc_4), so counts match sidebar and
   * /car/city/:city/:make model facets. A single loc_n term misses ads that only
   * store the city id on a deeper loc_* field (e.g. 51 vs 59 for BYD F3).
   *
   * `maxBuckets` is the ES terms `size`: only that many distinct model slugs are
   * returned (ordered by count). Use a generous value so mid-volume models
   * (e.g. Kia Sportage) are not dropped when 12+ other models rank higher.
   */
  static async getTopModelsInCity(city) {
    try {
      const locationClause = FiltersService.buildLocationMustQuery(
        city?.id,
        city?.level,
      );
      if (!locationClause) {
        return [];
      }

      const body = {
        size: 0,
        query: {
          bool: {
            must: [locationClause],
          },
        },
        aggs: {
          model_counts: {
            terms: {
              field: 'model.slug',
              order: { _count: 'desc' },
              size: 12,
            },
            aggs: {
              label_value: {
                top_hits: {
                  size: 1,
                  _source: [
                    'make.slug',
                    'make.label',
                    'make.label_l1',
                    'model.slug',
                    'model.label',
                    'model.label_l1',
                  ],
                },
              },
            },
          },
        },
      };

      const response = await client.searchAds({ body });
      const buckets = response?.aggregations?.model_counts?.buckets || [];

      return buckets.map((bucket) => {
        const src = bucket?.label_value?.hits?.hits?.[0]?._source || {};
        const make = src.make || {};
        const model = src.model || {};
        return {
          slug: model.slug || bucket.key,
          makeSlug: make.slug,
          label: `${make.label || ''} ${model.label || ''}`.trim(),
          label_l1: `${make.label_l1 || ''} ${model.label_l1 || ''}`.trim(),
          count: bucket.doc_count,
          value: model.slug || bucket.key,
        };
      });
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch top models in city');
    }
  }

  /* Get Years data + counts for a specific make and model */
  static async getYearsForMakeModel(makeSlug, modelSlug, options = {}) {
    const { limit = null } = options;
    try {
      const body = {
        size: 0,
        aggs: {
          year_counts: {
            terms: {
              field: 'year',
              order: { _key: 'desc' },
              ...(limit && { size: limit }),
            },
          },
        },
      };
      const mustFilters = [];

      mustFilters.push({ term: { 'make.slug': makeSlug } });
      mustFilters.push({ term: { 'model.slug': modelSlug } });

      body.query = {
        bool: {
          must: mustFilters,
        },
      };

      const response = await client.searchAds({
        body,
      });

      const years = response.aggregations.year_counts.buckets.map((bucket) => ({
        key: bucket.key,
        label: bucket.key.toString(),
        value: bucket.key,
        slug: bucket.key,
        doc_count: bucket.doc_count,
      }));

      return years;
    } catch (error) {
      console.log('Error fetching years:', error);
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch years data');
    }
  }

  /* Get Variants data + counts for a specific make, model and year(optional) */
  /* This api was initially mmade since year and variant were clubbed, now removed, can safely be merged with getVariantDetail once listing is complete */
  static async getVariantsForMakeModelYear(
    makeSlug,
    modelSlug,
    yearRange = null,
    options = {},
  ) {
    try {
      const { limit = null, sortBy = 'count', sortOrder = 'desc' } = options;

      let orderConfig;
      if (sortBy === 'slug') {
        orderConfig = { _key: sortOrder };
      } else {
        orderConfig = { _count: sortOrder };
      }

      const size = limit || 10000;

      const mustFilters = [
        { term: { 'make.slug': makeSlug } },
        { term: { 'model.slug': modelSlug } },
      ];

      if (yearRange) {
        const yearFilter = { range: { year: {} } };

        if (yearRange.min !== undefined) {
          yearFilter.range.year.gte = yearRange.min;
        }

        if (yearRange.max !== undefined) {
          yearFilter.range.year.lte = yearRange.max;
        }

        mustFilters.push(yearFilter);
      }

      const response = await client.searchAds({
        body: {
          size: 0,
          aggs: {
            variant_counts: {
              terms: {
                field: 'variant.slug',
                order: orderConfig,
                size: size,
              },
              aggs: {
                variant_details: {
                  top_hits: {
                    size: 1,
                    _source: [
                      'variant.id',
                      'variant.slug',
                      'variant.label',
                      'variant.label_l1',
                      'variant.year',
                    ],
                  },
                },
              },
            },
          },
          query: {
            bool: {
              must: mustFilters,
            },
          },
        },
      });

      const variants = response.aggregations.variant_counts.buckets.map(
        (bucket) => ({
          ...bucket.variant_details.hits.hits[0]._source.variant,
          count: bucket.doc_count,
          key: bucket.key,
          value: bucket.variant_details.hits.hits[0]._source.variant.slug,
        }),
      );

      return variants;
    } catch (error) {
      console.error('Elasticsearch error:', error);
      throw new Error('Failed to fetch variants data');
    }
  }

  /* Get cities for specific body types for quick filters (yet to be confirmed from product) */
  static async getCitiesForBodyTypes(limit = 6) {
    try {
      const response = await client.searchAds({
        size: 0,
        body: {
          size: 0,
          aggs: {
            top_cities: {
              terms: {
                field: 'location.title',
                size: limit,
                order: {
                  _count: 'desc',
                },
              },
              aggs: {
                slug: {
                  top_hits: {
                    size: 1,
                    _source: [
                      'location.slug',
                      'location.title',
                      'location.title_l1',
                    ],
                  },
                },
              },
            },
          },
        },
      });

      const items = response?.aggregations?.top_cities?.buckets.map((item) => ({
        ...item,
        slug: item.slug?.hits?.hits[0]?._source?.location?.slug,
        label: item.slug?.hits?.hits[0]?._source?.location?.title,
        label_l1: item.slug?.hits?.hits[0]?._source?.location?.title_l1,
      }));

      return {
        label: 'City',
        value: 'city',
        items,
        hasCount: true,
      };
    } catch (error) {
      console.error('Elastic Search Error', error);
    }
  }

  static async getSubCitiesWithListings(parentLocationId, options = {}) {
    try {
      const {
        limit = 100,
        makeSlug = null,
        modelSlug = null,
        childLevel = 3,
      } = options;

      // Build filter clauses
      const filterClauses = [
        { term: { 'location.breadcrumbs.id': parentLocationId } },
      ];

      // Add child level filter if provided, otherwise use generic level filter
      if (childLevel) {
        filterClauses.push({ term: { 'location.level': childLevel } });
      }

      // Add make filter if provided
      if (makeSlug) {
        if (typeof makeSlug === 'string') {
          filterClauses.push({ term: { 'make.slug': makeSlug } });
        } else {
          filterClauses.push({ term: { 'make.id': makeSlug } });
        }
      }

      // Add model filter if provided
      if (modelSlug) {
        if (typeof modelSlug === 'string') {
          filterClauses.push({ term: { 'model.slug': modelSlug } });
        } else {
          filterClauses.push({ term: { 'model.id': modelSlug } });
        }
      }

      const response = await client.searchAds({
        size: 0,
        body: {
          query: {
            bool: {
              filter: filterClauses,
            },
          },
          aggs: {
            sub_cities: {
              terms: {
                field: 'location.id',
                size: limit,
                order: { _count: 'desc' },
              },
              aggs: {
                details: {
                  top_hits: {
                    size: 1,
                    _source: [
                      'location.id',
                      'location.slug',
                      'location.title',
                      'location.title_l1',
                      'location.level',
                      'location.breadcrumbs',
                    ],
                  },
                },
              },
            },
          },
        },
      });

      const items = response?.aggregations?.sub_cities?.buckets.map(
        (bucket) => {
          const doc = bucket.details?.hits?.hits[0]?._source?.location || {};
          return {
            id: doc.id,
            slug: doc.slug,
            key: doc.slug,
            value: doc.slug,
            label: doc.title,
            label_l1: doc.title_l1,
            level: doc.level,
            breadcrumbs: doc.breadcrumbs,
            count: bucket.doc_count,
          };
        },
      );

      return items;
    } catch (error) {
      console.error('Elastic Search Error', error);
      return [];
    }
  }

  //used for counts in sub-cities links for pretty widget
  static async getUsedCarsCountByLocationMakeModel(
    citySlug,
    makeSlug,
    modelSlug,
  ) {
    try {
      const filters = [{ term: { 'location.slug': citySlug } }];

      if (makeSlug) {
        filters.push({ term: { 'make.slug': makeSlug } });
      }

      if (modelSlug) {
        filters.push({ term: { 'model.slug': modelSlug } });
      }

      const response = await client.searchAds({
        body: {
          size: 0,
          query: {
            bool: {
              filter: filters,
            },
          },
          aggs: {
            total_count: {
              value_count: { field: 'listing_id' },
            },
          },
        },
      });

      // Extract the total count from either hits or aggregation
      const count =
        response.aggregations?.total_count?.value ??
        response.hits?.total?.value ??
        0;
      return count;
    } catch (error) {
      console.error(
        'Elastic Search Error (getUsedCarsCountByLocationMakeModel)',
        error,
      );
      return 0;
    }
  }

  static async getFuelTypes() {
    const response = await FiltersService.getFiltersWithCounts(
      {},
      ['fuelType'],
      { fuelType: { field: 'fuel_type.slug', key: 'fuel_type', size: 20 } },
      {
        next: apiCacheConfig.fuelTypes,
      },
    );
    if (response.error) return [];
    return response.fuelType;
  }

  static async getYearWiseModelCount(model) {
    try {
      const response = await client.searchAds({
        body: {
          query: {
            bool: {
              must: [
                {
                  term: {
                    'model.slug': model,
                  },
                },
              ],
            },
          },
          size: 0,
          aggs: {
            years: {
              terms: {
                field: 'year',
                size: 100,
                order: {
                  _key: 'desc',
                },
              },
            },
            make_info: {
              top_hits: {
                size: 1,
                _source: ['make'],
              },
            },
            model_info: {
              top_hits: {
                size: 1,
                _source: ['model'],
              },
            },
          },
        },
      });

      return {
        total_count: response?.hits?.total?.value || 0,
        years:
          response?.aggregations?.years?.buckets?.map((bucket) => ({
            year: bucket.key,
            count: bucket.doc_count,
            label: `${
              response?.aggregations?.model_info?.hits?.hits?.[0]?._source
                ?.model?.label
            } ${bucket.key.toString()} (${bucket.doc_count})`,
            label_l1: `${
              response?.aggregations?.model_info?.hits?.hits?.[0]?._source
                ?.model?.label_l1
            } ${bucket.key.toString()} (${bucket.doc_count})`,
            href: `/car/${response?.aggregations?.make_info?.hits?.hits?.[0]?._source?.make?.slug}/${response?.aggregations?.model_info?.hits?.hits?.[0]?._source?.model?.slug}/year/${bucket.key}`,
          })) || [],
      };
    } catch (error) {
      console.error('Failed to fetch year-wise model count', error);
      return {
        model: null,
        total_count: 0,
        years: [],
      };
    }
  }

  static async getColors() {
    const response = await FiltersService.getFiltersWithCounts(
      {},
      ['colors'],
      {
        colors: {
          field: 'exterior_color.slug',
          key: 'exterior_color',
          size: 40,
        },
      },
      {
        next: apiCacheConfig.colors,
      },
    );
    if (response.error) return [];
    return response.colors;
  }

  static async getLocationRollup(filters = []) {
    try {
      // Fetch all locations for fallback labels
      const allLocations = await LocationsService.fetchAllLocations();
      const locationMap = new Map(allLocations.map((loc) => [loc.id, loc]));

      // Elasticsearch query: only terms aggregation (no top_hits)
      const response = await client.searchAds({
        body: {
          size: 0,
          query: {
            bool: {
              must: [
                { term: { 'make.slug': 'mercedes' } },
                { term: { 'model.slug': 'c-200' } },
                { term: { 'transmission.slug': 'manual' } },
              ],
              must_not: [{ term: { 'location.id': 2000 } }],
            },
          },
          aggs: {
            // Level 2 (Cities / Governorates)
            level_2_locations: {
              terms: { field: 'location.loc_2', size: 500 },
            },
            // Level 3 (Districts)
            level_3_locations: {
              terms: { field: 'location.loc_3', size: 2000 },
            },
            // Level 4 (Subdistricts)
            level_4_locations: {
              terms: { field: 'location.loc_4', size: 5000 },
            },
          },
        },
      });

      // Helper to map buckets using allLocations for labels
      const formatBuckets = (buckets) =>
        (buckets || [])
          .map((bucket) => {
            const loc = locationMap.get(bucket.key);
            if (!loc) return null;

            return {
              id: bucket.key,
              label: loc.title,
              label_l1: loc.title_l1,
              slug: loc.slug,
              count: bucket.doc_count,
            };
          })
          .filter(Boolean);

      // Merge all levels into a flat array
      const data = [
        ...formatBuckets(response.aggregations.level_2_locations?.buckets),
        ...formatBuckets(response.aggregations.level_3_locations?.buckets),
        ...formatBuckets(response.aggregations.level_4_locations?.buckets),
      ].sort((a, b) => b.count - a.count);

      return {
        total_count: response.hits.total.value || 0,
        locations: data,
      };
    } catch (error) {
      console.error('Failed to fetch location rollup', error);
      return {
        total_count: 0,
        locations: [],
      };
    }
  }
  static buildLocationMustFilters(city) {
    const { id, level, slug } = city;
    const cityGroups = filterData?.usedListingsFilterData?.cityGroups || [];
    if (Object.keys(cityGroups).includes(slug)) {
      const shouldClauses = [];
      const cityGroupSlugs = filterData?.usedListingsFilterData?.cityGroups[
        slug
      ]?.map((city) => city.slug);
      cityGroupSlugs.forEach((citySlug) => {
        shouldClauses.push({ term: { 'location.slug': citySlug } });
      });
      shouldClauses.push({ term: { 'location.slug': slug } });
      return [
        {
          bool: {
            should: shouldClauses,
            minimum_should_match: 1,
          },
        },
      ];
    }
    const locationQuery = FiltersService.buildLocationMustQuery(id, level);
    if (locationQuery) {
      return [locationQuery];
    }
  }
}

const fetchRecentUsedCarsCached = cacheBySerializedKey(
  async ({ make, model, year, queryParams }) =>
    ListingsService.getRecentUsedCars({ make, model, year, queryParams }),
);

export function getRecentUsedCarsCached(params = {}) {
  const { make, model, year, queryParams } = params;
  return fetchRecentUsedCarsCached({ make, model, year, queryParams });
}
