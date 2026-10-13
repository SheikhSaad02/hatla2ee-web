/**
 * Common cache configuration
 * Merges all tenant cache configs and provides utility functions
 */

import { egCacheRoutes } from '../../eg/cache/index.js';
import { ksaCacheRoutes } from '../../ksa/cache/index.js';
import { uaeCacheRoutes } from '../../uae/cache/index.js';
import { jordanCacheRoutes } from '../../jordan/cache/index.js';
import { qatarCacheRoutes } from '../../qatar/cache/index.js';
import { omanCacheRoutes } from '../../oman/cache/index.js';
import { kuwaitCacheRoutes } from '../../kuwait/cache/index.js';
import { tenant as TENANT } from '../../../configs/index.js';

// Map of tenant-specific cache routes
const tenantCacheRoutes = {
  eg: egCacheRoutes,
  ksa: ksaCacheRoutes,
  uae: uaeCacheRoutes,
  jordan: jordanCacheRoutes,
  qatar: qatarCacheRoutes,
  oman: omanCacheRoutes,
  kuwait: kuwaitCacheRoutes,
};

/**
 * Get cache headers for a specific tenant
 * Returns tenant-specific routes only
 * @param {string} tenant - The tenant name (eg, ksa, uae, etc.)
 * @returns {Array} Array of cache header configurations for the tenant
 */
export function getCacheHeadersForTenant(tenant = TENANT) {
  return tenantCacheRoutes[tenant] || [];
}
