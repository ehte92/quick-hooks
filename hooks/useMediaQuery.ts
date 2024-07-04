import { useEffect, useState } from 'react';

/**
 * Custom hook to subscribe and respond to media query changes.
 * @param query The media query string you want to monitor.
 * @returns A boolean indicating if the media query matches.
 */
function useMediaQuery(query: string): boolean {
  // State to store whether the media query matches or not
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Function to evaluate the media query and update state
    const mediaQuery = window.matchMedia(query);
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Initial check
    setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaChange);

    // Cleanup function to remove the event listener
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [query]); // Re-run effect when query changes

  return matches;
}

export default useMediaQuery;
