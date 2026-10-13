import { apiClient } from '@/services/network/api-client';

const getQueryParamKey = (type) => {
  switch (type) {
    case 'authorized':
      return 'f[authorized]=true';
    case 'featured':
      return 'f[featured]=true';
    case 'new':
      return 'f[deals_in][]=new_car&f[deals_in][]=both&f[authorized]=false';
    case 'used':
    default:
      return 'f[deals_in][]=used_car&f[deals_in][]=both&f[authorized]=false';
  }
};
export async function fetchDealersData(type, extraQuery = '', options = {}) {
  const parts = ['page=1', 'per_page=10'];
  if (type) parts.push('sort[listing_count]=desc', getQueryParamKey(type));
  if (extraQuery) parts.push(extraQuery);

  const response = await apiClient.get(
    `/api/surge/consumer/agencies?${parts.join('&')}`,
    options,
  );
  return response;
}
