import { apiClient } from '@/services/network/api-client';

export async function fetchComparisonDetail(params) {
  const { id, listing_ids } = params;

  let url = '/api/surge/consumer/comparisons/detail';
  const queryParams = new URLSearchParams();

  if (id) {
    queryParams.append('id', id);
  }

  if (listing_ids && Array.isArray(listing_ids)) {
    listing_ids.forEach((listingId) => {
      queryParams.append('listing_ids[]', listingId);
    });
  }

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const res = await apiClient.get(url);
  return res;
}
