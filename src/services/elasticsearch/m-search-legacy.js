import {
  API_URL,
  elasticIndexes,
  IMAGES_BASE_URL,
  IS_PRODUCTION,
  LEGION_AUTH_TOKEN,
  SERVER_CLUSTER_API_URL,
} from '@/constants';
import { ApiClient } from '../network/api-client';
import { isServer } from '@/utils/general';

class ElasticMSearchClient {
  constructor({ node, auth }) {
    this.node = node;
    this.auth = auth;
    this.apiClient = new ApiClient(
      isServer() && (IS_PRODUCTION || SERVER_CLUSTER_API_URL)
        ? SERVER_CLUSTER_API_URL
        : API_URL,
    );

    this.defaultErrorMessage =
      'An error occurred while processing elastic-legion request.';
    this.url = '/api/surge/external/search/_msearch';
  }
  getHeaders() {
    return {
      Authorization:
        'Basic ' + process.env.NEXT_PUBLIC_ELASTICSEARCH_AUTH_TOKEN,
      auth_token: LEGION_AUTH_TOKEN,
      'Content-Type': 'application/x-ndjson',
    };
  }

  getIndex(type) {
    let index = '';
    switch (type) {
      case 'make':
        index = elasticIndexes.MAKES;
        break;
      case 'model':
        index = elasticIndexes.MODELS;
        break;
      case 'variant':
        index = elasticIndexes.VARIANTS;
        break;
      case 'location':
        index = elasticIndexes.LOCATIONS;
        break;
      default:
        break;
    }
    return index;
  }

  getDefaultPayload() {
    return {
      size: 10000,
      sort: [
        {
          id: {
            order: 'asc',
            missing: '_first',
            unmapped_type: 'long',
          },
        },
      ],
    };
  }

  buildQuery(index, body = {}) {
    const defaultBody = {
      size: 10000,
      ...body,
    };

    return `{"index":"${index}"}\n${JSON.stringify(defaultBody)}\n`;
  }

  async searchMakes(params = {}) {
    const { body = this.getDefaultPayload(), options = {} } = params;
    const response = await this.apiClient.post(
      this.url,
      this.buildQuery(this.getIndex('make'), body),
      {
        headers: this.getHeaders(),
        ...options,
      },
    );

    if (response.error) {
      return [];
    }

    return response.responses[0].hits.hits.map(({ _source }) => ({
      ..._source,
      logo: _source?.logo || `${IMAGES_BASE_URL}/${_source.slug}/thumbnail.png`,
    }));
  }

  async searchModels(params = {}) {
    const { body = this.getDefaultPayload(), options = {} } = params;
    const response = await this.apiClient.post(
      this.url,
      this.buildQuery(this.getIndex('model'), body),
      {
        headers: this.getHeaders(),
        ...options,
      },
    );

    if (response.error) {
      return [];
    }

    return response.responses[0].hits.hits.map(({ _source }) => {
      return { ..._source };
    });
  }

  async searchVariants(params = {}) {
    const { body = this.getDefaultPayload(), options = {} } = params;
    const response = await this.apiClient.post(
      this.url,
      this.buildQuery(this.getIndex('variant'), body),
      {
        headers: this.getHeaders(),
        ...options,
      },
    );

    if (response.error) {
      return [];
    }

    return response.responses[0].hits.hits.map(({ _source }) => {
      return { ..._source };
    });
  }

  async searchLocations(params = {}) {
    const { body = this.getDefaultPayload(), options = {} } = params;

    const response = await this.apiClient.post(
      this.url,
      this.buildQuery(this.getIndex('location'), body),
      {
        headers: this.getHeaders(),
        ...options,
      },
    );

    if (response.error) {
      return [];
    }

    return response.responses[0].hits.hits.map(({ _source }) => {
      return { ..._source };
    });
  }
}

const mSearchClient = new ElasticMSearchClient({
  node: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL,
  auth: { token: process.env.NEXT_PUBLIC_ELASTICSEARCH_AUTH_TOKEN },
});

export default mSearchClient;
