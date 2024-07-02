import { useEffect, useRef, useState } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Custom hook to track visibility of a DOM element within the viewport using the Intersection Observer API.
 * @param options Configuration options for the intersection observer.
 * @returns A tuple containing a ref to attach to the DOM element and the visibility state.
 */
function useIntersectionObserver(
  options?: IntersectionObserverOptions
): [React.RefObject<HTMLDivElement>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        root: options?.root || null,
        rootMargin: options?.rootMargin || '0px',
        threshold: options?.threshold || 0,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options?.root, options?.rootMargin, options?.threshold]); // Ensure the effect reruns only if options change

  return [ref, isVisible];
}

export default useIntersectionObserver;
