'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { useUser } from '@/providers/user';
import { getPageTypeFromPath, PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { homeClickEvents } from '@/services/analyticsService/events';

export function useSearchAnalytics(
  defaultPageType = 'home',
  pageSection = PAGE_SECTIONS.HERO_SECTION,
) {
  const locale = useLocale();
  const { user } = useUser();
  const pathname = usePathname();
  const pageType = getPageTypeFromPath(pathname);

  const handleSearchOpen = () => {
    homeClickEvents.start_search(
      locale,
      user,
      pageType || defaultPageType,
      pageSection,
    );
  };

  return handleSearchOpen;
}

