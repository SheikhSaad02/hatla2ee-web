import { apiClient } from '@/services/network/api-client';
import { getRecaptchaTokenHeader } from '@/utils/general';

export async function signUp(body, token, locale) {
  const res = await apiClient.post(
    '/api/surge/auth/register',
    JSON.stringify(body),
    {
      headers: {
        ...getRecaptchaTokenHeader(token),
        lang: locale,
      },
      credentials: 'include',
    },
  );
  return res;
}
