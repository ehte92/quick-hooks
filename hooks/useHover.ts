import { useState, useCallback } from 'react';

/**
 * Custom hook for detecting hover state on an element.
 * @returns A tuple containing a callback ref to attach to the DOM element and the hover state.
 */
function useHover<T extends HTMLElement = HTMLDivElement>(): [(node: T | null) => void, boolean] {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const ref = useCallback((node: T | null) => {
    if (node !== null) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
    }
  }, [handleMouseEnter, handleMouseLeave]);

  return [ref, isHovered];
}

export default useHover;