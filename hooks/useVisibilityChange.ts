import { useEffect, useState } from 'react';

/**
 * Custom hook to track the visibility state of the document.
 * @returns A boolean indicating whether the document is currently visible.
 */
function useVisibilityChange(): boolean {
  const [isVisible, setIsVisible] = useState(
    document.visibilityState === 'visible'
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

export default useVisibilityChange;
