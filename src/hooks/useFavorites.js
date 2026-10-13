'use client';

import { ListingsService } from '@/services/elasticsearch/listings-service';
import { useFavoritesContext } from '@/providers/favorites';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 24;

export const useFavorites = (currentPage = 1) => {
  const { favoriteIds, isLoading: contextLoading, hasLoaded } = useFavoritesContext();
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalCount = favoriteIds.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    const getCarAds = async () => {
      if (!hasLoaded) return;

      setIsLoading(true);

      if (favoriteIds.length > 0) {
        try {
          const startIndex = (currentPage - 1) * PAGE_SIZE;
          const endIndex = startIndex + PAGE_SIZE;
          const paginatedIds = favoriteIds.slice(startIndex, endIndex);

          if (paginatedIds.length > 0) {
            const response = await ListingsService.getAdsByIds(paginatedIds);
            setFavoriteCars(response || []);
          } else {
            setFavoriteCars([]);
          }
        } catch (error) {
          console.error('Failed to fetch favorite cars', error);
          setFavoriteCars([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFavoriteCars([]);
        setIsLoading(false);
      }
    };

    getCarAds();
  }, [favoriteIds, hasLoaded, currentPage]);

  return {
    favoriteIds,
    favoriteCars,
    isLoading: isLoading || contextLoading,
    totalCount,
    totalPages,
    currentPage,
    pageSize: PAGE_SIZE
  };
};
