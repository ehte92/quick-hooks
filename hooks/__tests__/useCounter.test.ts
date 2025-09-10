import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useCounter from '../useCounter'

describe('useCounter', () => {
  it('should initialize with default value of 0', () => {
    const { result } = renderHook(() => useCounter())
    
    expect(result.current.count).toBe(0)
    expect(typeof result.current.increment).toBe('function')
    expect(typeof result.current.decrement).toBe('function')
    expect(typeof result.current.reset).toBe('function')
    expect(typeof result.current.set).toBe('function')
  })

  it('should initialize with custom initial value', () => {
    const { result } = renderHook(() => useCounter(5))
    expect(result.current.count).toBe(5)
  })

  it('should increment by default step of 1', () => {
    const { result } = renderHook(() => useCounter(0))
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })

  it('should decrement by default step of 1', () => {
    const { result } = renderHook(() => useCounter(5))
    
    act(() => {
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(4)
  })

  it('should increment with custom step', () => {
    const { result } = renderHook(() => useCounter(0, { step: 3 }))
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(3)
  })

  it('should decrement with custom step', () => {
    const { result } = renderHook(() => useCounter(10, { step: 3 }))
    
    act(() => {
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(7)
  })

  it('should respect minimum boundary', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }))
    
    act(() => {
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(0) // Should not go below min
  })

  it('should respect maximum boundary', () => {
    const { result } = renderHook(() => useCounter(9, { max: 10 }))
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(10)
    
    // Try to increment again - should stay at max
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(10)
  })

  it('should respect both min and max boundaries', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }))
    
    // Test max boundary
    act(() => {
      result.current.set(15) // Try to set above max
    })
    expect(result.current.count).toBe(10)
    
    // Test min boundary
    act(() => {
      result.current.set(-5) // Try to set below min
    })
    expect(result.current.count).toBe(0)
  })

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(7))
    
    // Change the value
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(8)
    
    // Reset should bring it back to initial
    act(() => {
      result.current.reset()
    })
    expect(result.current.count).toBe(7)
  })

  it('should set specific value within boundaries', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0, max: 100 }))
    
    act(() => {
      result.current.set(50)
    })
    expect(result.current.count).toBe(50)
  })

  it('should handle multiple increments', () => {
    const { result } = renderHook(() => useCounter(0))
    
    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.increment()
    })
    
    expect(result.current.count).toBe(3)
  })

  it('should handle multiple decrements', () => {
    const { result } = renderHook(() => useCounter(10))
    
    act(() => {
      result.current.decrement()
      result.current.decrement()
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(7)
  })

  it('should handle mixed increment and decrement operations', () => {
    const { result } = renderHook(() => useCounter(5))
    
    act(() => {
      result.current.increment() // 6
      result.current.increment() // 7
      result.current.decrement() // 6
      result.current.increment() // 7
      result.current.decrement() // 6
      result.current.decrement() // 5
    })
    
    expect(result.current.count).toBe(5)
  })

  it('should maintain function reference stability', () => {
    const { result, rerender } = renderHook(() => useCounter(0))
    
    const initialIncrement = result.current.increment
    const initialDecrement = result.current.decrement
    const initialReset = result.current.reset
    const initialSet = result.current.set
    
    // Trigger re-render
    rerender()
    
    // Functions should maintain same reference
    expect(result.current.increment).toBe(initialIncrement)
    expect(result.current.decrement).toBe(initialDecrement)
    expect(result.current.reset).toBe(initialReset)
    expect(result.current.set).toBe(initialSet)
  })

  it('should handle large steps correctly', () => {
    const { result } = renderHook(() => useCounter(0, { step: 100 }))
    
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(100)
    
    act(() => {
      result.current.decrement()
    })
    expect(result.current.count).toBe(0)
  })

  it('should handle fractional steps', () => {
    const { result } = renderHook(() => useCounter(0, { step: 0.5 }))
    
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(0.5)
    
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
  })

  it('should handle negative initial values', () => {
    const { result } = renderHook(() => useCounter(-5))
    
    expect(result.current.count).toBe(-5)
    
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(-4)
    
    act(() => {
      result.current.reset()
    })
    expect(result.current.count).toBe(-5)
  })

  it('should handle complex boundary scenarios', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10, step: 3 }))
    
    // Increment twice (5 -> 8 -> 10)
    act(() => {
      result.current.increment() // 5 + 3 = 8
    })
    expect(result.current.count).toBe(8)
    
    act(() => {
      result.current.increment() // 8 + 3 = 11, but max is 10
    })
    expect(result.current.count).toBe(10)
    
    // Decrement multiple times
    act(() => {
      result.current.decrement() // 10 - 3 = 7
    })
    expect(result.current.count).toBe(7)
    
    act(() => {
      result.current.decrement() // 7 - 3 = 4
    })
    expect(result.current.count).toBe(4)
    
    act(() => {
      result.current.decrement() // 4 - 3 = 1
    })
    expect(result.current.count).toBe(1)
    
    act(() => {
      result.current.decrement() // 1 - 3 = -2, but min is 0
    })
    expect(result.current.count).toBe(0)
  })

  it('should work without any options', () => {
    const { result } = renderHook(() => useCounter(10, {}))
    
    expect(result.current.count).toBe(10)
    
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(11)
    
    act(() => {
      result.current.decrement()
    })
    expect(result.current.count).toBe(10)
  })
})