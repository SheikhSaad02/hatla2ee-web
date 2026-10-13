/**
 * Kuwait tenant cache configuration
 * Uses common cache routes shared across all non-EG tenants
 */

import { commonCacheRoutes } from '../../common/cache/common.js';

/**
 * Kuwait-specific cache routes
 * Add any Kuwait-only routes here
 */
const kuwaitSpecificRoutes = [];

/**
 * Kuwait cache routes
 * Combines common routes with Kuwait-specific routes
 */
export const kuwaitCacheRoutes = [
  ...commonCacheRoutes,
  ...kuwaitSpecificRoutes,
];
