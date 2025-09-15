import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useGeolocation from '../useGeolocation'

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
}

// Mock position
const mockPosition: GeolocationPosition = {
  coords: {
    accuracy: 10,
    altitude: 100,
    altitudeAccuracy: 5,
    heading: 45,
    latitude: 37.7749,
    longitude: -122.4194,
    speed: 0,
  },
  timestamp: Date.now(),
}

// Mock error
const mockError: GeolocationPositionError = {
  code: 1,
  message: 'Permission denied',
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
}

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // @ts-expect-error - Mocking navigator
    global.navigator = {
      geolocation: mockGeolocation,
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with loading state', () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {})

    const { result } = renderHook(() => useGeolocation())

    expect(result.current.loading).toBe(true)
    expect(result.current.latitude).toBe(null)
    expect(result.current.longitude).toBe(null)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.refresh).toBe('function')
    expect(result.current.watchId).toBe(null)
  })

  it('should call getCurrentPosition on mount', () => {
    renderHook(() => useGeolocation())

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      undefined
    )
  })

  it('should call getCurrentPosition with options', () => {
    const options = { enableHighAccuracy: true, timeout: 5000 }
    renderHook(() => useGeolocation(options))

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      options
    )
  })

  it('should update state on successful position retrieval', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 100)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.latitude).toBe(mockPosition.coords.latitude)
    expect(result.current.longitude).toBe(mockPosition.coords.longitude)
    expect(result.current.accuracy).toBe(mockPosition.coords.accuracy)
    expect(result.current.altitude).toBe(mockPosition.coords.altitude)
    expect(result.current.altitudeAccuracy).toBe(mockPosition.coords.altitudeAccuracy)
    expect(result.current.heading).toBe(mockPosition.coords.heading)
    expect(result.current.speed).toBe(mockPosition.coords.speed)
    expect(result.current.timestamp).toBe(mockPosition.timestamp)
    expect(result.current.error).toBe(null)
  })

  it('should handle geolocation error', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      setTimeout(() => error(mockError), 100)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(mockError)
    expect(result.current.latitude).toBe(null)
    expect(result.current.longitude).toBe(null)
  })

  it('should handle browser without geolocation support', async () => {
    // @ts-expect-error - Mocking navigator without geolocation
    global.navigator = {}

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual({
      code: 2,
      message: 'Geolocation is not supported by this browser.',
    })
  })

  it('should handle undefined navigator (SSR)', async () => {
    const originalNavigator = global.navigator
    // @ts-expect-error - Simulating SSR
    delete global.navigator

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual({
      code: 2,
      message: 'Geolocation is not supported by this browser.',
    })

    global.navigator = originalNavigator
  })

  it('should refresh position when refresh is called', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 100)
    })

    const { result } = renderHook(() => useGeolocation())

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)

    // Call refresh
    act(() => {
      result.current.refresh()
    })

    expect(result.current.loading).toBe(true)
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(2)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should start watching position when watch is true', () => {
    mockGeolocation.watchPosition.mockReturnValue(123)

    renderHook(() => useGeolocation(undefined, true))

    expect(mockGeolocation.watchPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      undefined
    )
    expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled()
  })

  it('should return watch ID when watching', () => {
    const watchId = 123
    mockGeolocation.watchPosition.mockReturnValue(watchId)

    const { result } = renderHook(() => useGeolocation(undefined, true))

    expect(result.current.watchId).toBe(watchId)
  })

  it('should clear watch on unmount', () => {
    const watchId = 123
    mockGeolocation.watchPosition.mockReturnValue(watchId)

    const { unmount } = renderHook(() => useGeolocation(undefined, true))

    unmount()

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId)
  })

  it('should clear watch when changing from watch to non-watch', () => {
    const watchId = 123
    mockGeolocation.watchPosition.mockReturnValue(watchId)

    const { result, rerender } = renderHook(
      ({ watch }) => useGeolocation(undefined, watch),
      { initialProps: { watch: true } }
    )

    expect(result.current.watchId).toBe(watchId)

    // Change to non-watch mode
    rerender({ watch: false })

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId)
  })

  it('should start watching when changing from non-watch to watch', async () => {
    const watchId = 123
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 100)
    })
    mockGeolocation.watchPosition.mockReturnValue(watchId)

    const { result, rerender } = renderHook(
      ({ watch }) => useGeolocation(undefined, watch),
      { initialProps: { watch: false } }
    )

    // Wait for initial getCurrentPosition
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(mockGeolocation.watchPosition).not.toHaveBeenCalled()

    // Change to watch mode
    rerender({ watch: true })

    expect(mockGeolocation.watchPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      undefined
    )
    expect(result.current.watchId).toBe(watchId)
  })

  it('should handle watch position success', async () => {
    let watchSuccessCallback: ((position: GeolocationPosition) => void) | undefined

    mockGeolocation.watchPosition.mockImplementation((success) => {
      watchSuccessCallback = success
      return 123
    })

    const { result } = renderHook(() => useGeolocation(undefined, true))

    expect(result.current.loading).toBe(true)

    // Simulate position update via watch
    act(() => {
      watchSuccessCallback?.(mockPosition)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.latitude).toBe(mockPosition.coords.latitude)
    expect(result.current.longitude).toBe(mockPosition.coords.longitude)
  })

  it('should handle watch position error', async () => {
    let watchErrorCallback: ((error: GeolocationPositionError) => void) | undefined

    mockGeolocation.watchPosition.mockImplementation((success, error) => {
      watchErrorCallback = error
      return 123
    })

    const { result } = renderHook(() => useGeolocation(undefined, true))

    expect(result.current.loading).toBe(true)

    // Simulate error via watch
    act(() => {
      watchErrorCallback?.(mockError)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(mockError)
  })

  it('should maintain stable refresh function reference', () => {
    const { result, rerender } = renderHook(() => useGeolocation())

    const firstRefresh = result.current.refresh

    rerender()

    expect(result.current.refresh).toBe(firstRefresh)
  })

  it('should handle multiple rapid refresh calls', () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {})

    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.refresh()
      result.current.refresh()
      result.current.refresh()
    })

    // Should have been called for initial mount + 3 refresh calls
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(4)
  })

  it('should handle options changes by calling refresh', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 100)
    })

    const { result, rerender } = renderHook(
      ({ options }) => useGeolocation(options),
      { initialProps: { options: undefined } }
    )

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)

    // Change options
    const newOptions = { enableHighAccuracy: true }
    rerender({ options: newOptions })

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(2)
    expect(mockGeolocation.getCurrentPosition).toHaveBeenLastCalledWith(
      expect.any(Function),
      expect.any(Function),
      newOptions
    )
  })

  it('should preserve previous position data when refreshing', async () => {
    mockGeolocation.getCurrentPosition
      .mockImplementationOnce((success) => {
        setTimeout(() => success(mockPosition), 100)
      })
      .mockImplementationOnce(() => {
        // Second call doesn't resolve immediately
      })

    const { result } = renderHook(() => useGeolocation())

    // Wait for initial position
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const initialLatitude = result.current.latitude

    // Call refresh
    act(() => {
      result.current.refresh()
    })

    // Should be loading but still have previous position data
    expect(result.current.loading).toBe(true)
    expect(result.current.latitude).toBe(initialLatitude)
    expect(result.current.error).toBe(null) // Error should be cleared on refresh
  })

  it('should handle all coordinate properties correctly', async () => {
    const fullMockPosition: GeolocationPosition = {
      coords: {
        accuracy: 10.5,
        altitude: 150.2,
        altitudeAccuracy: 3.1,
        heading: 270.5,
        latitude: 40.7128,
        longitude: -74.0060,
        speed: 5.5,
      },
      timestamp: 1234567890,
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(fullMockPosition), 100)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.accuracy).toBe(10.5)
    expect(result.current.altitude).toBe(150.2)
    expect(result.current.altitudeAccuracy).toBe(3.1)
    expect(result.current.heading).toBe(270.5)
    expect(result.current.latitude).toBe(40.7128)
    expect(result.current.longitude).toBe(-74.0060)
    expect(result.current.speed).toBe(5.5)
    expect(result.current.timestamp).toBe(1234567890)
  })

  it('should handle partial coordinate data (null values)', async () => {
    const partialMockPosition: GeolocationPosition = {
      coords: {
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 37.7749,
        longitude: -122.4194,
        speed: null,
      },
      timestamp: Date.now(),
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(partialMockPosition), 100)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.latitude).toBe(37.7749)
    expect(result.current.longitude).toBe(-122.4194)
    expect(result.current.accuracy).toBe(10)
    expect(result.current.altitude).toBe(null)
    expect(result.current.altitudeAccuracy).toBe(null)
    expect(result.current.heading).toBe(null)
    expect(result.current.speed).toBe(null)
  })

  it('should handle different error types correctly', async () => {
    const timeoutError: GeolocationPositionError = {
      code: 3,
      message: 'Timeout expired',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      setTimeout(() => error(timeoutError), 100)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(timeoutError)
    expect(result.current.error?.code).toBe(3)
    expect(result.current.error?.message).toBe('Timeout expired')
  })
})