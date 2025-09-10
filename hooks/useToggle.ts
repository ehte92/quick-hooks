import { useCallback, useState } from 'react';

/**
 * Custom hook for managing boolean state with toggle functionality.
 * @param initialValue The initial boolean value (defaults to false).
 * @returns A tuple containing the current boolean state, a toggle function, and a setValue function.
 */
function useToggle(
  initialValue = false
): [boolean, () => void, (value?: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setToggleValue = useCallback((newValue?: boolean) => {
    if (typeof newValue === 'boolean') {
      setValue(newValue);
    } else {
      setValue((prev) => !prev);
    }
  }, []);

  return [value, toggle, setToggleValue];
}

export default useToggle;