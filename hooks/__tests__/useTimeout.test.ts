import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTimeout from '../useTimeout'

describe('useTimeout', () => {
  let mockCallback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    mockCallback = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should return start, stop, and reset functions', () => {
    const { result } = renderHook(() => useTimeout(mockCallback, 1000))

    expect(typeof result.current.start).toBe('function')
    expect(typeof result.current.stop).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('should execute callback after specified delay', () => {
    renderHook(() => useTimeout(mockCallback, 1000))

    expect(mockCallback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should not execute callback when delay is null', () => {
    renderHook(() => useTimeout(mockCallback, null))

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should execute callback only once for each timeout', () => {
    renderHook(() => useTimeout(mockCallback, 1000))

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should allow manual start of timeout', () => {
    const { result } = renderHook(() => useTimeout(mockCallback, null))

    expect(mockCallback).not.toHaveBeenCalled()

    act(() => {
      result.current.start()
    })

    // Still shouldn't be called since delay is null
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should allow manual start with valid delay', () => {
    const { result } = renderHook(() => useTimeout(mockCallback, 1000))

    // Stop the auto-started timeout
    act(() => {
      result.current.stop()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Manually start it
    act(() => {
      result.current.start()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should allow stopping the timeout', () => {
    const { result } = renderHook(() => useTimeout(mockCallback, 1000))

    act(() => {
      result.current.stop()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should allow resetting the timeout', () => {
    const { result } = renderHook(() => useTimeout(mockCallback, 1000))

    // Let some time pass
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Reset should restart the timeout
    act(() => {
      result.current.reset()
    })

    // Advance by 500ms (total 1000ms from start, but only 500ms from reset)
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

  it('should handle delay changes by restarting the timeout', () => {
    const { rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useTimeout(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    )

    // Let some time pass
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Change delay, should restart timeout
    rerender({ delay: 2000 })

    // Original timeout time should not trigger callback
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

  it('should handle callback changes without restarting timeout', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { rerender } = renderHook(
      ({ callback }) => useTimeout(callback, 1000),
      { initialProps: { callback: callback1 } }
    )

    // Change callback before timeout expires
    act(() => {
      vi.advanceTimersByTime(500)
    })

    rerender({ callback: callback2 })

    // Complete the timeout
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  it('should clean up timeout on unmount', () => {
    const { unmount } = renderHook(() => useTimeout(mockCallback, 1000))

    unmount()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle multiple start calls by clearing previous timeout', () => {
    const { result } = renderHook(() => useTimeout(mockCallback, 1000))

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Start again should reset the timer
    act(() => {
      result.current.start()
    })

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
    const { result } = renderHook(() => useTimeout(mockCallback, 1000))

    act(() => {
      result.current.stop()
      result.current.stop()
      result.current.stop()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle multiple reset calls', () => {
    const { result } = renderHook(() => useTimeout(mockCallback, 1000))

    act(() => {
      vi.advanceTimersByTime(500)
    })

    act(() => {
      result.current.reset()
      result.current.reset()
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle zero delay', () => {
    renderHook(() => useTimeout(mockCallback, 0))

    expect(mockCallback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle negative delay by treating it as 0', () => {
    renderHook(() => useTimeout(mockCallback, -100))

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should maintain function reference stability across renders', () => {
    const { result, rerender } = renderHook(() => useTimeout(mockCallback, 1000))

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
    const { rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useTimeout(mockCallback, delay),
      { initialProps: { delay: null } }
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Change to valid delay
    rerender({ delay: 500 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle changing from valid delay to null', () => {
    const { rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useTimeout(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    )

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Change to null delay should clear timeout
    rerender({ delay: null })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should handle rapid delay changes', () => {
    const { rerender } = renderHook<any, { delay: number | null }>(
      ({ delay }) => useTimeout(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    )

    act(() => {
      rerender({ delay: 500 })
      rerender({ delay: 2000 })
      rerender({ delay: 100 })
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})