import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import usePrevious from '../usePrevious'

describe('usePrevious', () => {
  it('should return undefined on initial render', () => {
    const { result } = renderHook(() => usePrevious('initial'))
    expect(result.current).toBeUndefined()
  })

  it('should return previous value after re-render', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'first' } }
    )

    // Initial render should return undefined
    expect(result.current).toBeUndefined()

    // After re-render, should return previous value
    rerender({ value: 'second' })
    expect(result.current).toBe('first')

    // Another re-render
    rerender({ value: 'third' })
    expect(result.current).toBe('second')
  })

  it('should work with different data types', () => {
    // Test with numbers
    const { result: numberResult, rerender: rerenderNumber } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 1 } }
    )

    expect(numberResult.current).toBeUndefined()
    rerenderNumber({ value: 2 })
    expect(numberResult.current).toBe(1)

    // Test with booleans
    const { result: boolResult, rerender: rerenderBool } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: true } }
    )

    expect(boolResult.current).toBeUndefined()
    rerenderBool({ value: false })
    expect(boolResult.current).toBe(true)
  })

  it('should work with objects', () => {
    const obj1 = { id: 1, name: 'first' }
    const obj2 = { id: 2, name: 'second' }
    const obj3 = { id: 3, name: 'third' }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } }
    )

    expect(result.current).toBeUndefined()

    rerender({ value: obj2 })
    expect(result.current).toBe(obj1)

    rerender({ value: obj3 })
    expect(result.current).toBe(obj2)
  })

  it('should work with arrays', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [4, 5, 6]
    const arr3 = [7, 8, 9]

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: arr1 } }
    )

    expect(result.current).toBeUndefined()

    rerender({ value: arr2 })
    expect(result.current).toBe(arr1)

    rerender({ value: arr3 })
    expect(result.current).toBe(arr2)
  })

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: null } }
    )

    expect(result.current).toBeUndefined()

    rerender({ value: undefined })
    expect(result.current).toBe(null)

    rerender({ value: 'value' })
    expect(result.current).toBeUndefined()

    rerender({ value: null })
    expect(result.current).toBe('value')
  })

  it('should handle same value updates', () => {
    const sameValue = 'constant'

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: sameValue } }
    )

    expect(result.current).toBeUndefined()

    // Re-render with same value
    rerender({ value: sameValue })
    expect(result.current).toBe(sameValue)

    // Another re-render with same value
    rerender({ value: sameValue })
    expect(result.current).toBe(sameValue)
  })

  it('should handle complex state transitions', () => {
    interface State {
      count: number
      items: string[]
      active: boolean
    }

    const state1: State = { count: 0, items: [], active: false }
    const state2: State = { count: 1, items: ['a'], active: true }
    const state3: State = { count: 2, items: ['a', 'b'], active: false }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: state1 } }
    )

    expect(result.current).toBeUndefined()

    rerender({ value: state2 })
    expect(result.current).toEqual(state1)

    rerender({ value: state3 })
    expect(result.current).toEqual(state2)
  })

  it('should not interfere with multiple instances', () => {
    const { result: result1, rerender: rerender1 } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'instance1-initial' } }
    )

    const { result: result2, rerender: rerender2 } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'instance2-initial' } }
    )

    expect(result1.current).toBeUndefined()
    expect(result2.current).toBeUndefined()

    rerender1({ value: 'instance1-updated' })
    expect(result1.current).toBe('instance1-initial')
    expect(result2.current).toBeUndefined()

    rerender2({ value: 'instance2-updated' })
    expect(result1.current).toBe('instance1-initial')
    expect(result2.current).toBe('instance2-initial')
  })
})