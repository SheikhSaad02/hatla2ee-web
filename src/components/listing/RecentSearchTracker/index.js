'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { removePageFromUrl } from '@/utils/general';

export default function RecentSearchTracker({ filters }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const cleanedPathname = cleanPathname(pathname, searchParams);
    const { page, ...restFilters } = filters || {};
    if (restFilters) {
      saveRecentSearch({ ...restFilters, pathname: cleanedPathname });
    }
  }, [filters, pathname, searchParams]);

  const cleanPathname = (pathname, searchParams) => {
    const cleanedPath = removePageFromUrl(pathname);
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.delete('page');

    const queryString = updatedParams.toString();
    return `${cleanedPath}${queryString ? `?${queryString}` : ''}`;
  };

  const saveRecentSearch = (newSearch) => {
    try {
      const existingSearches = JSON.parse(
        localStorage.getItem('recentSearches') || '{}',
      );

      const { make, model } = newSearch;

      if (!make?.slug || !model?.slug) {
        return;
      }

      const key = `${make.slug}-${model.slug}`;
      const payload = {
        ...newSearch,
        timestamp: Date.now(),
      };

      if (existingSearches[key]) {
        existingSearches[key] = payload;
        localStorage.setItem(
          'recentSearches',
          JSON.stringify(existingSearches),
        );
        return;
      }

      if (Object.keys(existingSearches).length >= 5) {
        const oldestKey = Object.keys(existingSearches).reduce(
          (oldest, current) => {
            return existingSearches[current].timestamp <
              existingSearches[oldest].timestamp
              ? current
              : oldest;
          },
        );
        delete existingSearches[oldestKey];
      }

      existingSearches[key] = payload;

      localStorage.setItem('recentSearches', JSON.stringify(existingSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  return null;
}
