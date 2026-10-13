/**
 * Qatar tenant cache configuration
 * Uses common cache routes shared across all non-EG tenants
 */

import { commonCacheRoutes } from '../../common/cache/common.js';

/**
 * Qatar-specific cache routes
 * Add any Qatar-only routes here
 */
const qatarSpecificRoutes = [];

/**
 * Qatar cache routes
 * Combines common routes with Qatar-specific routes
 */
export const qatarCacheRoutes = [...commonCacheRoutes, ...qatarSpecificRoutes];
