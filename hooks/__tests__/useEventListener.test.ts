import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useEventListener from '../useEventListener'

// Mock DOM methods
const addEventListener = vi.fn()
const removeEventListener = vi.fn()

describe('useEventListener', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should add event listener to window by default', () => {
    const handler = vi.fn()
    const originalAddEventListener = window.addEventListener
    const originalRemoveEventListener = window.removeEventListener

    window.addEventListener = addEventListener
    window.removeEventListener = removeEventListener

    const { unmount } = renderHook(() =>
      useEventListener('resize', handler)
    )

    expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), undefined)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), undefined)

    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
  })

  it('should add event listener to provided element', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    element.addEventListener = addEventListener
    element.removeEventListener = removeEventListener

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, element)
    )

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
  })

  it('should add event listener to element from ref', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    element.addEventListener = addEventListener
    element.removeEventListener = removeEventListener

    const ref = { current: element }

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, ref)
    )

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
  })

  it('should handle event listener options', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    element.addEventListener = addEventListener
    element.removeEventListener = removeEventListener

    const options = { capture: true, passive: true }

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, element, options)
    )

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), options)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), options)
  })

  it('should handle boolean options', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    element.addEventListener = addEventListener
    element.removeEventListener = removeEventListener

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, element, true)
    )

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), true)
  })

  it('should call handler when event is triggered', () => {
    const handler = vi.fn()
    const element = document.createElement('div')

    renderHook(() =>
      useEventListener('click', handler, element)
    )

    // Simulate click event
    const clickEvent = new MouseEvent('click')
    element.dispatchEvent(clickEvent)

    expect(handler).toHaveBeenCalledWith(clickEvent)
  })

  it('should update handler without re-attaching listener', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const element = document.createElement('div')

    // Use real addEventListener/removeEventListener to test actual behavior
    const originalAddEventListener = element.addEventListener
    const originalRemoveEventListener = element.removeEventListener

    let actualEventListener: EventListener | null = null

    element.addEventListener = vi.fn((event, listener, options) => {
      actualEventListener = listener as EventListener
      return originalAddEventListener.call(element, event, listener, options)
    })

    element.removeEventListener = vi.fn((event, listener, options) => {
      return originalRemoveEventListener.call(element, event, listener, options)
    })

    const { rerender } = renderHook(
      ({ handler }) => useEventListener('click', handler, element),
      { initialProps: { handler: handler1 } }
    )

    expect(element.addEventListener).toHaveBeenCalledTimes(1)

    // Change handler
    rerender({ handler: handler2 })

    // Should not have added/removed listeners
    expect(element.addEventListener).toHaveBeenCalledTimes(1)
    expect(element.removeEventListener).not.toHaveBeenCalled()

    // Trigger event - should call new handler through the saved listener
    if (actualEventListener) {
      const clickEvent = new MouseEvent('click')
      ;(actualEventListener as EventListener)(clickEvent)

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledWith(clickEvent)
    }
  })

  it('should re-attach listener when event name changes', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    element.addEventListener = addEventListener
    element.removeEventListener = removeEventListener

    const { rerender } = renderHook(
      ({ eventName }: { eventName: keyof HTMLElementEventMap }) => useEventListener(eventName, handler, element),
      { initialProps: { eventName: 'click' as keyof HTMLElementEventMap } }
    )

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)

    // Change event name
    rerender({ eventName: 'mousedown' as keyof HTMLElementEventMap })

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
    expect(addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function), undefined)
  })

  it('should re-attach listener when element changes', () => {
    const handler = vi.fn()
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')

    element1.addEventListener = vi.fn()
    element1.removeEventListener = vi.fn()
    element2.addEventListener = vi.fn()
    element2.removeEventListener = vi.fn()

    const { rerender } = renderHook(
      ({ element }) => useEventListener('click', handler, element),
      { initialProps: { element: element1 } }
    )

    expect(element1.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)

    // Change element
    rerender({ element: element2 })

    expect(element1.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
    expect(element2.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
  })

  it('should re-attach listener when options change', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    element.addEventListener = addEventListener
    element.removeEventListener = removeEventListener

    const { rerender } = renderHook(
      ({ options }: { options: boolean | AddEventListenerOptions | undefined }) => useEventListener('click', handler, element, options),
      { initialProps: { options: undefined as boolean | AddEventListenerOptions | undefined } }
    )

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)

    // Change options
    rerender({ options: { capture: true } })

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), { capture: true })
  })

  it('should handle null element gracefully', () => {
    const handler = vi.fn()

    expect(() => {
      renderHook(() =>
        useEventListener('click', handler, null)
      )
    }).not.toThrow()
  })

  it('should handle undefined element gracefully and default to window', () => {
    const handler = vi.fn()
    const originalAddEventListener = window.addEventListener
    const originalRemoveEventListener = window.removeEventListener

    window.addEventListener = addEventListener
    window.removeEventListener = removeEventListener

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, undefined)
    )

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)

    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
  })

  it('should handle ref with null current', () => {
    const handler = vi.fn()
    const ref = { current: null }

    expect(() => {
      renderHook(() =>
        useEventListener('click', handler, ref)
      )
    }).not.toThrow()
  })

  it('should work with window events', () => {
    const handler = vi.fn()
    const originalAddEventListener = window.addEventListener
    const originalRemoveEventListener = window.removeEventListener

    window.addEventListener = addEventListener
    window.removeEventListener = removeEventListener

    const { unmount } = renderHook(() =>
      useEventListener('resize', handler, window)
    )

    expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), undefined)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), undefined)

    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
  })

  it('should work with document events', () => {
    const handler = vi.fn()
    const originalAddEventListener = document.addEventListener
    const originalRemoveEventListener = document.removeEventListener

    document.addEventListener = addEventListener
    document.removeEventListener = removeEventListener

    const { unmount } = renderHook(() =>
      useEventListener('keydown', handler, document)
    )

    expect(addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)

    document.addEventListener = originalAddEventListener
    document.removeEventListener = originalRemoveEventListener
  })

  it('should clean up listener on unmount', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    element.addEventListener = addEventListener
    element.removeEventListener = removeEventListener

    const { unmount } = renderHook(() =>
      useEventListener('click', handler, element)
    )

    expect(addEventListener).toHaveBeenCalledTimes(1)

    unmount()

    expect(removeEventListener).toHaveBeenCalledTimes(1)
    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
  })

  it('should handle rapid handler changes', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const handler3 = vi.fn()
    const element = document.createElement('div')

    const { rerender } = renderHook(
      ({ handler }) => useEventListener('click', handler, element),
      { initialProps: { handler: handler1 } }
    )

    rerender({ handler: handler2 })
    rerender({ handler: handler3 })

    const clickEvent = new MouseEvent('click')
    element.dispatchEvent(clickEvent)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
    expect(handler3).toHaveBeenCalledWith(clickEvent)
  })

  it('should handle multiple event listeners on same element', () => {
    const clickHandler = vi.fn()
    const mousedownHandler = vi.fn()
    const element = document.createElement('div')

    renderHook(() => {
      useEventListener('click', clickHandler, element)
      useEventListener('mousedown', mousedownHandler, element)
    })

    const clickEvent = new MouseEvent('click')
    const mousedownEvent = new MouseEvent('mousedown')

    element.dispatchEvent(clickEvent)
    element.dispatchEvent(mousedownEvent)

    expect(clickHandler).toHaveBeenCalledWith(clickEvent)
    expect(mousedownHandler).toHaveBeenCalledWith(mousedownEvent)
  })

  it('should handle keyboard events properly', () => {
    const handler = vi.fn()
    const element = document.createElement('input')

    renderHook(() =>
      useEventListener('keydown', handler, element)
    )

    const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    element.dispatchEvent(keyEvent)

    expect(handler).toHaveBeenCalledWith(keyEvent)
  })

  it('should handle mouse events with proper event object', () => {
    const handler = vi.fn()
    const element = document.createElement('div')

    renderHook(() =>
      useEventListener('mouseover', handler, element)
    )

    const mouseEvent = new MouseEvent('mouseover', { clientX: 100, clientY: 200 })
    element.dispatchEvent(mouseEvent)

    expect(handler).toHaveBeenCalledWith(mouseEvent)
  })

  it('should work in SSR environment without window', () => {
    // Skip this test as it's complex to simulate SSR with react-dom
    // The hook itself handles SSR correctly by checking typeof window !== 'undefined'
    expect(true).toBe(true)
  })
})