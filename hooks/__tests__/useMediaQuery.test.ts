import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useMediaQuery from '../useMediaQuery'

describe('useMediaQuery', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockMatchMedia = vi.fn()
    window.matchMedia = mockMatchMedia
  })

  const createMockMediaQueryList = (matches: boolean, media: string) => ({
    matches,
    media,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })

  it('should return initial match status', () => {
    const mockMQL = createMockMediaQueryList(true, '(min-width: 768px)')
    mockMatchMedia.mockReturnValue(mockMQL)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    
    expect(result.current).toBe(true)
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)')
  })

  it('should return false when media query does not match', () => {
    const mockMQL = createMockMediaQueryList(false, '(min-width: 1024px)')
    mockMatchMedia.mockReturnValue(mockMQL)

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))
    
    expect(result.current).toBe(false)
  })

  it('should update when media query changes', () => {
    const mockMQL = createMockMediaQueryList(false, '(min-width: 768px)')
    mockMatchMedia.mockReturnValue(mockMQL)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    
    expect(result.current).toBe(false)

    // Simulate media query change
    act(() => {
      mockMQL.matches = true
      // Trigger the change event
      const changeHandler = mockMQL.addEventListener.mock.calls.find(
        call => call[0] === 'change'
      )?.[1]
      if (changeHandler) {
        changeHandler({ matches: true, media: '(min-width: 768px)' })
      }
    })

    expect(result.current).toBe(true)
  })

  it('should handle different media queries', () => {
    const desktopMQL = createMockMediaQueryList(true, '(min-width: 1024px)')
    const mobileMQL = createMockMediaQueryList(false, '(max-width: 767px)')

    mockMatchMedia
      .mockReturnValueOnce(desktopMQL)
      .mockReturnValueOnce(mobileMQL)

    const { result: desktopResult } = renderHook(() => 
      useMediaQuery('(min-width: 1024px)')
    )
    const { result: mobileResult } = renderHook(() => 
      useMediaQuery('(max-width: 767px)')
    )

    expect(desktopResult.current).toBe(true)
    expect(mobileResult.current).toBe(false)
  })

  it('should handle complex media queries', () => {
    const complexQuery = '(min-width: 768px) and (max-width: 1023px) and (orientation: landscape)'
    const mockMQL = createMockMediaQueryList(true, complexQuery)
    mockMatchMedia.mockReturnValue(mockMQL)

    const { result } = renderHook(() => useMediaQuery(complexQuery))
    
    expect(result.current).toBe(true)
    expect(mockMatchMedia).toHaveBeenCalledWith(complexQuery)
  })

  it('should cleanup event listeners on unmount', () => {
    const mockMQL = createMockMediaQueryList(false, '(min-width: 768px)')
    mockMatchMedia.mockReturnValue(mockMQL)

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    
    unmount()
    
    expect(mockMQL.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )
  })

  it('should handle query changes', () => {
    const query1 = '(min-width: 768px)'
    const query2 = '(min-width: 1024px)'
    
    const mockMQL1 = createMockMediaQueryList(true, query1)
    const mockMQL2 = createMockMediaQueryList(false, query2)
    
    mockMatchMedia
      .mockReturnValueOnce(mockMQL1)
      .mockReturnValueOnce(mockMQL2)

    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: query1 } }
    )

    expect(result.current).toBe(true)
    
    // Change the query
    rerender({ query: query2 })
    
    expect(result.current).toBe(false)
    expect(mockMQL1.removeEventListener).toHaveBeenCalled()
    expect(mockMatchMedia).toHaveBeenCalledWith(query2)
  })


  it('should work with prefers-color-scheme media queries', () => {
    const darkModeQuery = '(prefers-color-scheme: dark)'
    const mockMQL = createMockMediaQueryList(true, darkModeQuery)
    mockMatchMedia.mockReturnValue(mockMQL)

    const { result } = renderHook(() => useMediaQuery(darkModeQuery))
    
    expect(result.current).toBe(true)
    expect(mockMatchMedia).toHaveBeenCalledWith(darkModeQuery)
  })

  it('should work with print media queries', () => {
    const printQuery = 'print'
    const mockMQL = createMockMediaQueryList(false, printQuery)
    mockMatchMedia.mockReturnValue(mockMQL)

    const { result } = renderHook(() => useMediaQuery(printQuery))
    
    expect(result.current).toBe(false)
  })
})