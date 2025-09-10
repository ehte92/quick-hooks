import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useFetch, { cache } from '../useFetch'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock data
const mockData = { id: 1, name: 'Test User' }
const mockError = new Error('Network error')

describe('useFetch', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Clear the cache before each test
    cache.clear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return initial loading state', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    const { result } = renderHook(() => useFetch<typeof mockData>('https://api.example.com/users'))
    
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should fetch data successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })
    
    const { result } = renderHook(() => useFetch<typeof mockData>('https://api.example.com/users'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', undefined)
  })

  it('should handle fetch options', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })
    
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New User' })
    }
    
    const { result } = renderHook(() => 
      useFetch<typeof mockData>('https://api.example.com/users', options)
    )
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockData)
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', options)
  })

  it('should handle HTTP errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    })
    
    const { result } = renderHook(() => useFetch<typeof mockData>('https://api.example.com/not-found'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('HTTP error! status: 404')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(mockError)
    
    const { result } = renderHook(() => useFetch<typeof mockData>('https://api.example.com/users'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(mockError)
  })

  it('should handle JSON parse errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    })
    
    const { result } = renderHook(() => useFetch<typeof mockData>('https://api.example.com/users'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe(null)
    expect(result.current.error?.message).toBe('Invalid JSON')
  })

  it('should cache successful responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })
    
    // First render
    const { result: result1, unmount: unmount1 } = renderHook(() => 
      useFetch<typeof mockData>('https://api.example.com/users')
    )
    
    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })
    
    expect(result1.current.data).toEqual(mockData)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    
    unmount1()
    
    // Second render with same URL should use cache
    const { result: result2 } = renderHook(() => 
      useFetch<typeof mockData>('https://api.example.com/users')
    )
    
    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })
    
    expect(result2.current.data).toEqual(mockData)
    expect(mockFetch).toHaveBeenCalledTimes(1) // Should not make another request
  })

  it('should cache based on URL and options', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockData, cached: 'first' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockData, cached: 'second' }),
      })
    
    const options1 = { method: 'GET' }
    const options2 = { method: 'POST' }
    
    // First request
    const { result: result1, unmount: unmount1 } = renderHook(() => 
      useFetch('https://api.example.com/users', options1)
    )
    
    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })
    
    expect(result1.current.data).toEqual({ ...mockData, cached: 'first' })
    
    unmount1()
    
    // Second request with different options should not use cache
    const { result: result2 } = renderHook(() => 
      useFetch('https://api.example.com/users', options2)
    )
    
    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })
    
    expect(result2.current.data).toEqual({ ...mockData, cached: 'second' })
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should refetch when URL changes', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockData, id: 1 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockData, id: 2 }),
      })
    
    const { result, rerender } = renderHook(
      ({ url }) => useFetch<typeof mockData>(url),
      { initialProps: { url: 'https://api.example.com/users/1' } }
    )
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual({ ...mockData, id: 1 })
    expect(mockFetch).toHaveBeenCalledTimes(1)
    
    // Change URL
    rerender({ url: 'https://api.example.com/users/2' })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual({ ...mockData, id: 2 })
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should refetch when options change', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockData, method: 'GET' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockData, method: 'POST' }),
      })
    
    const { result, rerender } = renderHook(
      ({ options }) => useFetch<{ method: string }>('https://api.example.com/users', options),
      { initialProps: { options: { method: 'GET' } } }
    )
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual({ ...mockData, method: 'GET' })
    expect(mockFetch).toHaveBeenCalledTimes(1)
    
    // Change options
    rerender({ options: { method: 'POST' } })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual({ ...mockData, method: 'POST' })
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('should reset to loading state when URL or options change', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
      .mockImplementation(() => new Promise(() => {})) // Never resolves for second call
    
    const { result, rerender } = renderHook(
      ({ url }) => useFetch<typeof mockData>(url),
      { initialProps: { url: 'https://api.example.com/users/1' } }
    )
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockData)
    
    // Change URL - should reset to loading state
    rerender({ url: 'https://api.example.com/users/2' })
    
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should handle complex nested data', async () => {
    const complexData = {
      user: {
        id: 1,
        name: 'John Doe',
        address: {
          street: '123 Main St',
          city: 'New York',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        hobbies: ['reading', 'swimming'],
        metadata: null
      }
    }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(complexData),
    })
    
    const { result } = renderHook(() => 
      useFetch<typeof complexData>('https://api.example.com/complex')
    )
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(complexData)
    expect(result.current.error).toBe(null)
  })
})