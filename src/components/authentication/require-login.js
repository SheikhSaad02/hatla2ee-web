'use client';

import { useUser } from '@/providers/user';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { isLoggedIn } from '@/utils/general';

const RequireLogin = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirectUrl');

  useEffect(() => {
    if (isLoggedIn(user)) {
      router.replace(redirectUrl || '/');
    }
  }, [user, redirectUrl, router]);
  if (!isLoggedIn(user)) {
    return children;
  }
};
export default RequireLogin;
