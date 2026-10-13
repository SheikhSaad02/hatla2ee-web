/**
 * Oman tenant cache configuration
 * Uses common cache routes shared across all non-EG tenants
 */

import { commonCacheRoutes } from '../../common/cache/common.js';

/**
 * Oman-specific cache routes
 * Add any Oman-only routes here
 */
const omanSpecificRoutes = [];

/**
 * Oman cache routes
 * Combines common routes with Oman-specific routes
 */
export const omanCacheRoutes = [...commonCacheRoutes, ...omanSpecificRoutes];
