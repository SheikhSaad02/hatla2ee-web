import { appPaths } from '@/constants';
import { apiClient } from '@/services/network/api-client';

export async function getMaintenanceCenterBrands(params, prefixPath) {
  try {
    const res = await apiClient.get(
      `/api/surge/consumer/maintenance_centers/by_make${
        params?.location_slug
          ? `?f[location_slug]=${params?.location_slug}`
          : ``
      }`,
    );

    return res?.maintainance_centers?.map((data) => ({
      ...data,
      label: data?.title,
      label_l1: data?.title_l1,
      href: prefixPath
        ? `${appPaths.maintenanceCenter}/${prefixPath}brand/${data?.slug}`
        : `${appPaths.maintenanceCenter}/brand/${data?.slug}`,
    }));
  } catch (error) {
    return { error: 'Failed to fetch Maintenance Center Brands' };
  }
}
