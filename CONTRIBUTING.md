# Contributing to Quick Hooks

Thank you for your interest in contributing to Quick Hooks! This guide will help you get started with contributing to this collection of React hooks.

## 🎯 Project Overview

Quick Hooks is a comprehensive library of TypeScript-first React hooks designed for modern applications. Our goal is to provide high-quality, well-tested, and SSR-compatible hooks that solve common development challenges.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and yarn package manager
- React 18+ and TypeScript knowledge
- Familiarity with React hooks patterns
- Git for version control

### Development Setup

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/yourusername/quick-hooks.git
   cd quick-hooks
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Start Development Server**
   ```bash
   yarn dev
   ```
   Visit http://localhost:3000 to see the documentation site.

4. **Run Tests**
   ```bash
   # Run all tests
   yarn test:ci
   
   # Run tests in watch mode during development
   yarn test
   ```

5. **Verify Build**
   ```bash
   yarn build
   yarn lint
   ```

## 📁 Project Structure

Understanding the project structure will help you navigate and contribute effectively:

```
quick-hooks/
├── hooks/                   # Core hooks implementation
│   ├── __tests__/          # Test files for each hook
│   ├── useDebounce.ts      # Individual hook files
│   └── ...
├── app/                    # Next.js pages and documentation
│   ├── use-debounce/       # Individual hook demo pages
│   ├── page.tsx           # Homepage
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/                # Reusable UI components (buttons, cards, etc.)
│   ├── code-block.tsx     # Feature-specific components
│   └── ...
├── test/                   # Testing utilities and configuration
│   ├── setup.ts           # Global test setup
│   └── utils/             # Test helper functions
└── docs/                   # Additional documentation
```

## 🔧 Development Workflow

### Creating a New Hook

1. **Plan Your Hook**
   - Define the hook's purpose and API
   - Consider edge cases and error scenarios
   - Ensure SSR compatibility
   - Check if similar functionality exists

2. **Create the Hook File**
   ```typescript
   // hooks/useYourHook.ts
   import { useState, useEffect } from 'react'
   
   /**
    * Custom hook description.
    * @param param1 Description of parameter
    * @param param2 Description of parameter
    * @returns Description of return value
    */
   function useYourHook<T>(param1: string, param2?: T): ReturnType {
     // Implementation with proper TypeScript types
     // Handle SSR with typeof window checks
     // Include error handling
     // Optimize for performance
   }
   
   export default useYourHook
   ```

3. **Write Comprehensive Tests**
   ```typescript
   // hooks/__tests__/useYourHook.test.ts
   import { describe, it, expect, vi, beforeEach } from 'vitest'
   import { renderHook, act } from '@testing-library/react'
   import useYourHook from '../useYourHook'
   
   describe('useYourHook', () => {
     // Test happy path
     // Test edge cases
     // Test error conditions
     // Test SSR compatibility
     // Test cleanup on unmount
   })
   ```

4. **Create Demo Page**
   ```typescript
   // app/use-your-hook/page.tsx
   'use client'
   
   import React from 'react'
   import LayoutPage from '@/components/layout-page'
   import useYourHook from '@/hooks/useYourHook'
   
   export default function UseYourHookPage() {
     // Interactive demo of your hook
     // Show practical usage examples
     // Include code examples
   }
   ```

5. **Update Links Configuration**
   ```typescript
   // app/links.ts - Add your hook to the navigation
   ```

### Code Standards

#### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer generic types for reusability
- Add JSDoc comments for all public APIs
- Handle all edge cases with proper types

```typescript
// Good: Generic with constraints and documentation
/**
 * Stores value in localStorage with automatic serialization
 * @param key Storage key
 * @param initialValue Default value or factory function
 * @returns Tuple of [value, setValue] similar to useState
 */
function useLocalStorage<T>(
  key: string, 
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void] {
  // Implementation
}

// Bad: Untyped or overly specific
function useLocalStorage(key, initialValue) { /* ... */ }
```

#### Hook Development Patterns
- Always handle SSR with `typeof window` checks
- Clean up side effects in useEffect cleanup functions
- Use stable references to prevent unnecessary re-renders
- Follow React hooks rules and ESLint recommendations

```typescript
// Good: SSR-safe implementation
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQuery.matches)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
```

#### Testing Standards
- Aim for 80%+ test coverage
- Test both happy path and error conditions
- Include SSR compatibility tests
- Mock browser APIs appropriately
- Use descriptive test names

```typescript
describe('useMediaQuery', () => {
  it('should return false in SSR environment', () => {
    // Test SSR compatibility
  })
  
  it('should return initial match status', () => {
    // Test initial state
  })
  
  it('should update when media query changes', () => {
    // Test reactive behavior
  })
  
  it('should clean up event listeners on unmount', () => {
    // Test cleanup
  })
})
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/use-awesome-hook
   ```

2. **Make Your Changes**
   - Implement the hook following our patterns
   - Write comprehensive tests
   - Create demo page and documentation
   - Update type definitions

3. **Test Everything**
   ```bash
   yarn test:ci    # All tests must pass
   yarn lint       # No linting errors
   yarn build      # Build must succeed
   yarn typecheck  # TypeScript must compile
   ```

4. **Commit with Conventional Commits**
   ```bash
   # Use conventional commit format
   git commit -m "feat: add useAwesomeHook for managing awesome state"
   git commit -m "test: add comprehensive tests for useAwesomeHook"
   git commit -m "docs: add demo page for useAwesomeHook"
   ```

5. **Submit Pull Request**
   - Clear title and description
   - Link to any related issues
   - Include before/after examples
   - Request review from maintainers

### PR Template
When submitting a PR, please include:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] New hook
- [ ] Bug fix
- [ ] Documentation update
- [ ] Test improvements
- [ ] Performance optimization

## Hook Details (if applicable)
- **Hook name**: `useAwesomeHook`
- **Purpose**: Manages awesome state in React components
- **SSR Compatible**: ✅ Yes / ❌ No
- **Dependencies**: None / List any new dependencies

## Testing
- [ ] Unit tests added/updated
- [ ] All tests pass locally
- [ ] Test coverage maintained/improved

## Documentation
- [ ] Demo page created/updated
- [ ] README updated if needed
- [ ] JSDoc comments added

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] No console.log statements left in code
- [ ] TypeScript types are properly defined
```

## 🧪 Testing Guidelines

### Test Structure
- Use Vitest as the test runner
- Follow the Arrange-Act-Assert pattern
- Group related tests with describe blocks
- Use descriptive test names

### Mocking Browser APIs
We provide utilities for common browser API mocks:

```typescript
// test/setup.ts already includes common mocks
// Use them in your tests or add new ones as needed

import { triggerWindowResize, createStorageEventMock } from '@/test/utils/test-utils'

// Custom mocks for your hook's specific needs
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
}
Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  configurable: true,
})
```

### Coverage Requirements
- Overall coverage should remain above 80%
- New hooks should have comprehensive test coverage
- Critical paths must be tested
- Edge cases and error conditions should be covered

## 📖 Documentation Standards

### JSDoc Comments
All public APIs should have comprehensive JSDoc comments:

```typescript
/**
 * Custom hook for debouncing values and callbacks.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * ```typescript
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 500)
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     performSearch(debouncedSearch)
 *   }
 * }, [debouncedSearch])
 * ```
 */
```

### Demo Pages
Each hook should have an interactive demo page showing:
- Basic usage example
- Advanced usage patterns
- API documentation table
- Live, interactive demo
- Code examples

## 🐛 Bug Reports and Issues

### Reporting Bugs
When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (React version, browser, etc.)
- Minimal reproduction example

### Feature Requests
For new hook ideas:
- Describe the use case and problem it solves
- Provide example API design
- Consider existing alternatives
- Explain why it belongs in this library

## 🎨 Design Principles

### Hook Design Philosophy
1. **Simple and Intuitive**: Easy to understand and use
2. **TypeScript First**: Full type safety with excellent DX
3. **SSR Compatible**: Works in all React environments
4. **Performance Focused**: Minimal re-renders and memory usage
5. **Error Resilient**: Graceful error handling and fallbacks
6. **Zero Dependencies**: Self-contained implementations

### API Design Guidelines
- Follow React's built-in hook patterns
- Return tuples for state + setter pairs
- Return objects for multiple related values
- Use consistent naming conventions
- Provide sensible defaults
- Support both simple and advanced use cases

## 🚀 Release Process

### Versioning
We follow Semantic Versioning (SemVer):
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

### Release Checklist
1. All tests passing
2. Documentation updated
3. Version bumped appropriately
4. Changelog updated
5. Demo pages working correctly

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

### Communication
- Use GitHub Issues for bug reports and feature requests
- Use GitHub Discussions for questions and general discussion
- Be patient and helpful with newcomers
- Search existing issues before creating new ones

## 📚 Learning Resources

### React Hooks
- [React Hooks Official Documentation](https://react.dev/reference/react)
- [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Testing
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

## ❓ Getting Help

If you need help or have questions:
1. Check the existing documentation
2. Search through GitHub Issues
3. Look at existing hook implementations as examples
4. Create a new issue with the "question" label
5. Join our community discussions

Thank you for contributing to Quick Hooks! Together, we're building a better React ecosystem. 🚀