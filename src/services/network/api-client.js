import { IS_PRODUCTION, SERVER_CLUSTER_API_URL } from '@/constants';
import { getCookie } from '@/utils/cookies';
import { isServer } from '@/utils/general';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const getErrorObject = (message, status, statusText, data) => {
  return {
    error: {
      message: message || 'An error occurred while processing your request.',
      status: status,
      statusText: statusText,
      data: data || null,
    },
  };
};

const getErrorString = (err) => {
  const error = err?.errors || err.error || err.message;
  if (typeof error === 'string') {
    return error;
  }
  if (Array.isArray(error)) {
    return error
      .map((err) => (typeof err === 'string' ? err : JSON.stringify(err)))
      .join(', ');
  }
  if (error && typeof error === 'object') {
    return Object.entries(error)
      .map(([key, value]) => `${key}: ${getErrorString(value)}`)
      .join(', ');
  }
  return String(error);
};

function fetchToCurl(url, options = {}) {
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const headerString = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ');
  let bodyString = '';
  if (options.body) {
    bodyString = `--data '${options.body}'`;
  }
  return `curl -X ${method} ${headerString} ${bodyString} "${url}"`;
}

const getXRequestedWithHeader = (url) => {
  const isServerSide = isServer();
  if (
    url.includes('/api/surge') ||
    url.includes('/api/search') ||
    url.includes('/_search')
  ) {
    return { 'X-Requested-With': isServerSide ? 'NextServer' : 'NextClient' };
  }
  return {};
};

export class ApiClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.options = options;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    let headersList = null;
    if (options?.isServer) {
      const { headers } = await import('next/headers');
      headersList = await headers();
    }
    const XRequestedWithHeader = IS_PRODUCTION
      ? getXRequestedWithHeader(url)
      : {};
    const requestOptions = {
      ...this.options,
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...XRequestedWithHeader,
        ...this.options.headers,
        ...options.headers,
        ...(headersList ? Object.fromEntries(headersList.entries()) : {}),
      },
    };

    if (options.body && typeof options.body === 'object') {
      requestOptions.body = JSON.stringify(options.body);
    }

    // const start = Date.now();
    try {
      const response = await fetch(url, requestOptions);
      // console.log('=======Curl Command: ', fetchToCurl(url, requestOptions));
      // console.log(
      //   response.ok ? '\x1b[32m%s\x1b[0m' : '\x1b[31m%s\x1b[0m',
      //   `\nS: ${response.status}, T: ${Date.now() - start}, U: ${url}.`,
      // );
      if (!response.ok) {
        const data = await response.json();
        const errorObj = getErrorObject(
          getErrorString(data),
          response.status,
          response.statusText,
          data,
        );

        console.error(
          `Request failed with url: ${url}\nStatus: ${
            errorObj.error.status
          }\nMessage: ${errorObj.error.message}\n${
            errorObj.error.data
              ? `Data: ${JSON.stringify(errorObj.error.data)}`
              : ''
          }`,
        );
        return errorObj;
        // throw new ApiError(
        //   getErrorObject(
        //     getErrorString(data),
        //     response.status,
        //     response.statusText,
        //     data,
        //   ),
        // );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      // if (error instanceof ApiError) {
      //   return { error };
      // }
      // return { error: new ApiError(getErrorObject(error.message)) };
      return getErrorObject(
        error.message,
        error.status,
        error.statusText,
        error,
      );
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: data });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: data });
  }
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

const clientSideApiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || '/api',
);

export const ovationApiClient = new ApiClient(
  process.env.NEXT_PUBLIC_OVATION_API_URL || '/api',
);

const serverApiClient = (() => {
  const baseUrl = SERVER_CLUSTER_API_URL || '/api';

  if (!IS_PRODUCTION) {
    return clientSideApiClient;
  }
  return new ApiClient(baseUrl);
})();

export const apiClient = isServer() ? serverApiClient : clientSideApiClient;
