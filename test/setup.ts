import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Mock localStorage and sessionStorage
const createStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    length: 0,
    key: vi.fn(),
  }
}

Object.defineProperty(window, 'localStorage', {
  value: createStorageMock(),
})

Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock(),
})

// Mock screen orientation
Object.defineProperty(window, 'screen', {
  value: {
    orientation: {
      angle: 0,
      type: 'portrait-primary',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  },
})

// Mock network information
Object.defineProperty(navigator, 'connection', {
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  writable: true,
})

// Mock document.visibilityState
Object.defineProperty(document, 'visibilityState', {
  value: 'visible',
  writable: true,
})

// Mock addEventListener for window
const originalAddEventListener = window.addEventListener
window.addEventListener = vi.fn(originalAddEventListener)

const originalRemoveEventListener = window.removeEventListener
window.removeEventListener = vi.fn(originalRemoveEventListener)

// Mock document.addEventListener
const originalDocumentAddEventListener = document.addEventListener
document.addEventListener = vi.fn(originalDocumentAddEventListener)

const originalDocumentRemoveEventListener = document.removeEventListener
document.removeEventListener = vi.fn(originalDocumentRemoveEventListener)