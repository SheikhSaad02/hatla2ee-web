import { isNumeric } from '@/utils/general';
import client from './client';
import { transformModels } from '@/mappers/listings';
import mSearchClient from './m-search';
import { apiCacheConfig } from '@/configs/cacheConfig';

export class ModelsService {
  static async getTopModels(limit = 12, fuelSlugs) {
    try {
      const response = await client.searchAds({
        size: 0,
        body: {
          ...(fuelSlugs?.length && {
            query: {
              bool: { must: [{ terms: { 'fuel_type.slug': fuelSlugs } }] },
            },
          }),
          aggs: {
            top_models: {
              terms: {
                field: 'model.slug',
                size: limit ?? 100,
                order: { _count: 'desc' },
              },
              aggs: {
                labels: {
                  top_hits: {
                    size: 1,
                    _source: [
                      'make.label',
                      'make.label_l1',
                      'model.label',
                      'model.label_l1',
                      'make.slug',
                      'model.slug',
                      'make.id',
                      'model.id',
                    ],
                  },
                },
              },
            },
          },
        },
        options: { next: apiCacheConfig.topModels },
      });

      const buckets = response?.aggregations?.top_models?.buckets || [];
      const items = transformModels(buckets.slice(0, limit));

      return {
        label: 'Top Models',
        value: 'model',
        hasCount: true,
        items,
      };
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.body?.error || error);
      throw new Error('Failed to fetch top models');
    }
  }

  static async getAllModelsForMake(slug) {
    const queryField = isNumeric(slug) ? 'make.id' : 'make.slug';
    const response = await mSearchClient.searchModels({
      filters: { [queryField]: slug },
    });
    return response;
  }
  static async getAllModels() {
    const response = await mSearchClient.searchModels();
    return response;
  }
}
