import { renderHook as rtlRenderHook } from '@testing-library/react'
import { ReactNode } from 'react'

// Custom renderHook wrapper with common providers if needed
export function renderHook<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: {
    initialProps?: TProps
    wrapper?: React.ComponentType<{ children: ReactNode }>
  }
) {
  return rtlRenderHook(hook, options)
}

// Re-export useful testing utilities
export { act, waitFor } from '@testing-library/react'