'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useUser } from './user';
import { isLoggedIn } from '@/utils/general';
import {
  getFavoriteListingIds,
  toggleFavorite as toggleFavoriteApi,
  syncLocalFavoritesToApi,
} from '@/apis/favorites';

const FavoritesContext = createContext(null);
const LOCAL_STORAGE_KEY = 'car_favourite';

export const FavoritesProvider = ({ children }) => {
  const { user, loading: userLoading, showLoginModal } = useUser();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const hasMigratedRef = useRef(false);

  const isUserLoggedIn = isLoggedIn(user);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userLoading) {
        return;
      }

      if (!isUserLoggedIn) {
        setFavoriteIds([]);
        setHasLoaded(true);
        return;
      }

      setIsLoading(true);
      try {
        if (!hasMigratedRef.current && typeof window !== 'undefined') {
          hasMigratedRef.current = true;
          try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            const localIds = stored ? JSON.parse(stored) : [];
            if (Array.isArray(localIds) && localIds.length > 0) {
              const numericIds = localIds.map((id) => Number(id)).filter((n) => !isNaN(n));
              if (numericIds.length > 0) {
                await syncLocalFavoritesToApi(numericIds);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
            }
          } catch (migrationError) {
            console.error('Failed to migrate local favorites to API:', migrationError);
          }
        }

        const response = await getFavoriteListingIds();
        setFavoriteIds(response?.listing_ids || []);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        setFavoriteIds([]);
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    };

    fetchFavorites();
  }, [isUserLoggedIn, userLoading]);

  const isFavorite = useCallback((listingId) => {
    return favoriteIds.includes(Number(listingId));
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (listingId) => {
    if (!isUserLoggedIn) {
      showLoginModal();
      return { requiresLogin: true };
    }

    const numericId = Number(listingId);
    const wasFavorited = favoriteIds.includes(numericId);

    if (wasFavorited) {
      setFavoriteIds((prev) => prev.filter((id) => id !== numericId));
    } else {
      setFavoriteIds((prev) => [numericId, ...prev]);
    }

    try {
      const response = await toggleFavoriteApi(listingId);
      if (response?.error) {
        if (wasFavorited) {
          setFavoriteIds((prev) => [numericId, ...prev]);
        } else {
          setFavoriteIds((prev) => prev.filter((id) => id !== numericId));
        }
        return { error: response.error };
      }
      return { success: true, isFavorited: !wasFavorited };
    } catch (error) {
      if (wasFavorited) {
        setFavoriteIds((prev) => [numericId, ...prev]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== numericId));
      }
      console.error('Failed to toggle favorite:', error);
      return { error };
    }
  }, [isUserLoggedIn, favoriteIds, showLoginModal]);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isLoading,
        hasLoaded,
        isFavorite,
        toggleFavorite,
        totalCount: favoriteIds.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};
