import {
  ELASTIC_SEARCH_SERVER_CLUSTER_API_URL,
  elasticIndexes,
} from '@/constants';
import { ApiClient } from '../network/api-client';
import { isServer } from '@/utils/general';

class ElasticClient {
  constructor({ node, auth }) {
    this.node = node;
    this.auth = auth;
    this.apiClient =
      ELASTIC_SEARCH_SERVER_CLUSTER_API_URL && isServer()
        ? new ApiClient(ELASTIC_SEARCH_SERVER_CLUSTER_API_URL)
        : new ApiClient(process.env.NEXT_PUBLIC_ELASTICSEARCH_URL);
    this.defaultErrorMessage =
      'An error occurred while processing elastic request.';
  }
  getHeaders() {
    return {
      Authorization:
        'Basic ' + process.env.NEXT_PUBLIC_ELASTICSEARCH_AUTH_TOKEN,
    };
  }

  async searchAds({
    index = elasticIndexes.LISTINGS,
    body = {},
    options = {},
  }) {
    try {
      const response = await this.apiClient.post(
        `/${index}` + '/_search',
        body,
        { headers: this.getHeaders(), ...options },
      );
      return response;
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error, error);
      throw new Error(error.message || this.defaultErrorMessage);
    }
  }

  async search({ index = 'search_index', body = {} }) {
    try {
      const response = await this.apiClient.post(
        `/${index}` + '/_search',
        body,
        { headers: this.getHeaders() },
      );
      return response;
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error, error);
      throw new Error(error.message || this.defaultErrorMessage);
    }
  }

  async searchClasses({ index = 'hatla2ee_eg_variants_live', body = {} }) {
    try {
      const response = await this.apiClient.post(
        `/${index}` + '/_search',
        body,
        { headers: this.getHeaders() },
      );
      return response;
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.error, error);
      throw new Error(error.message || this.defaultErrorMessage);
    }
  }
}

const client = new ElasticClient({
  node: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL,
  auth: { token: process.env.NEXT_PUBLIC_ELASTICSEARCH_AUTH_TOKEN },
});

export default client;
