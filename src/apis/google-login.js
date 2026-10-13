import { apiClient } from '@/services/network/api-client';

export async function googleLogin(body) {
  const res = await apiClient.post(
    '/api/surge/auth/google_login',
    JSON.stringify(body),
    {
      credentials: 'include',
    },
  );
  return res;
}
