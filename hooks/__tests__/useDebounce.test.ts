import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDebounce from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should return initial value before delay has passed', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })
    
    // Should still show initial value before delay
    expect(result.current).toBe('initial')
  })

  it('should update value after delay has passed', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // Update the value
    rerender({ value: 'updated', delay: 500 })
    
    // Fast forward time inside act
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('updated')
  })

  it('should cancel previous timer on rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    )

    // First update
    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('first')

    // Second update before first completes
    rerender({ value: 'third' })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('first') // Still first

    // Complete the delay for the latest update
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('third') // Should skip 'second'
  })

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    )

    rerender({ value: 'updated', delay: 200 })
    
    // Fast forward by 200ms
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('updated')
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    )

    rerender({ value: 'updated', delay: 0 })
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(result.current).toBe('updated')
  })

  it('should handle object values', () => {
    const initialObj = { count: 0 }
    const updatedObj = { count: 1 }
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 500 } }
    )

    expect(result.current).toBe(initialObj)

    rerender({ value: updatedObj, delay: 500 })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe(updatedObj)
  })

  it('should cleanup timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})