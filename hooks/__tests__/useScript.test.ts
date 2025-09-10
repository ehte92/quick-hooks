import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useScript from '../useScript'

describe('useScript', () => {
  beforeEach(() => {
    // Clear any existing script tags
    document.querySelectorAll('script[data-status]').forEach(script => {
      script.remove()
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    // Clean up any created scripts
    document.querySelectorAll('script[data-status]').forEach(script => {
      script.remove()
    })
  })

  it('should return idle status when no src is provided', () => {
    const { result } = renderHook(() => useScript(''))
    
    expect(result.current).toBe('idle')
  })

  it('should return loading status initially when src is provided', () => {
    const { result } = renderHook(() => useScript('https://example.com/script.js'))
    
    expect(result.current).toBe('loading')
  })

  it('should create script element in document', () => {
    renderHook(() => useScript('https://example.com/script.js'))
    
    const script = document.querySelector('script[src="https://example.com/script.js"]')
    expect(script).toBeTruthy()
    expect(script?.getAttribute('async')).toBe(null)
    expect(script?.getAttribute('data-status')).toBe('loading')
  })

  it('should update status to ready when script loads successfully', async () => {
    const { result } = renderHook(() => useScript('https://example.com/script.js'))
    
    expect(result.current).toBe('loading')
    
    // Find the created script and simulate load event
    const script = document.querySelector('script[src="https://example.com/script.js"]') as HTMLScriptElement
    expect(script).toBeTruthy()
    
    act(() => {
      script.dispatchEvent(new Event('load'))
    })
    
    await waitFor(() => {
      expect(result.current).toBe('ready')
    })
    
    expect(script.getAttribute('data-status')).toBe('ready')
  })

  it('should update status to error when script fails to load', async () => {
    const { result } = renderHook(() => useScript('https://example.com/script.js'))
    
    expect(result.current).toBe('loading')
    
    const script = document.querySelector('script[src="https://example.com/script.js"]') as HTMLScriptElement
    
    act(() => {
      script.dispatchEvent(new Event('error'))
    })
    
    await waitFor(() => {
      expect(result.current).toBe('error')
    })
    
    expect(script.getAttribute('data-status')).toBe('error')
  })

  it('should reuse existing script element', () => {
    // Create an existing script
    const existingScript = document.createElement('script')
    existingScript.src = 'https://example.com/existing.js'
    existingScript.setAttribute('data-status', 'ready')
    document.body.appendChild(existingScript)
    
    const { result } = renderHook(() => useScript('https://example.com/existing.js'))
    
    expect(result.current).toBe('ready')
    
    // Should not create a new script
    const scripts = document.querySelectorAll('script[src="https://example.com/existing.js"]')
    expect(scripts.length).toBe(1)
    expect(scripts[0]).toBe(existingScript)
  })

  it('should handle src changes', () => {
    const { result, rerender } = renderHook(
      ({ src }) => useScript(src),
      { initialProps: { src: 'https://example.com/script1.js' } }
    )
    
    expect(result.current).toBe('loading')
    
    // Should have created first script
    expect(document.querySelector('script[src="https://example.com/script1.js"]')).toBeTruthy()
    
    // Change src
    rerender({ src: 'https://example.com/script2.js' })
    
    expect(result.current).toBe('loading')
    
    // Should have created second script
    expect(document.querySelector('script[src="https://example.com/script2.js"]')).toBeTruthy()
    
    // First script should still exist (not removed)
    expect(document.querySelector('script[src="https://example.com/script1.js"]')).toBeTruthy()
  })

  it('should handle empty src after having a src', () => {
    const { result, rerender } = renderHook(
      ({ src }) => useScript(src),
      { initialProps: { src: 'https://example.com/script.js' } }
    )
    
    expect(result.current).toBe('loading')
    
    // Change to empty src
    rerender({ src: '' })
    
    expect(result.current).toBe('idle')
  })

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useScript('https://example.com/script.js'))
    
    const script = document.querySelector('script[src="https://example.com/script.js"]') as HTMLScriptElement
    const removeEventListenerSpy = vi.spyOn(script, 'removeEventListener')
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function))
  })

  it('should handle multiple hooks using the same script', async () => {
    const { result: result1 } = renderHook(() => useScript('https://example.com/shared.js'))
    const { result: result2 } = renderHook(() => useScript('https://example.com/shared.js'))
    
    expect(result1.current).toBe('loading')
    expect(result2.current).toBe('loading')
    
    // Should only create one script element
    const scripts = document.querySelectorAll('script[src="https://example.com/shared.js"]')
    expect(scripts.length).toBe(1)
    
    const script = scripts[0] as HTMLScriptElement
    
    act(() => {
      script.dispatchEvent(new Event('load'))
    })
    
    await waitFor(() => {
      expect(result1.current).toBe('ready')
      expect(result2.current).toBe('ready')
    })
  })

  it('should handle script with existing data-status attribute', () => {
    // Create script with error status
    const existingScript = document.createElement('script')
    existingScript.src = 'https://example.com/error-script.js'
    existingScript.setAttribute('data-status', 'error')
    document.body.appendChild(existingScript)
    
    const { result } = renderHook(() => useScript('https://example.com/error-script.js'))
    
    expect(result.current).toBe('error')
  })

  it('should handle script with invalid data-status attribute', () => {
    // Create script with invalid status
    const existingScript = document.createElement('script')
    existingScript.src = 'https://example.com/invalid-script.js'
    existingScript.setAttribute('data-status', 'invalid')
    document.body.appendChild(existingScript)
    
    const { result } = renderHook(() => useScript('https://example.com/invalid-script.js'))
    
    expect(result.current).toBe('invalid')
  })

  it('should handle script without data-status attribute', () => {
    // Create script without status
    const existingScript = document.createElement('script')
    existingScript.src = 'https://example.com/no-status.js'
    document.body.appendChild(existingScript)
    
    const { result } = renderHook(() => useScript('https://example.com/no-status.js'))
    
    expect(result.current).toBe(null) // getAttribute returns null for missing attributes
  })

  it('should set correct script attributes', () => {
    renderHook(() => useScript('https://example.com/test.js'))
    
    const script = document.querySelector('script[src="https://example.com/test.js"]') as HTMLScriptElement
    
    expect(script.src).toBe('https://example.com/test.js')
    expect(script.async).toBe(true)
    expect(script.getAttribute('data-status')).toBe('loading')
  })

  it('should append script to document body', () => {
    const bodyAppendChildSpy = vi.spyOn(document.body, 'appendChild')
    
    renderHook(() => useScript('https://example.com/test.js'))
    
    expect(bodyAppendChildSpy).toHaveBeenCalledWith(expect.any(HTMLScriptElement))
  })

  it('should handle rapid src changes', () => {
    const { result, rerender } = renderHook(
      ({ src }) => useScript(src),
      { initialProps: { src: 'https://example.com/script1.js' } }
    )
    
    expect(result.current).toBe('loading')
    
    // Rapid changes
    rerender({ src: 'https://example.com/script2.js' })
    expect(result.current).toBe('loading')
    
    rerender({ src: 'https://example.com/script3.js' })
    expect(result.current).toBe('loading')
    
    rerender({ src: '' })
    expect(result.current).toBe('idle')
    
    rerender({ src: 'https://example.com/script4.js' })
    
    // After rerender, check that we eventually get to loading state
    // The initial state might still be idle until useEffect runs
    expect(['idle', 'loading']).toContain(result.current)
    
    expect(document.querySelector('script[src="https://example.com/script4.js"]')).toBeTruthy()
  })

  it('should handle same src being set multiple times', () => {
    const { result, rerender } = renderHook(
      ({ src }) => useScript(src),
      { initialProps: { src: 'https://example.com/same.js' } }
    )
    
    expect(result.current).toBe('loading')
    
    const initialScripts = document.querySelectorAll('script[src="https://example.com/same.js"]')
    expect(initialScripts.length).toBe(1)
    
    // Set same src again
    rerender({ src: 'https://example.com/same.js' })
    
    expect(result.current).toBe('loading')
    
    // Should still only have one script
    const finalScripts = document.querySelectorAll('script[src="https://example.com/same.js"]')
    expect(finalScripts.length).toBe(1)
  })

  it('should handle URLs with query parameters', () => {
    const srcWithQuery = 'https://example.com/script.js?version=1.0.0&callback=test'
    
    renderHook(() => useScript(srcWithQuery))
    
    const script = document.querySelector(`script[src="${srcWithQuery}"]`)
    expect(script).toBeTruthy()
    expect((script as HTMLScriptElement).src).toBe(srcWithQuery)
  })

  it('should handle URLs with special characters', () => {
    const srcWithSpecialChars = 'https://example.com/script-name_v1.0.js'
    
    renderHook(() => useScript(srcWithSpecialChars))
    
    const script = document.querySelector(`script[src="${srcWithSpecialChars}"]`)
    expect(script).toBeTruthy()
  })

  it('should maintain event listeners for existing scripts', async () => {
    // Create existing script
    const existingScript = document.createElement('script')
    existingScript.src = 'https://example.com/existing.js'
    existingScript.setAttribute('data-status', 'loading')
    document.body.appendChild(existingScript)
    
    const { result } = renderHook(() => useScript('https://example.com/existing.js'))
    
    expect(result.current).toBe('loading')
    
    // Trigger load on existing script
    act(() => {
      existingScript.dispatchEvent(new Event('load'))
    })
    
    await waitFor(() => {
      expect(result.current).toBe('ready')
    })
  })

  it('should handle concurrent load and error events', async () => {
    const { result } = renderHook(() => useScript('https://example.com/script.js'))
    
    const script = document.querySelector('script[src="https://example.com/script.js"]') as HTMLScriptElement
    
    // Trigger both events simultaneously
    act(() => {
      script.dispatchEvent(new Event('load'))
      script.dispatchEvent(new Event('error'))
    })
    
    await waitFor(() => {
      // The last event should win, which would be error
      expect(result.current).toBe('error')
    })
  })
})