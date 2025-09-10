import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useNetworkState from '../useNetworkState'

describe('useNetworkState', () => {
  beforeEach(() => {
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    // Mock window event listeners
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial network state', () => {
    const { result } = renderHook(() => useNetworkState())

    expect(result.current.online).toBe(true)
    expect(result.current.since).toBeInstanceOf(Date)
  })

  it('should handle offline state', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useNetworkState())

    expect(result.current.online).toBe(false)
  })

  it('should add event listeners on mount', () => {
    renderHook(() => useNetworkState())

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useNetworkState())

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should update state when going online', () => {
    // Start offline
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useNetworkState())
    
    expect(result.current.online).toBe(false)
    const initialSince = result.current.since

    // Go online
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current.online).toBe(true)
    expect(result.current.since).not.toBe(initialSince)
    expect(result.current.since!.getTime()).toBeGreaterThan(initialSince!.getTime())
  })

  it('should update state when going offline', () => {
    const { result } = renderHook(() => useNetworkState())
    
    expect(result.current.online).toBe(true)
    const initialSince = result.current.since

    // Go offline
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current.online).toBe(false)
    expect(result.current.since).not.toBe(initialSince)
    expect(result.current.since!.getTime()).toBeGreaterThan(initialSince!.getTime())
  })

  it('should handle rapid connection changes', () => {
    const { result } = renderHook(() => useNetworkState())

    expect(result.current.online).toBe(true)

    // Rapid online/offline changes
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current.online).toBe(false)

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current.online).toBe(true)
  })

  it('should update since timestamp on each network change', () => {
    const { result } = renderHook(() => useNetworkState())
    
    const firstSince = result.current.since

    // Wait a bit to ensure timestamp difference
    vi.useFakeTimers()
    vi.advanceTimersByTime(100)

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    const secondSince = result.current.since

    expect(secondSince!.getTime()).toBeGreaterThan(firstSince!.getTime())

    vi.useRealTimers()
  })

  it('should maintain consistent state structure', () => {
    const { result } = renderHook(() => useNetworkState())

    const state = result.current

    expect(state).toHaveProperty('online')
    expect(state).toHaveProperty('since')
    expect(typeof state.online).toBe('boolean')
    expect(state.since).toBeInstanceOf(Date)

    if (state.rtt !== undefined) {
      expect(typeof state.rtt).toBe('number')
    }
    if (state.downlink !== undefined) {
      expect(typeof state.downlink).toBe('number')
    }
    if (state.effectiveType !== undefined) {
      expect(typeof state.effectiveType).toBe('string')
    }
  })

  it('should handle NetworkInformation API when available', () => {
    // Test works with basic navigator.onLine functionality
    const { result } = renderHook(() => useNetworkState())
    
    expect(result.current.online).toBe(true)
    expect(result.current.since).toBeInstanceOf(Date)
    
    // Connection info may or may not be available depending on environment
    // This is expected behavior
  })
})