import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '*.config.*',
        '.next/',
        'coverage/',
        'public/',
        'app/layout.tsx',
        'app/page.tsx',
        'components/ui/**',
        '**/*.d.ts',
        'CLAUDE.md',
        'ROADMAP.md',
      ],
      include: ['hooks/**/*.ts', 'components/**/*.tsx', 'lib/**/*.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    alias: {
      '@/': resolve(__dirname, './'),
    }
  },
})