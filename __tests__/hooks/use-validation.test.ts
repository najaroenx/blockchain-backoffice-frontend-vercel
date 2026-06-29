import { renderHook, act } from '@testing-library/react'
import { useValidation } from '@/hooks/use-validation'

describe('useValidation', () => {
  it('should validate required fields', () => {
    const { result } = renderHook(() =>
      useValidation({
        value: { required: true },
      })
    )

    act(() => {
      const isValid = result.current.validate({ value: '' })
      expect(isValid).toBe(false)
    })

    expect(result.current.errors.value).toBe('This field is required')
  })

  it('should pass validation with valid input', () => {
    const { result } = renderHook(() =>
      useValidation({
        value: { required: true },
      })
    )

    act(() => {
      const isValid = result.current.validate({ value: 'test' })
      expect(isValid).toBe(true)
    })

    expect(result.current.errors.value).toBeUndefined()
  })

  it('should validate minLength', () => {
    const { result } = renderHook(() =>
      useValidation({
        value: { minLength: 3 },
      })
    )

    act(() => {
      const isValid = result.current.validate({ value: 'ab' })
      expect(isValid).toBe(false)
    })

    expect(result.current.errors.value).toBe('Minimum length is 3')
  })

  it('should validate maxLength', () => {
    const { result } = renderHook(() =>
      useValidation({
        value: { maxLength: 5 },
      })
    )

    act(() => {
      const isValid = result.current.validate({ value: 'toolongvalue' })
      expect(isValid).toBe(false)
    })

    expect(result.current.errors.value).toBe('Maximum length is 5')
  })

  it('should validate pattern', () => {
    const { result } = renderHook(() =>
      useValidation({
        value: { pattern: /^[a-z]+$/ },
      })
    )

    act(() => {
      const isValid = result.current.validate({ value: 'ABC' })
      expect(isValid).toBe(false)
    })

    expect(result.current.errors.value).toBe('Invalid format')
  })

  it('should clear errors', () => {
    const { result } = renderHook(() =>
      useValidation({
        value: { required: true },
      })
    )

    act(() => {
      result.current.validate({ value: '' })
    })

    expect(result.current.errors.value).toBe('This field is required')

    act(() => {
      result.current.clearErrors()
    })

    expect(result.current.errors.value).toBeUndefined()
  })
})
