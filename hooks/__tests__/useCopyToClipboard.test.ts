import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useCopyToClipboard from '../useCopyToClipboard'

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null copiedText and provide copy function', () => {
    const { result } = renderHook(() => useCopyToClipboard())
    
    expect(result.current.copiedText).toBe(null)
    expect(typeof result.current.copy).toBe('function')
    expect(typeof result.current.isSupported).toBe('boolean')
  })

  it('should detect clipboard API support correctly when available', () => {
    // Mock clipboard API as available
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn() },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    expect(result.current.isSupported).toBe(true)
  })

  it('should copy text successfully using clipboard API', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    
    let copyResult: boolean | undefined
    
    await act(async () => {
      copyResult = await result.current.copy('Hello, World!')
    })
    
    expect(copyResult).toBe(true)
    expect(result.current.copiedText).toBe('Hello, World!')
    expect(mockWriteText).toHaveBeenCalledWith('Hello, World!')
  })

  it('should return false and set copiedText to null on clipboard API error', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard error'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    
    let copyResult: boolean | undefined
    
    await act(async () => {
      copyResult = await result.current.copy('Error text')
    })
    
    expect(copyResult).toBe(false)
    expect(result.current.copiedText).toBe(null)
  })

  it('should return false for empty text', async () => {
    const mockWriteText = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    
    let copyResult: boolean | undefined
    
    await act(async () => {
      copyResult = await result.current.copy('')
    })
    
    expect(copyResult).toBe(false)
    expect(result.current.copiedText).toBe(null)
    expect(mockWriteText).not.toHaveBeenCalled()
  })

  it('should maintain function reference stability', () => {
    const { result, rerender } = renderHook(() => useCopyToClipboard())
    
    const initialCopy = result.current.copy
    
    // Trigger re-render
    rerender()
    
    // Function should maintain same reference
    expect(result.current.copy).toBe(initialCopy)
  })

  it('should handle multiple copy operations', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    
    // First copy
    await act(async () => {
      await result.current.copy('First text')
    })
    
    expect(result.current.copiedText).toBe('First text')
    
    // Second copy
    await act(async () => {
      await result.current.copy('Second text')
    })
    
    expect(result.current.copiedText).toBe('Second text')
    expect(mockWriteText).toHaveBeenCalledTimes(2)
  })

  it('should handle special characters and unicode', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    
    const specialText = 'Hello 🌟 World! @#$%^&*()[]{}|\\:";\'<>?,./'
    
    let copyResult: boolean | undefined
    
    await act(async () => {
      copyResult = await result.current.copy(specialText)
    })
    
    expect(copyResult).toBe(true)
    expect(result.current.copiedText).toBe(specialText)
    expect(mockWriteText).toHaveBeenCalledWith(specialText)
  })

  it('should handle very long text', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    
    const longText = 'A'.repeat(1000) // Reduced size to prevent potential issues
    
    let copyResult: boolean | undefined
    
    await act(async () => {
      copyResult = await result.current.copy(longText)
    })
    
    expect(copyResult).toBe(true)
    expect(result.current.copiedText).toBe(longText)
    expect(mockWriteText).toHaveBeenCalledWith(longText)
  })

  it('should handle rapid consecutive copy operations', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    })
    
    const { result } = renderHook(() => useCopyToClipboard())
    
    const promises = [
      result.current.copy('Text 1'),
      result.current.copy('Text 2'),
      result.current.copy('Text 3'),
    ]
    
    let results: boolean[]
    
    await act(async () => {
      results = await Promise.all(promises)
    })
    
    expect(results).toEqual([true, true, true])
    // The last copied text should be in state
    expect(result.current.copiedText).toBe('Text 3')
  })
})