import { apiClient } from '@/services/network/api-client';

export async function changePassword(body, locale) {
  try {
    const res = await apiClient.patch('/api/surge/auth/password', body, {
      credentials: 'include',
      headers: {
        lang: locale,
      },
    });
    return res;
  } catch (error) {
    return { error: 'Failed to change the password' };
  }
}
