import { useEffect, useState } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Custom hook for tracking the size of the browser window.
 * @returns The current width and height of the window.
 */
function useWindowSize(): WindowSize {
  // Initialize state with undefined so we can check for server-side rendering
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window size
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default useWindowSize;
