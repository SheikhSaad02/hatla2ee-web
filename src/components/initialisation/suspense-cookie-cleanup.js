'use client';

import { useEffect } from 'react';
import { setCookie } from '@/utils/cookies';
import { COOKIE_NAMES } from '@/constants';

const SuspenseCookieCleanup = () => {
  useEffect(() => {
    // Clear suspense navigation cookie on mount (page reload)
    setCookie(COOKIE_NAMES.SUSPENSE_NAVIGATION, 'false');
  }, []);

  return null;
};

export default SuspenseCookieCleanup;

