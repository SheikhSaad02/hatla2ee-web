import { apiClient } from '@/services/network/api-client';

export async function signIn(body, locale) {
  try {
    const res = await apiClient.post(
      '/api/surge/auth/login',
      JSON.stringify(body),
      {
        credentials: 'include',
        headers: {
          lang: locale,
        },
      },
    );
    return res;
  } catch (error) {
    return { error: 'Failed to fetch Response' };
  }
}
