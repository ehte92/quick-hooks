import { useEffect, useState } from 'react';

interface FetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

const cache = new Map();

/**
 * Custom hook for fetching data with state management and caching.
 * @param url The URL to fetch data from.
 * @param options Optional configuration options for the fetch request.
 * @returns An object containing data, error, and loading state.
 */
function useFetch<T>(url: string, options?: RequestInit): FetchResult<T> {
  const [result, setResult] = useState<FetchResult<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setResult({ data: null, error: null, loading: true });

      // Create a unique cache key based on URL and stringified options
      const cacheKey = JSON.stringify({ url, options });

      if (cache.has(cacheKey)) {
        setResult({ data: cache.get(cacheKey), error: null, loading: false });
        return;
      }

      try {
        const response = await fetch(url, options);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data: T = await response.json();
        cache.set(cacheKey, data); // Cache the data
        setResult({ data, error: null, loading: false });
      } catch (error) {
        setResult({ data: null, error: error as Error, loading: false });
      }
    };

    fetchData();
  }, [url, JSON.stringify(options)]); // Dependency on options as a string to handle object comparison

  return result;
}

export default useFetch;
