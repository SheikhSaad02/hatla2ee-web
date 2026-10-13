import client from './client';
import { mapCarAdDetails } from '@/mappers/listings';
import { transformShowRoomMakes } from '@/mappers/showroom';

export class ShowRoomService {
  static async getShowRoomCarsByAgency(
    agencySlug,
    pageNumber = 1,
    pageSize = 30,
    condition,
  ) {
    try {
      const response = await client.searchAds({
        size: 0,
        body: {
          from: (pageNumber - 1) * pageSize,
          size: pageSize,
          query: {
            function_score: {
              query: {
                bool: {
                  must: [
                    {
                      term: {
                        'agency.slug': agencySlug,
                      },
                    },
                    {
                      terms: {
                        'condition.slug': [condition],
                      },
                    },
                  ],
                },
              },
              functions: [
                {
                  filter: {
                    term: {
                      'products_information.slug': 'turbo',
                    },
                  },
                  weight: 3.0,  
                },
                {
                  filter: {
                    term: {
                      'products_information.slug': 'signature-listing',
                    },
                  },
                  weight: 2.0,
                },
              ],
              score_mode: 'multiply',
              boost_mode: 'multiply',
            },
          },
        },
      });

      const listingDetails =
        response?.hits?.hits?.map(({ _source }) =>
          mapCarAdDetails(_source, 'list'),
        ) || [];

      const totalCount = response?.hits?.total?.value || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      const pagination = {
        current_page: pageNumber,
        next_page: pageNumber < totalPages ? pageNumber + 1 : null,
        prev_page: pageNumber > 1 ? pageNumber - 1 : null,
        total_pages: totalPages,
        total_count: totalCount,
      };

      return {
        listingDetails,
        pagination,
      };
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error || error);
      throw new Error('Failed to fetch data');
    }
  }
  static async getShowRoomMakes(agencySlug) {
    try {
      const response = await client.searchAds({
        body: {
          size: 0,
          _source: false,
          query: {
            bool: {
              must: [
                {
                  term: {
                    'condition.slug': 'new',
                  },
                },
                {
                  term: {
                    'agency.slug': agencySlug,
                  },
                },
              ],
            },
          },
          aggs: {
            makes: {
              terms: {
                field: 'make.slug',
                size: 1000,
                order: {
                  _key: 'asc',
                },
              },
              aggs: {
                labels: {
                  top_hits: {
                    _source: {
                      includes: ['make.label', 'make.label_l1'],
                    },
                    size: 1,
                  },
                },
              },
            },
          },
        },
      });

      const showRoomMakes = transformShowRoomMakes(
        response.aggregations.makes.buckets,
      );
      return showRoomMakes;
    } catch (error) {}
  }
  static async getShowroomAdsByMake(agencySlug, makeSlug, condition) {
    try {
      const mustQueries = [];
      if (agencySlug) {
        mustQueries.push({
          term: { 'agency.slug': agencySlug },
        });
      }

      if (makeSlug) {
        mustQueries.push({
          term: { 'make.slug': makeSlug },
        });
      }
      if (condition) {
        mustQueries.push({
          term: { 'condition.slug': condition },
        });
      }
      const response = await client.searchAds({
        body: {
          query: {
            bool: {
              must: mustQueries,
            },
          },
        },
      });

      const makesData =
        response?.hits?.hits?.map(({ _source }) =>
          mapCarAdDetails(_source, 'list'),
        ) || [];

      return makesData;
    } catch (error) {
      console.error('==Failed to fetch showroom ads', error);
      throw new Error('Failed to fetch data');
    }
  }
}
