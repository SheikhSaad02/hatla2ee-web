import { apiClient } from '@/services/network/api-client';
import { getRecaptchaTokenHeader } from '@/utils/general';

export async function verifyUserAccount(body, token, locale) {
  try {
    const res = await apiClient.post('/api/surge/auth/password', body, {
      headers: {
        ...getRecaptchaTokenHeader(token),
        lang: locale,
      },
    });
    return res;
  } catch (error) {
    return { error: "Failed to verify user's account" };
  }
}
