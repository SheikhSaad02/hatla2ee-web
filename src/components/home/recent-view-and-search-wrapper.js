'use client';
import { useEffect } from 'react';
import RecentlyViewedAndSearched from './recently-viewed-and-searched';
import { useRecentlyViewedAndSearched } from '@/hooks/useRecentlyViewedAndSearched';
import { RecentlyViewedAndSearchedSkeleton } from './recent-view-and-search-wrapper-skeleton';
import { useIsMobile } from '@/providers/isMobile';

export default function RecentlyViewedAndSearchedWrapper({
  locale,
  threshold = 2,
  isMobile: isMobileProp,
}) {
  const { recentAds, recentSearches, isLoading, viewed, searched } =
    useRecentlyViewedAndSearched();

  const isMobileFromContext = useIsMobile();
  const isMob = isMobileProp ?? isMobileFromContext ?? false;

  useEffect(() => {
    if (!isLoading) {
      const skeleton = document.getElementById('recently-viewed-skeleton');
      if (skeleton) {
        skeleton.style.display = 'none';
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <RecentlyViewedAndSearchedSkeleton isMobile={isMob} />;
  }

  return (
    recentAds?.length >= threshold &&
    Object.keys(recentSearches)?.length >= threshold && (
      <RecentlyViewedAndSearched
        recentlyViewed={recentAds}
        recentlySearched={recentSearches}
        locale={locale}
        isMobile={isMob}
      />
    )
  );
}
