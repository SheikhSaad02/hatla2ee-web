import { cache } from 'react';
import { apiClient } from '@/services/network/api-client';
import { apiCacheConfig } from '@/configs/cacheConfig';
import { mapCreditPackages, mapProductPricing } from '@/mappers/packages';

export const fetchCreditPackages = cache(async () => {
  const response = await apiClient.get('/api/surge/public/packages', {
    next: apiCacheConfig.creditPackages,
  });

  return mapCreditPackages(response);
});

export const fetchProductDiscounts = cache(async () => {
  const response = await apiClient.get(
    '/api/surge/public/packages/product_discounts',
    { next: apiCacheConfig.creditPackages },
  );

  return mapProductPricing(response);
});
