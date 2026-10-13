/**
 * KSA tenant cache configuration
 * Uses common cache routes shared across all non-EG tenants
 */

import { commonCacheRoutes } from '../../common/cache/common.js';

/**
 * KSA-specific cache routes
 * Add any KSA-only routes here
 */
const ksaSpecificRoutes = [];

/**
 * KSA cache routes
 * Combines common routes with KSA-specific routes
 */
export const ksaCacheRoutes = [...commonCacheRoutes, ...ksaSpecificRoutes];
