'use client';
import { useEffect, useRef } from 'react';
import { useUser } from '@/providers/user';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { trackPageView } from './events';

export default function PageViewTracker({
  pageType = '',
  websiteSection = '',
}) {
  const { user } = useUser();
  const locale = useLocale();
  const pathname = usePathname();
  const firedRef = useRef(null);

  useEffect(() => {
    if (firedRef.current !== pathname) {
      trackPageView(locale, user, pageType, websiteSection);
      firedRef.current = pathname;
    }
  }, [pathname]);

  return null;
}
