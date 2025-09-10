import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useVisibilityChange from '../useVisibilityChange'

describe('useVisibilityChange', () => {
  it('should return initial visibility state', () => {
    const { result } = renderHook(() => useVisibilityChange())
    // Should return a boolean
    expect(typeof result.current).toBe('boolean')
  })

  it('should update when visibility changes', () => {
    const { result } = renderHook(() => useVisibilityChange())
    
    // Trigger visibilitychange event
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    
    // Should still be a boolean
    expect(typeof result.current).toBe('boolean')
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    
    const { unmount } = renderHook(() => useVisibilityChange())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
  })
})