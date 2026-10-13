import configs from '@/configs';
import { cookieDomain } from '@/constants';
import { apiClient } from '@/services/network/api-client';
import { clearCookie, isServer } from '@/utils/general';

export async function fetchUserDetail() {
  let userData = null;
  const res = await apiClient.get('/api/surge/auth/current', {
    credentials: 'include',
    cache: 'no-store',
  });

  if (res?.user) {
    userData = res?.user;
  } else if (res?.error) {
    if (res?.error?.status == 401) {
      if (!isServer()) {
        clearCookie(configs?.authToken);
        // clearCookie(configs?.legacyAuthToken);
      }
    }
    userData = res;
  }
  return userData;
}
