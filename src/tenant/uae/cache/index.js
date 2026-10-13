/**
 * UAE tenant cache configuration
 * Uses common cache routes shared across all non-EG tenants
 */

import { commonCacheRoutes } from '../../common/cache/common.js';

/**
 * UAE-specific cache routes
 * Add any UAE-only routes here
 */
const uaeSpecificRoutes = [];

/**
 * UAE cache routes
 * Combines common routes with UAE-specific routes
 */
export const uaeCacheRoutes = [...commonCacheRoutes, ...uaeSpecificRoutes];
