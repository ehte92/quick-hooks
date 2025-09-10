import { useCallback, useState } from 'react';

interface CounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

interface CounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
}

/**
 * Custom hook for managing counter state with increment, decrement, and boundary controls.
 * @param initialValue The initial counter value (defaults to 0).
 * @param options Configuration options for min, max, and step values.
 * @returns An object with count state and control functions.
 */
function useCounter(
  initialValue = 0,
  options: CounterOptions = {}
): CounterReturn {
  const { min, max, step = 1 } = options;
  
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => {
      const newValue = prev + step;
      if (max !== undefined && newValue > max) {
        return max;
      }
      return newValue;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const newValue = prev - step;
      if (min !== undefined && newValue < min) {
        return min;
      }
      return newValue;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value: number) => {
    setCount((_prev) => {
      let newValue = value;
      
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      
      return newValue;
    });
  }, [min, max]);

  return {
    count,
    increment,
    decrement,
    reset,
    set,
  };
}

export default useCounter;