import { act } from '@testing-library/react'
import { vi } from 'vitest'

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function waitForNextUpdate() {
  await act(async () => {
    await sleep(0)
  })
}

// Helper for testing localStorage/sessionStorage
export const createStorageEventMock = (
  key: string,
  newValue: string | null,
  oldValue: string | null = null,
  storageArea: Storage = window.localStorage
) => {
  const event = new StorageEvent('storage', {
    key,
    newValue,
    oldValue,
    storageArea,
  })
  return event
}

// Helper to trigger window resize events
export const triggerWindowResize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })

  window.dispatchEvent(new Event('resize'))
}

// Helper to trigger visibility change events
export const triggerVisibilityChange = (visibilityState: 'visible' | 'hidden') => {
  Object.defineProperty(document, 'visibilityState', {
    writable: true,
    configurable: true,
    value: visibilityState,
  })
  
  document.dispatchEvent(new Event('visibilitychange'))
}

// Helper to trigger media query changes
export const triggerMediaQueryChange = (query: string, matches: boolean) => {
  const mediaQueryList = {
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }

  // Mock matchMedia for this specific query
  window.matchMedia = vi.fn().mockImplementation((q) => 
    q === query ? mediaQueryList : { matches: false, media: q }
  )

  return mediaQueryList
}