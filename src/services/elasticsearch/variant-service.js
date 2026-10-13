import client from './client';

export class VariantService {
  static async getVariantsForMakeModelYear(
    makeSlug,
    modelSlug,
    yearRange = null,
    options = {},
  ) {
    const { limit = 50, sortBy = 'year', sortOrder = 'desc' } = options;

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
        size: limit,
        query: {
          bool: {
            must: mustFilters,
          },
        },
        sort: [
          {
            [sortBy]: { order: sortOrder },
          },
        ],
        _source: [
          'variant.id',
          'variant.slug',
          'variant.label',
          'variant.label_l1',
          'variant.year',
        ],
      },
    });

    if (response.error) {
      return [];
    }

    const variants = response.hits.hits
      .map((hit) => hit._source?.variant)
      .filter(Boolean);

    const uniqueVariants = Object.values(
      variants.reduce((acc, variant) => {
        if (variant?.slug) {
          acc[variant.slug] = variant;
        }
        return acc;
      }, {}),
    );

    return uniqueVariants;
  }
}
