import { renderHook, waitFor } from '@testing-library/react'
import { useApi } from '@/hooks/use-api'

describe('useApi', () => {
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useApi(() => Promise.resolve('data')))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should return data on success', async () => {
    const mockFn = jest.fn().mockResolvedValue('test data')
    const { result } = renderHook(() => useApi(mockFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe('test data')
    expect(result.current.error).toBeNull()
  })

  it('should return error on failure', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Test error'))
    const { result } = renderHook(() => useApi(mockFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Test error')
  })

  it('should not fetch immediately when immediate is false', () => {
    const mockFn = jest.fn().mockResolvedValue('data')
    const { result } = renderHook(() => useApi(mockFn, false))

    expect(result.current.loading).toBe(false)
    expect(mockFn).not.toHaveBeenCalled()
  })

  it('should refetch when refetch is called', async () => {
    const mockFn = jest.fn().mockResolvedValue('data')
    const { result } = renderHook(() => useApi(mockFn, false))

    result.current.refetch()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
