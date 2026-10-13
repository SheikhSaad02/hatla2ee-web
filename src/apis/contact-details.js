import { CONTACT_DETAILS_ENDPOINT } from '@/constants';
import { apiClient } from '@/services/network/api-client';
import { getRecaptchaTokenHeader } from '@/utils/general';

export async function getContactDetails(listingId, token, locale) {
  const res = await apiClient.get(CONTACT_DETAILS_ENDPOINT(listingId), {
    headers: {
      ...getRecaptchaTokenHeader(token),
      lang: locale,
    },
    credentials: 'include',
  });
  return res;
}
