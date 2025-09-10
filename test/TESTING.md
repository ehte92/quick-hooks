# Testing Guidelines for Quick Hooks

This document outlines the testing practices, patterns, and guidelines for the Quick Hooks project.

## Overview

Our testing infrastructure is built on:
- **Vitest** - Fast test runner with Jest-compatible API
- **React Testing Library** - Testing utilities for React components and hooks
- **V8 Coverage** - Native JavaScript coverage reporting
- **JSDOM** - Browser environment simulation

## Running Tests

### Basic Commands
```bash
# Run tests in watch mode (development)
yarn test

# Run all tests once
yarn test --run

# Run tests with coverage report
yarn test:coverage

# Run tests with UI dashboard
yarn test:ui

# Run tests for CI/CD (with coverage)
yarn test:ci
```

### Test File Patterns
- Hook tests: `hooks/__tests__/*.test.ts`
- Component tests: `components/__tests__/*.test.tsx`
- Utility tests: `lib/__tests__/*.test.ts`

## Hook Testing Patterns

### Basic Hook Test Structure
```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useYourHook from '../useYourHook'

describe('useYourHook', () => {
  it('should test initial behavior', () => {
    const { result } = renderHook(() => useYourHook())
    expect(result.current).toBe(expectedValue)
  })

  it('should handle state updates', () => {
    const { result } = renderHook(() => useYourHook())
    
    act(() => {
      // Trigger state update
      result.current.updateFunction()
    })
    
    expect(result.current.value).toBe(newExpectedValue)
  })
})
```

### Testing Hook Props Changes
```typescript
it('should react to prop changes', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 500),
    { initialProps: { value: 'initial' } }
  )

  expect(result.current).toBe('initial')

  rerender({ value: 'updated' })
  // Test behavior with new props
})
```

### Testing Async Hooks
```typescript
it('should handle async operations', async () => {
  const { result } = renderHook(() => useAsyncHook())
  
  expect(result.current.loading).toBe(true)
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })
})
```

### Testing Cleanup
```typescript
it('should cleanup on unmount', () => {
  const spy = vi.spyOn(window, 'removeEventListener')
  const { unmount } = renderHook(() => useEventHook())
  
  unmount()
  
  expect(spy).toHaveBeenCalledWith('event', expect.any(Function))
})
```

## Browser API Mocking

### Window APIs
Our test setup includes mocks for common browser APIs:

```typescript
// Already mocked in test/setup.ts:
- window.matchMedia
- window.IntersectionObserver
- window.ResizeObserver
- localStorage/sessionStorage
- navigator.connection
- document.visibilityState
```

### Custom Mocking
```typescript
// For specific tests, you can override mocks:
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
})
```

## Timer Testing

### Using Fake Timers
```typescript
import { describe, it, beforeEach, afterEach, vi } from 'vitest'

describe('timer-based hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should handle timeouts', () => {
    const { result } = renderHook(() => useDebounce('value', 500))
    
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('value')
  })
})
```

## SSR/Hydration Testing

### Testing SSR Compatibility
```typescript
it('should handle SSR environment', () => {
  // Mock server-side environment
  const originalWindow = global.window
  // @ts-expect-error - Testing SSR
  delete global.window

  const { result } = renderHook(() => useBrowserHook())
  
  // Should not crash and provide fallback
  expect(result.current).toBeDefined()
  
  // Restore
  global.window = originalWindow
})
```

## Error Handling

### Testing Error Scenarios
```typescript
it('should handle errors gracefully', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  
  // Mock API to throw error
  const mockFetch = vi.fn().mockRejectedValue(new Error('API Error'))
  global.fetch = mockFetch

  const { result } = renderHook(() => useFetch('/api/data'))
  
  // Verify error handling
  expect(result.current.error).toBeTruthy()
  expect(consoleSpy).not.toHaveBeenCalled() // Should not log to console
  
  consoleSpy.mockRestore()
})
```

## Coverage Requirements

- **Minimum Coverage**: 80% for lines, functions, branches, and statements
- **Hook Coverage**: Aim for 100% coverage on custom hooks
- **Critical Paths**: 100% coverage required for error handling and edge cases

### Viewing Coverage
```bash
# Generate coverage report
yarn test:coverage

# Open HTML coverage report
open coverage/index.html
```

## Test Organization

### File Structure
```
test/
├── setup.ts              # Global test setup
├── utils/                 # Test utilities
│   ├── index.ts
│   ├── renderHook.ts
│   └── test-utils.ts
└── TESTING.md            # This file

hooks/__tests__/          # Hook tests
├── useDebounce.test.ts
├── useLocalStorage.test.ts
└── ...

components/__tests__/     # Component tests
├── Button.test.tsx
└── ...
```

### Test Utilities
```typescript
// Custom test utilities available:
import { 
  renderHook,
  act,
  waitFor,
  sleep,
  triggerWindowResize,
  triggerVisibilityChange,
  triggerMediaQueryChange 
} from '../../test/utils'
```

## Continuous Integration

Tests run automatically on:
- Every push to `main` branch
- Every pull request
- Coverage reports uploaded to Codecov

### CI Commands
The CI pipeline runs:
1. `yarn lint` - ESLint checks
2. `npx tsc --noEmit` - TypeScript compilation
3. `yarn test:ci` - Tests with coverage

## Best Practices

### ✅ DO
- Test behavior, not implementation
- Use `act()` for state updates
- Mock external dependencies
- Test edge cases and error scenarios
- Clean up after tests (spies, timers, etc.)
- Use descriptive test names
- Group related tests with `describe` blocks
- Test SSR compatibility for browser APIs

### ❌ DON'T
- Test internal implementation details
- Forget to wrap state updates in `act()`
- Leave mocks/spies active between tests
- Skip error handling tests
- Use real timers in tests
- Test multiple concerns in one test
- Mock React Testing Library utilities

## Common Patterns

### Testing Custom Hooks with Context
```typescript
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

const { result } = renderHook(() => useTheme(), {
  wrapper: TestWrapper
})
```

### Testing Event Handlers
```typescript
it('should handle events', () => {
  const handler = vi.fn()
  const { result } = renderHook(() => useEventHook(handler))
  
  act(() => {
    // Trigger the event
    window.dispatchEvent(new Event('resize'))
  })
  
  expect(handler).toHaveBeenCalledWith(expect.any(Event))
})
```

## Debugging Tests

### Common Issues
1. **Missing `act()` warnings**: Wrap state updates in `act()`
2. **Timer not advancing**: Use `vi.useFakeTimers()` and `vi.advanceTimersByTime()`
3. **Mocks not working**: Ensure mocks are set up in `beforeEach`
4. **SSR errors**: Check for browser API usage without guards

### Debug Tools
```bash
# Run tests with debug output
yarn test --reporter=verbose

# Run single test file
yarn test useDebounce.test.ts

# Run tests with UI dashboard
yarn test:ui
```

## Contributing

When adding new hooks:
1. Write tests alongside the hook implementation
2. Ensure 100% test coverage
3. Test both happy path and error cases
4. Include SSR compatibility tests if using browser APIs
5. Add performance tests for complex hooks
6. Update this documentation if introducing new patterns

For questions about testing patterns or setup, refer to the test files in the `hooks/__tests__/` directory for examples.