import { useEffect, useState } from 'react';

interface OrientationState {
  angle: number;
  type:
    | 'portrait-primary'
    | 'portrait-secondary'
    | 'landscape-primary'
    | 'landscape-secondary'
    | undefined;
}

/**
 * Custom hook to manage and respond to changes in device orientation.
 * @returns The current orientation state of the device.
 */
function useOrientation(): OrientationState {
  const [orientation, setOrientation] = useState<OrientationState>({
    angle: window.screen.orientation.angle,
    type: window.screen.orientation.type as
      | 'portrait-primary'
      | 'portrait-secondary'
      | 'landscape-primary'
      | 'landscape-secondary',
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation({
        angle: window.screen.orientation.angle,
        type: window.screen.orientation.type as
          | 'portrait-primary'
          | 'portrait-secondary'
          | 'landscape-primary'
          | 'landscape-secondary',
      });
    };

    window.screen.orientation.addEventListener(
      'change',
      handleOrientationChange
    );

    // Cleanup function to remove event listener
    return () => {
      window.screen.orientation.removeEventListener(
        'change',
        handleOrientationChange
      );
    };
  }, []);

  return orientation;
}

export default useOrientation;
