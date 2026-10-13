import mSearchClient from './m-search';
import { apiCacheConfig } from '@/configs/cacheConfig';

export class LocationsService {
  static async fetchAllLocations() {
    const response = await mSearchClient.searchLocations({
      filters: { allow_posting: true, level: [2, 3, 4] },
      options: {
        next: apiCacheConfig.allLocations,
      },
    });

    if (response?.error) return [];

    return response.map((source) => ({
      ...source,
      title: source.title,
      title_l1: source.title_l1,
      label: source.title,
      label_l1: source.title_l1,
      value: source.slug,
    }));
  }
}
