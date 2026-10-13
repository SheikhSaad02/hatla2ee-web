/**
 * Jordan tenant cache configuration
 * Uses common cache routes shared across all non-EG tenants
 */

import { commonCacheRoutes } from '../../common/cache/common.js';

/**
 * Jordan-specific cache routes
 * Add any Jordan-only routes here
 */
const jordanSpecificRoutes = [];

/**
 * Jordan cache routes
 * Combines common routes with Jordan-specific routes
 */
export const jordanCacheRoutes = [
  ...commonCacheRoutes,
  ...jordanSpecificRoutes,
];
