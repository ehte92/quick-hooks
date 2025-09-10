import { useEffect, useState } from 'react';

interface NetworkInformation extends EventTarget {
  rtt: number;
  downlink: number;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
}

interface NetworkState {
  online: boolean;
  since?: Date;
  rtt?: number;
  downlink?: number;
  effectiveType?: string;
}

/**
 * Custom hook to monitor network conditions.
 * @returns The current state of the network.
 */
function useNetworkState(): NetworkState {
  // Function to safely access the connection object
  const getConnection = () => {
    return (navigator as unknown as { connection?: NetworkInformation }).connection || null;
  };

  // Initial state setup using the connection object
  const [networkState, setNetworkState] = useState<NetworkState>(() => {
    const connection = getConnection();
    return {
      online: navigator.onLine,
      since: new Date(),
      ...(connection && {
        rtt: connection.rtt,
        downlink: connection.downlink,
        effectiveType: connection.effectiveType,
      }),
    };
  });

  useEffect(() => {
    // Handler to update the network state
    const handleConnectionChange = () => {
      const connection = getConnection(); // Re-access the connection object
      setNetworkState({
        online: navigator.onLine,
        since: new Date(),
        ...(connection && {
          rtt: connection.rtt,
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
        }),
      });
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    const connection = getConnection();
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return networkState;
}

export default useNetworkState;
