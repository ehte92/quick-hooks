import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useOrientation from '../useOrientation'

type OrientationType = 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'

// Mock screen.orientation API
class MockScreenOrientation extends EventTarget {
  angle: number
  type: OrientationType

  constructor(angle = 0, type: OrientationType = 'portrait-primary') {
    super()
    this.angle = angle
    this.type = type
  }

  updateOrientation(angle: number, type: OrientationType) {
    this.angle = angle
    this.type = type
    this.dispatchEvent(new Event('change'))
  }
}

describe('useOrientation', () => {
  let mockOrientation: MockScreenOrientation

  beforeEach(() => {
    mockOrientation = new MockScreenOrientation()
    
    // Mock window.screen.orientation
    Object.defineProperty(window, 'screen', {
      value: {
        orientation: mockOrientation
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial orientation state', () => {
    const { result } = renderHook(() => useOrientation())

    expect(result.current.angle).toBe(0)
    expect(result.current.type).toBe('portrait-primary')
  })

  it('should handle basic functionality', () => {
    // Simple test to verify the hook returns expected structure
    const { result } = renderHook(() => useOrientation())

    expect(result.current).toHaveProperty('angle')
    expect(result.current).toHaveProperty('type')
    expect(typeof result.current.angle).toBe('number')
  })

  it('should update state when orientation changes', () => {
    const { result } = renderHook(() => useOrientation())

    expect(result.current.angle).toBe(0)
    expect(result.current.type).toBe('portrait-primary')

    act(() => {
      mockOrientation.updateOrientation(90, 'landscape-primary')
    })

    expect(result.current.angle).toBe(90)
    expect(result.current.type).toBe('landscape-primary')
  })

  it('should add event listener on mount', () => {
    const addEventListenerSpy = vi.spyOn(mockOrientation, 'addEventListener')

    renderHook(() => useOrientation())

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(mockOrientation, 'removeEventListener')

    const { unmount } = renderHook(() => useOrientation())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should handle portrait-secondary orientation', () => {
    const { result } = renderHook(() => useOrientation())

    act(() => {
      mockOrientation.updateOrientation(180, 'portrait-secondary')
    })

    expect(result.current.angle).toBe(180)
    expect(result.current.type).toBe('portrait-secondary')
  })

  it('should handle landscape-secondary orientation', () => {
    const { result } = renderHook(() => useOrientation())

    act(() => {
      mockOrientation.updateOrientation(270, 'landscape-secondary')
    })

    expect(result.current.angle).toBe(270)
    expect(result.current.type).toBe('landscape-secondary')
  })

  it('should handle multiple orientation changes', () => {
    const { result } = renderHook(() => useOrientation())

    // Start with portrait-primary
    expect(result.current.angle).toBe(0)
    expect(result.current.type).toBe('portrait-primary')

    // Change to landscape-primary
    act(() => {
      mockOrientation.updateOrientation(90, 'landscape-primary')
    })

    expect(result.current.angle).toBe(90)
    expect(result.current.type).toBe('landscape-primary')

    // Change to portrait-secondary
    act(() => {
      mockOrientation.updateOrientation(180, 'portrait-secondary')
    })

    expect(result.current.angle).toBe(180)
    expect(result.current.type).toBe('portrait-secondary')
  })

  it('should maintain consistent state structure', () => {
    const { result } = renderHook(() => useOrientation())

    expect(result.current).toHaveProperty('angle')
    expect(result.current).toHaveProperty('type')
    expect(typeof result.current.angle).toBe('number')
    
    if (result.current.type !== undefined) {
      expect(typeof result.current.type).toBe('string')
      expect([
        'portrait-primary',
        'portrait-secondary',
        'landscape-primary',
        'landscape-secondary'
      ]).toContain(result.current.type)
    }
  })
})