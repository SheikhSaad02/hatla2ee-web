import { apiClient } from '@/services/network/api-client';

export async function getMaintenanceCenterLocations(id) {
  const res = await apiClient.get(
    `/api/surge/consumer/maintenance_centers/${id}`,
  );
  return res;
}
