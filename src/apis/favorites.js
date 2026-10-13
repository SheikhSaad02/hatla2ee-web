import { apiClient } from '@/services/network/api-client';

const PLATFORM_SLUG = 'hatla2ee';
export async function toggleFavorite(listingId) {
  const response = await apiClient.put(
    '/api/surge/consumer/favourites/toggle/',
    {
      listing_id: Number(listingId),
      platform_slug: PLATFORM_SLUG,
    },
    {
      credentials: 'include',
    },
  );

  return response;
}

export async function getFavoriteListingIds() {
  const response = await apiClient.get(
    `/api/surge/consumer/favourites/listing_ids?platform_slug=${PLATFORM_SLUG}`,
    {
      credentials: 'include',
      cache: 'no-store',
    },
  );

  return response;
}

export async function syncLocalFavoritesToApi(localFavoriteIds) {
  const failed = [];

  for (const listingId of localFavoriteIds) {
    try {
      const response = await toggleFavorite(listingId);
      if (response?.error) {
        failed.push(listingId);
      }
    } catch (error) {
      console.error(`Failed to sync favorite ${listingId}:`, error);
      failed.push(listingId);
    }
  }

  return {
    success: failed.length === 0,
    failed,
  };
}
