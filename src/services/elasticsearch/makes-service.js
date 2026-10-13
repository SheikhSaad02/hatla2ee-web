import client from './client';
import mSearchClient from './m-search';
import { attachCountsAndSort } from '@/utils/used-cars/listings';
import { IMAGES_BASE_URL } from '@/constants';
import configs from '@/configs';
import { apiCacheConfig } from '@/configs/cacheConfig';
import { FiltersService } from './filter-service';
import { FILTERS_AGG_CONFIG } from '@/filters/filterConfig';
export class MakesService {
  static async getMakeInfo(makeSlug) {
    const response = await mSearchClient.searchMakes({
      filters: { slug: makeSlug },
      limit: 1,
    });

    if (response.error) return {};

    return response[0] || {};
  }

  static async getTopMakes(limit = 12) {
    try {
      const response = await FiltersService.getFiltersWithCounts(
        {},
        ['make'],
        { make: { ...FILTERS_AGG_CONFIG.make, size: limit } },
        {
          next: apiCacheConfig.topMakes,
        },
      );

      const items = response.make?.map((data) => ({
        ...data,
        ...(!configs.USE_BRAND_SPRITE && {
          src: `${IMAGES_BASE_URL}/${data?.slug}/thumbnail.png`,
        }),
      }));

      return {
        label: 'Top Brands',
        value: 'make',
        items,
        hasCount: true,
      };
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.body?.error || error);
      throw new Error('Failed to fetch top makes');
    }
  }
  static async getAllMakes() {
    const response = await mSearchClient.searchMakes({
      options: {
        next: apiCacheConfig.allMakes,
      },
    });
    if (response?.error) return [];
    return response;
  }

  static async getAllMakesAggregationCounts(limit = 200) {
    const response = await client.searchAds({
      body: {
        size: 0,
        aggs: {
          make_counts: {
            terms: {
              field: 'make.slug',
              size: limit,
              order: {
                _count: 'desc',
              },
            },
          },
        },
      },
      options: {
        next: { revalidate: 86400 }, // 1 day in seconds
      },
    });

    if (response.error) {
      return [];
    }

    const countsMap = {};
    response?.aggregations?.make_counts?.buckets.forEach((bucket) => {
      countsMap[bucket.key] = bucket.doc_count;
    });

    return countsMap;
  }
  static async getAllMakesWithCounts() {
    const [makes, countsMap] = await Promise.all([
      this.getAllMakes(),
      this.getAllMakesAggregationCounts(),
    ]);

    if (makes.error || countsMap.error) {
      return [];
    }

    return attachCountsAndSort(makes, countsMap);
  }
}
