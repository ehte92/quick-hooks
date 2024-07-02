import { useEffect, useRef } from 'react';

/**
 * Custom hook to get the previous value of a state or prop.
 * @param value The value whose previous instance you want to track.
 * @returns The previous value of the specified parameter.
 */
function usePrevious<T>(value: T): T | undefined {
  // useRef to hold the previous value, initialized as undefined
  const ref = useRef<T>();

  useEffect(() => {
    // Store current value in ref
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (will be `undefined` on first render)
  return ref.current;
}

export default usePrevious;
