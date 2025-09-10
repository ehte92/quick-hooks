# Quick Hooks

> A comprehensive collection of high-quality React hooks built with TypeScript and modern web standards.

[![Test Status](https://github.com/yourusername/quick-hooks/actions/workflows/test.yml/badge.svg)](https://github.com/yourusername/quick-hooks/actions/workflows/test.yml)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **12 Production-Ready Hooks** - Carefully crafted for real-world applications
- **TypeScript First** - Full type safety with generic support and strict mode
- **SSR Compatible** - Works seamlessly with Next.js and other SSR frameworks  
- **Zero Dependencies** - Lightweight and self-contained
- **Comprehensive Testing** - 110+ tests ensuring reliability and edge case coverage
- **Modern Browser APIs** - Leverages latest web standards with graceful fallbacks
- **Dark Mode Support** - Beautiful documentation site with theme switching
- **Responsive Design** - Mobile-friendly documentation and examples

## 📚 Hook Collection

| Hook | Description | SSR Safe | Tests |
|------|-------------|----------|-------|
| [useDebounce](#usedebounce) | Debounce values and callbacks with configurable delay | ✅ | 8 tests |
| [useFetch](#usefetch) | Data fetching with caching and error handling | ✅ | 12 tests |
| [useIntersectionObserver](#useintersectionobserver) | Track element visibility using Intersection Observer API | ✅ | 16 tests |
| [useLocalStorage](#uselocalstorage) | Persistent state with localStorage and cross-tab sync | ✅ | 9 tests |
| [useMediaQuery](#usemediaquery) | Responsive design with CSS media queries | ✅ | 9 tests |
| [useNetworkState](#usenetworkstate) | Monitor online status and connection quality | ✅ | 10 tests |
| [useOrientation](#useorientation) | Device orientation detection and changes | ✅ | 9 tests |
| [usePrevious](#useprevious) | Access previous state or prop values | ✅ | 9 tests |
| [useScript](#usescript) | Dynamic script loading with status tracking | ✅ | 21 tests |
| [useSessionStorage](#usesessionstorage) | Temporary state with sessionStorage persistence | ✅ | 7 tests |
| [useVisibilityChange](#usevisibilitychange) | Document visibility changes (tab switching) | ✅ | 3 tests |
| [useWindowSize](#usewindowsize) | Window dimensions with resize handling | ✅ | 6 tests |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- React 18+
- TypeScript (recommended)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/quick-hooks.git
cd quick-hooks

# Install dependencies  
yarn install

# Start development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the interactive documentation.

### Development Commands

```bash
# Development server
yarn dev              # Start Next.js dev server on port 3000

# Testing
yarn test             # Run tests in watch mode
yarn test:ci          # Run all tests once with coverage
yarn test:coverage    # Generate detailed coverage report

# Build & Quality
yarn build            # Create production build
yarn lint             # Run ESLint checks
yarn typecheck        # Run TypeScript compiler checks
```

## 💡 Usage Examples

### useDebounce
Debounce user input to optimize API calls and performance:

```typescript
import { useState } from 'react'
import useDebounce from '@/hooks/useDebounce'

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  // API call only triggers after user stops typing for 500ms
  useEffect(() => {
    if (debouncedSearch) {
      searchAPI(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### useFetch
Simplified data fetching with automatic caching:

```typescript
import useFetch from '@/hooks/useFetch'

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No user found</div>
  
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  )
}
```

### useLocalStorage
Persistent state that survives page reloads:

```typescript
import useLocalStorage from '@/hooks/useLocalStorage'

function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'en')
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  )
}
```

### useMediaQuery
Responsive components that adapt to screen size:

```typescript
import useMediaQuery from '@/hooks/useMediaQuery'

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  
  return (
    <div className={`layout ${isDark ? 'dark' : 'light'}`}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      <main>Content here</main>
    </div>
  )
}
```

## 🏗️ Project Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system  
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions with automated testing
- **Code Quality**: ESLint + SonarJS rules

### Directory Structure
```
quick-hooks/
├── hooks/              # React hooks implementation
│   ├── __tests__/     # Comprehensive test suites
│   └── *.ts           # Individual hook files
├── app/               # Next.js App Router pages  
│   ├── use-*/         # Individual hook demo pages
│   └── globals.css    # Global styles and CSS variables
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   └── *.tsx         # Feature-specific components
└── test/             # Testing utilities and setup
```

### Design Principles
- **Type Safety**: Every hook is fully typed with TypeScript generics
- **SSR Compatibility**: All hooks handle server-side rendering gracefully
- **Performance First**: Optimized for minimal re-renders and memory usage
- **Error Resilience**: Comprehensive error handling and fallbacks
- **Developer Experience**: Clear APIs with helpful TypeScript hints

## 🧪 Testing

We maintain high test coverage with comprehensive test suites for each hook:

```bash
# Run specific hook tests
yarn test hooks/__tests__/useDebounce.test.ts

# Run with coverage details
yarn test:coverage

# Continuous testing during development  
yarn test --watch
```

### Test Coverage Highlights
- **110+ passing tests** across all hooks
- **Edge case coverage** including SSR scenarios
- **Error condition testing** for robust error handling
- **Performance testing** for memory leaks and optimization
- **Cross-browser compatibility** testing

## 🚦 Browser Support

- Chrome 88+
- Firefox 78+  
- Safari 14+
- Edge 88+

Modern browser APIs are used with appropriate feature detection and fallbacks.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `yarn install`  
4. Run tests: `yarn test`
5. Make your changes
6. Add tests for new functionality
7. Ensure all tests pass: `yarn test:ci`
8. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use meaningful commit messages
- Update documentation for new features

## 📈 Roadmap

### Phase 2: Hook Expansion (Next)
- Essential utility hooks (useToggle, useCounter, useCopyToClipboard)
- Timer and event hooks (useTimeout, useInterval, useEventListener)
- Form and input hooks (useForm, useInput)
- Advanced utility hooks (useGeolocation, useBattery)

### Future Phases  
- Interactive code playground
- NPM package distribution
- Enhanced documentation site
- Community contribution system

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing hooks API
- Next.js team for the excellent framework
- The open source community for inspiration

---

**Quick Hooks** - Building better React applications, one hook at a time. ⚡