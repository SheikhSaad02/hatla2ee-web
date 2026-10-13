'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useUser } from '@/providers/user';
import { isLoggedIn } from '@/utils/general';
import { appPaths } from '@/constants';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading || isLoggedIn(user)) return;

    const query = searchParams.toString();
    const returnPath = query ? `${pathname}?${query}` : pathname;
    router.replace(
      `${appPaths.login}?redirectUrl=${encodeURIComponent(returnPath)}`,
    );
  }, [user, loading, pathname, searchParams, router]);

  return children;
};

export default ProtectedRoute;
