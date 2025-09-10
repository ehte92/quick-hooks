import { useEffect, useState } from 'react';

/**
 * Custom hook to manage session storage.
 * @param key The key under which to store the data in session storage.
 * @param initialValue The initial value or a function that returns the initial value.
 */
function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T) => void] {
  // Get the initial value from session storage or use a provided initial value
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    // Prevent build error "window is undefined" but keep value in React state
    if (typeof window == 'undefined') {
      console.warn(
        'Tried setting sessionStorage on server. This operation will not persist'
      );
      return;
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save to local state
      setStoredValue(valueToStore);
      // Save to session storage
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  // Listen for changes to session storage and update the state accordingly
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === sessionStorage) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('storage', handleStorageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}

export default useSessionStorage;
