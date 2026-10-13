'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

const RequireAuth = ({ params = [], children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get('user_id');
  const token = searchParams?.get('token');
  const missingParam = params.some((param) => !searchParams?.get(param));

  useEffect(() => {
    if (missingParam) {
      router.replace('/login');
    }
  }, [params]);
  if (userId || token) return children;
};

export default RequireAuth;
