import { apiClient } from '@/services/network/api-client';

export async function logout() {
  const res = await apiClient.post(
    '/api/surge/auth/logout',
    {},
    {
      credentials: 'include',
    },
  );

  return res;
}
