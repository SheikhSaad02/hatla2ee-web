import { appPaths } from '@/constants';
import { apiClient } from '@/services/network/api-client';
import { convertQueryObjToString } from '@/utils/general';

export async function getMaintenanceCenterData(page, make, location) {
  try {
    const params = {
      page: page || 1,
      per_page: 32,
      ...(make && { 'f[make_slug]': make }),
      ...(location && { 'f[location_slug]': decodeURIComponent(location) }),
    };
    const res = await apiClient.get(
      `/api/surge/consumer/maintenance_centers${convertQueryObjToString(
        params,
      )}`,
    );

    return {
      maintenanceCenters: res?.maintenance_centers?.map((data) => ({
        ...data,
        title: data?.name,
        title_l1: data?.name_l1,
        href: `${appPaths.maintenanceCenter}/${data?.slug}/${data?.id}`,
        phone: { call: data?.mobile },
        image: data?.logo,
      })),
      pagination: res?.pagination,
      ...(res?.make && { make: res?.make }),
      ...(res?.location && { location: res?.location }),
    };
  } catch (error) {
    return { error: 'Failed to fetch Maintenance Center Brands' };
  }
}
