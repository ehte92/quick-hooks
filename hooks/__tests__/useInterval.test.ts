import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useInterval from '../useInterval'

describe('useInterval', () => {
  let mockCallback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    mockCallback = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should return start, stop, reset functions and isActive state', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    expect(typeof result.current.start).toBe('function')
    expect(typeof result.current.stop).toBe('function')
    expect(typeof result.current.reset).toBe('function')
    expect(typeof result.current.isActive).toBe('boolean')
  })

  it('should start interval automatically with valid delay', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    expect(result.current.isActive).toBe(true)
    expect(mockCallback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(2)
  })

  it('should not start interval when delay is null', () => {
    const { result } = renderHook(() => useInterval(mockCallback, null))

    expect(result.current.isActive).toBe(false)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should execute callback repeatedly at specified interval', () => {
    renderHook(() => useInterval(mockCallback, 500))

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(mockCallback).toHaveBeenCalledTimes(5)
  })

  it('should allow manual start of interval', () => {
    const { result } = renderHook(() => useInterval(mockCallback, null))

    expect(result.current.isActive).toBe(false)

    act(() => {
      result.current.start()
    })

    // Still shouldn't be called since delay is null
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
    expect(result.current.isActive).toBe(false)
  })

  it('should allow manual start with valid delay', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    // Stop the auto-started interval
    act(() => {
      result.current.stop()
    })

    expect(result.current.isActive).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Manually start it
    act(() => {
      result.current.start()
    })

    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should allow stopping the interval', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    expect(result.current.isActive).toBe(true)

    act(() => {
      result.current.stop()
    })

    expect(result.current.isActive).toBe(false)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should allow resetting the interval', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    // Let some time pass
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Reset should restart the interval
    act(() => {
      result.current.reset()
    })

    expect(result.current.isActive).toBe(true)

    // Advance by 500ms (would be 1000ms from original start, but only 500ms from reset)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Advance by another 500ms (now 1000ms from reset)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle delay changes by restarting the interval', () => {
    const { rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useInterval(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    )

    // Let some time pass
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Change delay, should restart interval
    rerender({ delay: 2000 })

    // Original interval time should not trigger callback
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // New delay time should trigger callback
    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle callback changes without restarting interval', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { rerender } = renderHook(
      ({ callback }) => useInterval(callback, 1000),
      { initialProps: { callback: callback1 } }
    )

    // Change callback before interval expires
    act(() => {
      vi.advanceTimersByTime(500)
    })

    rerender({ callback: callback2 })

    // Complete the interval
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  it('should clean up interval on unmount', () => {
    const { unmount } = renderHook(() => useInterval(mockCallback, 1000))

    unmount()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle multiple start calls by clearing previous interval', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Start again should reset the timer
    act(() => {
      result.current.start()
    })

    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple stop calls without error', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    act(() => {
      result.current.stop()
      result.current.stop()
      result.current.stop()
    })

    expect(result.current.isActive).toBe(false)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle multiple reset calls', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 1000))

    act(() => {
      vi.advanceTimersByTime(500)
    })

    act(() => {
      result.current.reset()
      result.current.reset()
    })

    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle zero delay without memory issues', () => {
    const { result } = renderHook(() => useInterval(mockCallback, 0))

    expect(result.current.isActive).toBe(true)

    // Stop immediately to avoid memory issues in tests
    act(() => {
      result.current.stop()
    })

    expect(result.current.isActive).toBe(false)
  })

  it('should handle negative delay as valid delay', () => {
    const { result } = renderHook(() => useInterval(mockCallback, -100))

    expect(result.current.isActive).toBe(true)

    // Stop immediately to avoid memory issues in tests
    act(() => {
      result.current.stop()
    })

    expect(result.current.isActive).toBe(false)
  })

  it('should maintain function reference stability across renders', () => {
    const { result, rerender } = renderHook(() => useInterval(mockCallback, 1000))

    const firstFunctions = {
      start: result.current.start,
      stop: result.current.stop,
      reset: result.current.reset,
    }

    rerender()

    const secondFunctions = {
      start: result.current.start,
      stop: result.current.stop,
      reset: result.current.reset,
    }

    expect(firstFunctions.start).toBe(secondFunctions.start)
    expect(firstFunctions.stop).toBe(secondFunctions.stop)
    expect(firstFunctions.reset).toBe(secondFunctions.reset)
  })

  it('should handle changing from null to valid delay', () => {
    const { result, rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useInterval(mockCallback, delay),
      { initialProps: { delay: null } }
    )

    expect(result.current.isActive).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Change to valid delay
    rerender({ delay: 500 })

    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle changing from valid delay to null', () => {
    const { result, rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useInterval(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    )

    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Change to null delay should clear interval
    rerender({ delay: null })

    expect(result.current.isActive).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle rapid delay changes', () => {
    const { result, rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useInterval(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    )

    act(() => {
      rerender({ delay: 500 })
      rerender({ delay: 2000 })
      rerender({ delay: 100 })
    })

    expect(result.current.isActive).toBe(true)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should properly handle continuous interval execution', () => {
    renderHook(() => useInterval(mockCallback, 100))

    // Let it run for 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(10)
  })
})