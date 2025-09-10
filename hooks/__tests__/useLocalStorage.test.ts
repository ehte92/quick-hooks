import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useLocalStorage from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    expect(result.current[0]).toBe('default-value')
  })

  it('should initialize with default value from function', () => {
    const defaultFn = () => 'computed-default'
    const { result } = renderHook(() => useLocalStorage('test-key', defaultFn))
    
    expect(result.current[0]).toBe('computed-default')
  })

  it('should read from localStorage if value exists', () => {
    localStorage.setItem('existing-key', JSON.stringify('stored-value'))
    const { result } = renderHook(() => useLocalStorage('existing-key', 'default'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  it('should update state and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    expect(result.current[0]).toBe('updated')
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('updated'))
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
    expect(localStorage.setItem).toHaveBeenCalledWith('counter', JSON.stringify(1))
  })

  it('should handle object values', () => {
    const initialObj = { count: 0, name: 'test' }
    const updatedObj = { count: 1, name: 'updated' }
    
    const { result } = renderHook(() => useLocalStorage('object-key', initialObj))
    
    act(() => {
      result.current[1](updatedObj)
    })
    
    expect(result.current[0]).toEqual(updatedObj)
    expect(localStorage.setItem).toHaveBeenCalledWith('object-key', JSON.stringify(updatedObj))
  })

  it('should handle null and undefined values', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('nullable-key', null))
    
    act(() => {
      result.current[1]('not-null')
    })
    
    expect(result.current[0]).toBe('not-null')
    
    act(() => {
      result.current[1](null)
    })
    
    expect(result.current[0]).toBe(null)
  })

  it('should handle storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('sync-key', 'initial'))
    
    // Create a proper storage event
    const mockStorage = {
      key: 'sync-key',
      newValue: JSON.stringify('from-another-tab'),
    }
    
    // Simulate storage event from another tab
    act(() => {
      // Create event manually since StorageEvent constructor has issues in test environment
      const event = new Event('storage') as StorageEvent
      Object.defineProperty(event, 'key', { value: mockStorage.key })
      Object.defineProperty(event, 'newValue', { value: mockStorage.newValue })
      
      window.dispatchEvent(event)
    })
    
    expect(result.current[0]).toBe('from-another-tab')
  })

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('my-key', 'initial'))
    
    act(() => {
      const event = new Event('storage') as StorageEvent
      Object.defineProperty(event, 'key', { value: 'other-key' })
      Object.defineProperty(event, 'newValue', { value: JSON.stringify('other-value') })
      
      window.dispatchEvent(event)
    })
    
    expect(result.current[0]).toBe('initial')
  })

})