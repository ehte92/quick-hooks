import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useIntersectionObserver from '../useIntersectionObserver'

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  options: IntersectionObserverInit
  elements: Element[] = []

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options || {}
    MockIntersectionObserver.instances.push(this)
  }

  observe(element: Element) {
    this.elements.push(element)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter(el => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  // Helper method to trigger intersection
  triggerIntersection(entries: Partial<IntersectionObserverEntry>[]) {
    const fullEntries = entries.map(entry => ({
      isIntersecting: false,
      intersectionRatio: 0,
      intersectionRect: {} as DOMRectReadOnly,
      boundingClientRect: {} as DOMRectReadOnly,
      rootBounds: {} as DOMRectReadOnly,
      target: {} as Element,
      time: Date.now(),
      ...entry
    })) as IntersectionObserverEntry[]
    
    this.callback(fullEntries, this)
  }

  static readonly instances: MockIntersectionObserver[] = []
  static reset() {
    MockIntersectionObserver.instances = []
  }
}

// Mock the global IntersectionObserver
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    MockIntersectionObserver.reset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return ref and initial visibility state', () => {
    const { result } = renderHook(() => useIntersectionObserver())

    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toHaveProperty('current', null)
    expect(result.current[1]).toBe(false)
  })

  it('should create IntersectionObserver with default options', () => {
    renderHook(() => useIntersectionObserver())

    expect(MockIntersectionObserver.instances).toHaveLength(1)
    const instance = MockIntersectionObserver.instances[0]
    expect(instance.options).toEqual({
      root: null,
      rootMargin: '0px',
      threshold: 0
    })
  })

  it('should create IntersectionObserver with custom options', () => {
    const options = {
      root: document.body,
      rootMargin: '10px',
      threshold: 0.5
    }

    renderHook(() => useIntersectionObserver(options))

    expect(MockIntersectionObserver.instances).toHaveLength(1)
    const instance = MockIntersectionObserver.instances[0]
    expect(instance.options).toEqual(options)
  })

  it('should create IntersectionObserver with threshold array', () => {
    const options = {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }

    renderHook(() => useIntersectionObserver(options))

    const instance = MockIntersectionObserver.instances[0]
    expect(instance.options.threshold).toEqual([0, 0.25, 0.5, 0.75, 1])
  })

  it('should observe element when ref is attached', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    
    // Simulate attaching ref to DOM element
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement,
      writable: true
    })

    // Re-render to trigger useEffect
    renderHook(() => useIntersectionObserver())

    const instance = MockIntersectionObserver.instances[0]
    expect(instance.elements).toContain(mockElement)
  })

  it('should update visibility state when element intersects', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement,
      writable: true
    })

    // Re-render to create observer
    const { result: result2 } = renderHook(() => useIntersectionObserver())

    expect(result2.current[1]).toBe(false)

    // Trigger intersection
    const instance = MockIntersectionObserver.instances[0]
    act(() => {
      instance.triggerIntersection([{
        isIntersecting: true,
        target: mockElement
      }])
    })

    expect(result2.current[1]).toBe(true)
  })

  it('should update visibility state when element stops intersecting', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement,
      writable: true
    })

    const { result: result2 } = renderHook(() => useIntersectionObserver())

    // First make it visible
    const instance = MockIntersectionObserver.instances[0]
    act(() => {
      instance.triggerIntersection([{
        isIntersecting: true,
        target: mockElement
      }])
    })

    expect(result2.current[1]).toBe(true)

    // Then make it not visible
    act(() => {
      instance.triggerIntersection([{
        isIntersecting: false,
        target: mockElement
      }])
    })

    expect(result2.current[1]).toBe(false)
  })

  it('should handle multiple intersection entries and use the first one', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    
    const mockElement1 = document.createElement('div')
    const mockElement2 = document.createElement('div')
    
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement1,
      writable: true
    })

    const { result: result2 } = renderHook(() => useIntersectionObserver())

    const instance = MockIntersectionObserver.instances[0]
    act(() => {
      instance.triggerIntersection([
        {
          isIntersecting: true,
          target: mockElement1
        },
        {
          isIntersecting: false,
          target: mockElement2
        }
      ])
    })

    // Should use the first entry
    expect(result2.current[1]).toBe(true)
  })

  it('should handle empty intersection entries', () => {
    const { result } = renderHook(() => useIntersectionObserver())
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement,
      writable: true
    })

    const { result: result2 } = renderHook(() => useIntersectionObserver())

    const instance = MockIntersectionObserver.instances[0]
    instance.triggerIntersection([])

    // Should remain false when no entries
    expect(result2.current[1]).toBe(false)
  })

  it('should unobserve element on unmount', () => {
    const { result, unmount } = renderHook(() => useIntersectionObserver())
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement,
      writable: true
    })

    // Re-render to observe element
    renderHook(() => useIntersectionObserver())

    const instance = MockIntersectionObserver.instances[0]
    expect(instance.elements).toContain(mockElement)

    // Unmount should trigger cleanup
    unmount()

    expect(instance.elements).not.toContain(mockElement)
  })

  it('should handle ref changes', () => {
    const options = { threshold: 0.5 }
    const { result, rerender } = renderHook(
      ({ options }) => useIntersectionObserver(options),
      { initialProps: { options } }
    )

    const mockElement1 = document.createElement('div')
    const mockElement2 = document.createElement('div')

    // Initially attach first element
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement1,
      writable: true
    })

    rerender({ options })

    const instance = MockIntersectionObserver.instances[0]
    expect(instance.elements).toContain(mockElement1)

    // Change ref to second element
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement2,
      writable: true
    })

    rerender({ options })

    // Should have created a new observer instance due to ref dependency
    expect(MockIntersectionObserver.instances.length).toBeGreaterThan(1)
  })

  it('should recreate observer when options change', () => {
    const initialOptions = { threshold: 0.5 }
    const newOptions = { threshold: 0.8 }

    const { rerender } = renderHook(
      ({ options }) => useIntersectionObserver(options),
      { initialProps: { options: initialOptions } }
    )

    expect(MockIntersectionObserver.instances).toHaveLength(1)
    expect(MockIntersectionObserver.instances[0].options.threshold).toBe(0.5)

    // Change options
    rerender({ options: newOptions })

    expect(MockIntersectionObserver.instances).toHaveLength(2)
    expect(MockIntersectionObserver.instances[1].options.threshold).toBe(0.8)
  })

  it('should handle rootMargin option changes', () => {
    const initialOptions = { rootMargin: '10px' }
    const newOptions = { rootMargin: '20px' }

    const { rerender } = renderHook(
      ({ options }) => useIntersectionObserver(options),
      { initialProps: { options: initialOptions } }
    )

    expect(MockIntersectionObserver.instances[0].options.rootMargin).toBe('10px')

    rerender({ options: newOptions })

    expect(MockIntersectionObserver.instances[1].options.rootMargin).toBe('20px')
  })

  it('should handle root option changes', () => {
    const initialRoot = document.createElement('div')
    const newRoot = document.createElement('div')

    const { rerender } = renderHook(
      ({ root }) => useIntersectionObserver({ root }),
      { initialProps: { root: initialRoot } }
    )

    expect(MockIntersectionObserver.instances[0].options.root).toBe(initialRoot)

    rerender({ root: newRoot })

    expect(MockIntersectionObserver.instances[1].options.root).toBe(newRoot)
  })

  it('should not observe when ref.current is null', () => {
    const { result } = renderHook(() => useIntersectionObserver())

    // ref.current is null by default
    expect(result.current[0].current).toBe(null)

    const instance = MockIntersectionObserver.instances[0]
    expect(instance.elements).toHaveLength(0)
  })

  it('should maintain stable ref identity across renders', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver())

    const firstRef = result.current[0]
    
    rerender()
    
    const secondRef = result.current[0]
    
    expect(firstRef).toBe(secondRef)
  })
})