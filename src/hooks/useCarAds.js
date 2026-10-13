import { useEffect, useState } from 'react';
import {  useSearchParams } from 'next/navigation';

import { apiClient } from '@/services/network/api-client';
import { useRouter } from '@/i18n/navigation';

export function useCarAds() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/cars${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
        setData(response);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const updateFilters = (newFilters) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    router.push(`?${current.toString()}`);
  };

  return {
    data,
    isLoading,
    error,
    updateFilters,
  };
} 