import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing timeouts with automatic cleanup.
 * @param callback Function to execute after the timeout
 * @param delay Delay in milliseconds (null to pause the timeout)
 * @returns Object with start, stop, and reset functions
 */
function useTimeout(
  callback: () => void,
  delay: number | null
): {
  start: () => void;
  stop: () => void;
  reset: () => void;
} {
  const savedCallback = useRef<() => void>(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop(); // Clear any existing timeout
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => {
        savedCallback.current();
        timeoutRef.current = null;
      }, delay);
    }
  }, [delay, stop]);

  const reset = useCallback(() => {
    start();
  }, [start]);

  // Set up the timeout
  useEffect(() => {
    if (delay !== null) {
      start();
      return stop;
    }
  }, [delay, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, reset };
}

export default useTimeout;