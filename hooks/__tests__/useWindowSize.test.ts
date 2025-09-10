import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useWindowSize from '../useWindowSize'

describe('useWindowSize', () => {
  // Store original values
  const originalInnerWidth = window.innerWidth
  const originalInnerHeight = window.innerHeight
  
  beforeEach(() => {
    // Set initial window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  const triggerResize = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    })
    window.dispatchEvent(new Event('resize'))
  }

  it('should return initial window dimensions', () => {
    const { result } = renderHook(() => useWindowSize())
    
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
  })

  it('should update dimensions when window is resized', () => {
    const { result } = renderHook(() => useWindowSize())
    
    expect(result.current.width).toBe(1024)
    expect(result.current.height).toBe(768)
    
    // Trigger window resize
    act(() => {
      triggerResize(1920, 1080)
    })
    
    expect(result.current.width).toBe(1920)
    expect(result.current.height).toBe(1080)
  })

  it('should handle multiple resize events', () => {
    const { result } = renderHook(() => useWindowSize())
    
    // First resize
    act(() => {
      triggerResize(800, 600)
    })
    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)
    
    // Second resize
    act(() => {
      triggerResize(1366, 768)
    })
    expect(result.current.width).toBe(1366)
    expect(result.current.height).toBe(768)
    
    // Third resize
    act(() => {
      triggerResize(375, 667)
    })
    expect(result.current.width).toBe(375)
    expect(result.current.height).toBe(667)
  })

  it('should handle zero dimensions', () => {
    const { result } = renderHook(() => useWindowSize())
    
    act(() => {
      triggerResize(0, 0)
    })
    
    expect(result.current.width).toBe(0)
    expect(result.current.height).toBe(0)
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useWindowSize())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('should handle rapid resize events', () => {
    const { result } = renderHook(() => useWindowSize())
    
    // Trigger multiple rapid resizes
    act(() => {
      triggerResize(800, 600)
      triggerResize(900, 700)
      triggerResize(1000, 800)
      triggerResize(1100, 900)
    })
    
    // Should have the final dimensions
    expect(result.current.width).toBe(1100)
    expect(result.current.height).toBe(900)
  })
})