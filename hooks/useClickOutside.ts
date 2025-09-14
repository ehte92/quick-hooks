import { useEffect, useRef } from 'react';

/**
 * Custom hook for detecting clicks outside of a specified element.
 * @param callback Function to call when clicking outside the element
 * @returns A ref to attach to the DOM element you want to monitor
 */
function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;