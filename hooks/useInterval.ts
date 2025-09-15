import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for managing intervals with automatic cleanup and control functions.
 * @param callback Function to execute on each interval
 * @param delay Delay in milliseconds (null to pause the interval)
 * @returns Object with start, stop, reset functions and isActive state
 */
function useInterval(
  callback: () => void,
  delay: number | null
): {
  start: () => void;
  stop: () => void;
  reset: () => void;
  isActive: boolean;
} {
  const savedCallback = useRef<() => void>(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsActive(false);
    }
  }, []);

  const start = useCallback(() => {
    stop(); // Clear any existing interval
    if (delay !== null) {
      intervalRef.current = setInterval(() => {
        savedCallback.current();
      }, delay);
      setIsActive(true);
    }
  }, [delay, stop]);

  const reset = useCallback(() => {
    start();
  }, [start]);

  // Set up the interval when delay changes
  useEffect(() => {
    if (delay !== null) {
      start();
      return stop;
    } else {
      stop();
    }
  }, [delay, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, reset, isActive };
}

export default useInterval;