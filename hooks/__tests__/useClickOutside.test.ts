import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useClickOutside from '../useClickOutside'

describe('useClickOutside', () => {
  let mockCallback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockCallback = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return a ref object', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    expect(result.current).toHaveProperty('current', null)
    expect(typeof result.current).toBe('object')
  })

  it('should call callback when clicking outside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    // Simulate a click outside the element
    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true
      })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(outsideElement)
  })

  it('should not call callback when clicking inside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    const childElement = document.createElement('span')
    mockElement.appendChild(childElement)
    document.body.appendChild(mockElement)

    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    // Simulate a click inside the element (on child)
    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true
      })
      Object.defineProperty(event, 'target', {
        value: childElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Clean up
    document.body.removeChild(mockElement)
  })

  it('should not call callback when clicking on the element itself', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    document.body.appendChild(mockElement)

    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    // Simulate a click on the element itself
    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true
      })
      Object.defineProperty(event, 'target', {
        value: mockElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Clean up
    document.body.removeChild(mockElement)
  })

  it('should handle multiple clicks outside correctly', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    const outsideElement1 = document.createElement('div')
    const outsideElement2 = document.createElement('div')
    document.body.appendChild(outsideElement1)
    document.body.appendChild(outsideElement2)

    // First click outside
    act(() => {
      const event1 = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event1, 'target', {
        value: outsideElement1,
        writable: false
      })
      document.dispatchEvent(event1)
    })

    // Second click outside
    act(() => {
      const event2 = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event2, 'target', {
        value: outsideElement2,
        writable: false
      })
      document.dispatchEvent(event2)
    })

    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Clean up
    document.body.removeChild(outsideElement1)
    document.body.removeChild(outsideElement2)
  })

  it('should not call callback when ref.current is null', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    // ref.current is null by default
    expect(result.current.current).toBe(null)

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Clean up
    document.body.removeChild(outsideElement)
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => useClickOutside(mockCallback))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
  })

  it('should handle callback changes without creating memory leaks', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { result, rerender } = renderHook(
      ({ callback }) => useClickOutside(callback),
      { initialProps: { callback: callback1 } }
    )

    const mockElement = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    // Click outside with first callback
    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).not.toHaveBeenCalled()

    // Change callback
    rerender({ callback: callback2 })

    // Click outside with second callback
    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(callback1).toHaveBeenCalledTimes(1) // Still only called once
    expect(callback2).toHaveBeenCalledTimes(1) // New callback called

    // Clean up
    document.body.removeChild(outsideElement)
  })

  it('should work with different HTML element types', () => {
    const buttonCallback = vi.fn()
    const inputCallback = vi.fn()

    const { result: buttonResult } = renderHook(() => useClickOutside<HTMLButtonElement>(buttonCallback))
    const { result: inputResult } = renderHook(() => useClickOutside<HTMLInputElement>(inputCallback))

    expect(buttonResult.current).toHaveProperty('current', null)
    expect(inputResult.current).toHaveProperty('current', null)
  })

  it('should handle nested elements correctly', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const parentElement = document.createElement('div')
    const childElement = document.createElement('div')
    const grandChildElement = document.createElement('span')

    childElement.appendChild(grandChildElement)
    parentElement.appendChild(childElement)
    document.body.appendChild(parentElement)

    Object.defineProperty(result.current, 'current', {
      value: parentElement,
      writable: true
    })

    // Click on deeply nested child - should not trigger callback
    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: grandChildElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Clean up
    document.body.removeChild(parentElement)
  })

  it('should handle rapid successive clicks outside', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    // Rapid successive clicks
    act(() => {
      for (let i = 0; i < 5; i++) {
        const event = new MouseEvent('mousedown', { bubbles: true })
        Object.defineProperty(event, 'target', {
          value: outsideElement,
          writable: false
        })
        document.dispatchEvent(event)
      }
    })

    expect(mockCallback).toHaveBeenCalledTimes(5)

    // Clean up
    document.body.removeChild(outsideElement)
  })

  it('should not interfere with other event listeners', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    // Add another event listener
    const otherCallback = vi.fn()
    document.addEventListener('mousedown', otherCallback)

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(otherCallback).toHaveBeenCalledTimes(1)

    // Clean up
    document.removeEventListener('mousedown', otherCallback)
    document.body.removeChild(outsideElement)
  })

  it('should maintain ref identity across rerenders', () => {
    const { result, rerender } = renderHook(() => useClickOutside(mockCallback))

    const firstRef = result.current

    rerender()

    const secondRef = result.current

    expect(firstRef).toBe(secondRef)
  })

  it('should handle document.body clicks correctly', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    document.body.appendChild(mockElement)

    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true
    })

    // Click on document.body (outside the element)
    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: document.body,
        writable: false
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(mockElement)
  })

  it('should handle callback execution without preventing event propagation', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { result: result1 } = renderHook(() => useClickOutside(callback1))
    const { result: result2 } = renderHook(() => useClickOutside(callback2))

    const element1 = document.createElement('div')
    const element2 = document.createElement('div')

    Object.defineProperty(result1.current, 'current', {
      value: element1,
      writable: true
    })
    Object.defineProperty(result2.current, 'current', {
      value: element2,
      writable: true
    })

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        writable: false
      })
      document.dispatchEvent(event)
    })

    // Both callbacks should be called since click is outside both elements
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(outsideElement)
  })
})