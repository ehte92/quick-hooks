import { useState, useEffect, useCallback, useRef } from 'react';

export interface GeolocationState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
}

interface UseGeolocationReturn extends GeolocationState {
  refresh: () => void;
  watchId: number | null;
}

/**
 * Custom hook for accessing geolocation data with automatic error handling.
 * @param options PositionOptions for geolocation API
 * @param watch Whether to watch position for real-time updates (default: false)
 * @returns Geolocation state and refresh function
 */
function useGeolocation(
  options?: PositionOptions,
  watch: boolean = false
): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);
  const isWatchingRef = useRef<boolean>(false);

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      loading: false,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      error: null,
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    setState(prev => ({
      ...prev,
      loading: false,
      error,
    }));
  }, []);

  const refresh = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      onError({
        code: 2,
        message: 'Geolocation is not supported by this browser.',
      } as GeolocationPositionError);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    if (watch && !isWatchingRef.current) {
      // Start watching position
      // eslint-disable-next-line sonarjs/no-intrusive-permissions
      watchIdRef.current = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        options
      );
      isWatchingRef.current = true;
    } else if (!watch) {
      // Get current position once
      // eslint-disable-next-line sonarjs/no-intrusive-permissions
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
  }, [onSuccess, onError, options, watch]);

  // Initial fetch and setup
  useEffect(() => {
    refresh();

    // Cleanup function
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation?.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        isWatchingRef.current = false;
      }
    };
  }, [refresh]);

  // Handle watch parameter changes
  useEffect(() => {
    if (!watch && watchIdRef.current !== null) {
      // Stop watching if watch is disabled
      navigator.geolocation?.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      isWatchingRef.current = false;
    } else if (watch && !isWatchingRef.current) {
      // Start watching if watch is enabled and not already watching
      refresh();
    }
  }, [watch, refresh]);

  return {
    ...state,
    refresh,
    watchId: watchIdRef.current,
  };
}

export default useGeolocation;