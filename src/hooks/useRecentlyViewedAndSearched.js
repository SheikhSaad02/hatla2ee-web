'use client';

import { useEffect, useState } from 'react';

import { ListingsService } from '@/services/elasticsearch/listings-service';
import { useFetchApi } from './useFetchApi';

export const useRecentlyViewedAndSearched = () => {
  const viewed =
    typeof localStorage !== 'undefined'
      ? JSON.parse(localStorage?.getItem('car_last_visit') || 'null')
      : null;

  const searched =
    typeof localStorage !== 'undefined'
      ? JSON.parse(localStorage?.getItem('recentSearches') || 'null')
      : null;

  const [recentSearches, setRecentSearches] = useState({});
  const {
    data: recentAds,
    refetch: getRecentAds,
    isLoading,
  } = useFetchApi({
    fetchFn: ListingsService.getAdsByIds,
    initialArgs: [viewed],
    autoFetch: false,
  });

  useEffect(() => {
    if (viewed?.length) {
      getRecentAds(viewed);
    }
    if (searched) {
      setRecentSearches(searched);
    }
  }, []);

  return { recentAds, recentSearches, isLoading, viewed, searched };
};
