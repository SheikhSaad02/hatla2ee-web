import { apiClient } from '@/services/network/api-client';
import { IMAGES_BASE_URL } from '@/constants';
import configs from '@/configs';
export async function fetchMakeInfo(make) {
  const response = await apiClient.get(
    `/api/surge/consumer/makes/detail?slug=${make}`,
  );

  const makeData = response?.make || {};

  return response?.error
    ? response
    : {
        ...makeData,
        ...(!configs.USE_BRAND_SPRITE && {
          src: `${IMAGES_BASE_URL}/${makeData?.slug}/thumbnail.png`,
        }),
      };
}
