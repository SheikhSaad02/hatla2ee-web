import { useCallback, useEffect, useState } from 'react';

export function useFetchApi({ fetchFn, initialArgs = [], autoFetch = true }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const refetch = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      const res = await fetchFn(...args);
      if (res) {
        setIsLoading(false);
        if (res.error) {
          setError(res.error);
        } else {
          setData(res);
        }
      }
      return res;
    },
    [fetchFn],
  );

  useEffect(() => {
    if (autoFetch) {
      refetch(...initialArgs);
    }
  }, []);

  return { data, isLoading, error, refetch };
}
