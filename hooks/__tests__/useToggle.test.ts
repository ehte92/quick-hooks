import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useToggle from '../useToggle'

describe('useToggle', () => {
  it('should return initial value of false by default', () => {
    const { result } = renderHook(() => useToggle())
    
    expect(result.current[0]).toBe(false)
    expect(typeof result.current[1]).toBe('function') // toggle function
    expect(typeof result.current[2]).toBe('function') // setValue function
  })

  it('should return custom initial value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('should toggle value from false to true', () => {
    const { result } = renderHook(() => useToggle(false))
    
    expect(result.current[0]).toBe(false)
    
    act(() => {
      result.current[1]() // Call toggle function
    })
    
    expect(result.current[0]).toBe(true)
  })

  it('should toggle value from true to false', () => {
    const { result } = renderHook(() => useToggle(true))
    
    expect(result.current[0]).toBe(true)
    
    act(() => {
      result.current[1]() // Call toggle function
    })
    
    expect(result.current[0]).toBe(false)
  })

  it('should toggle multiple times correctly', () => {
    const { result } = renderHook(() => useToggle(false))
    
    // Initial state
    expect(result.current[0]).toBe(false)
    
    // First toggle
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(true)
    
    // Second toggle
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(false)
    
    // Third toggle
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should set explicit true value', () => {
    const { result } = renderHook(() => useToggle(false))
    
    expect(result.current[0]).toBe(false)
    
    act(() => {
      result.current[2](true) // Call setValue with true
    })
    
    expect(result.current[0]).toBe(true)
  })

  it('should set explicit false value', () => {
    const { result } = renderHook(() => useToggle(true))
    
    expect(result.current[0]).toBe(true)
    
    act(() => {
      result.current[2](false) // Call setValue with false
    })
    
    expect(result.current[0]).toBe(false)
  })

  it('should toggle when setValue called without parameter', () => {
    const { result } = renderHook(() => useToggle(false))
    
    expect(result.current[0]).toBe(false)
    
    act(() => {
      result.current[2]() // Call setValue without parameter
    })
    
    expect(result.current[0]).toBe(true)
  })

  it('should maintain function reference stability', () => {
    const { result, rerender } = renderHook(() => useToggle(false))
    
    const initialToggle = result.current[1]
    const initialSetValue = result.current[2]
    
    // Trigger re-render
    rerender()
    
    // Functions should maintain same reference
    expect(result.current[1]).toBe(initialToggle)
    expect(result.current[2]).toBe(initialSetValue)
  })

  it('should handle rapid toggles', () => {
    const { result } = renderHook(() => useToggle(false))
    
    expect(result.current[0]).toBe(false)
    
    act(() => {
      // Multiple rapid toggles
      result.current[1]()
      result.current[1]()
      result.current[1]()
    })
    
    // Should end up as true (odd number of toggles)
    expect(result.current[0]).toBe(true)
  })

  it('should work with both boolean values', () => {
    // Test with true initial value
    const { result: resultTrue } = renderHook(() => useToggle(true))
    expect(resultTrue.current[0]).toBe(true)
    
    // Test with false initial value
    const { result: resultFalse } = renderHook(() => useToggle(false))
    expect(resultFalse.current[0]).toBe(false)
    
    // Test with default (should be false)
    const { result: resultDefault } = renderHook(() => useToggle())
    expect(resultDefault.current[0]).toBe(false)
  })
})