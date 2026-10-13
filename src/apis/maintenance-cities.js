import { appPaths } from '@/constants';
import { apiClient } from '@/services/network/api-client';
import { convertQueryObjToString } from '@/utils/general';

export async function getMaintenanceCenterCities(params, suffixPath) {
  try {
    const res = await apiClient.get(
      `/api/surge/consumer/maintenance_centers/by_location${
        params ? `${convertQueryObjToString(params)}` : ``
      }`,
    );

    return res?.maintainance_centers?.map((data) => ({
      ...data,
      label: data?.title,
      label_l1: data?.title_l1,
      href: suffixPath
        ? `${appPaths.maintenanceCenter}/city/${data?.slug}/${suffixPath}`
        : `${appPaths.maintenanceCenter}/city/${data?.slug}`,
    }));
  } catch (error) {
    return { error: 'Failed to fetch Maintenance Center Brands' };
  }
}
