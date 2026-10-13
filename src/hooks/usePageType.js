'use client';

import { usePathname } from '@/i18n/navigation';
import { getPageTypeFromPath } from '@/services/analyticsService/constants';

export function usePageType(defaultPageType = 'home') {
  const pathname = usePathname();
  const pageType = getPageTypeFromPath(pathname);
  return pageType || defaultPageType;
}

