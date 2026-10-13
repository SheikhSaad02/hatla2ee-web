import { IMAGES_BASE_URL } from '@/constants';
import { apiClient } from '../network/api-client';

class ElasticMSearchClient {
  constructor() {
    this.endpoints = {
      make: '/api/surge/consumer/makes',
      model: '/api/surge/consumer/models',
      variant: '/api/surge/consumer/variants',
      location: '/api/surge/consumer/locations',
    };
  }

  buildQueryString({ filters = {}, sort = {}, limit } = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(`f[${key}][]`, item));
      } else {
        params.append(`f[${key}]`, value);
      }
    });

    Object.entries(sort).forEach(([key, value]) => {
      params.append(`sort[${key}]`, value);
    });

    if (limit !== undefined && limit !== null) {
      params.append('limit', limit);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  async search(
    type,
    responseKey,
    { filters, sort = { id: 'asc' }, limit = 10000, options = {} } = {},
  ) {
    const response = await apiClient.get(
      `${this.endpoints[type]}${this.buildQueryString({ filters, sort, limit })}`,
      options,
    );

    if (!response || response.error) {
      return [];
    }

    return Array.isArray(response[responseKey]) ? response[responseKey] : [];
  }

  async searchMakes(params = {}) {
    const makes = await this.search('make', 'makes', params);

    return makes.map((make) => ({
      ...make,
      logo: make?.logo || `${IMAGES_BASE_URL}/${make.slug}/thumbnail.png`,
    }));
  }

  async searchModels(params = {}) {
    return this.search('model', 'models', params);
  }

  async searchVariants(params = {}) {
    return this.search('variant', 'variants', params);
  }

  async searchLocations(params = {}) {
    return this.search('location', 'locations', params);
  }
}

const mSearchClient = new ElasticMSearchClient();

export default mSearchClient;
