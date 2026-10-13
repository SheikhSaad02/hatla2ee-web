import { useEffect, useState } from 'react';

import { fetchUserDetail } from '@/apis/user';
import { getCookie } from '@/utils/cookies';
import configs from '@/configs';

export function useGetUserData(userToken) {
  const [user, setUser] = useState(null);
  // userToken ? { accessTokken: userToken } : null,
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUserDetail();
        if (response && !response.error) {
          setUser(response);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const hasAuthCookie = getCookie(configs.authToken) || getCookie(configs.legacyAuthToken);

    if (hasAuthCookie) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { user, loading, setUser };
}
