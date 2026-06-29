import { useState, useEffect, useCallback, useRef } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => void
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  immediate: boolean = true
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetchFnRef.current()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { ...state, refetch: execute }
}
