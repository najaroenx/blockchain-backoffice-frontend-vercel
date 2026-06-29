import { useState, useCallback } from 'react'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => string | null
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule
}

type ValidationErrors<T> = {
  [K in keyof T]?: string
}

interface UseValidationReturn<T> {
  errors: ValidationErrors<T>
  validate: (values: T) => boolean
  clearErrors: () => void
}

export function useValidation<T extends Record<string, unknown>>(
  rules: ValidationRules<T>
): UseValidationReturn<T> {
  const [errors, setErrors] = useState<ValidationErrors<T>>({})

  const validate = useCallback(
    (values: T): boolean => {
      const newErrors: ValidationErrors<T> = {}

      for (const key in rules) {
        const rule = rules[key]
        const value = values[key]

        if (rule?.required && (!value || value === '')) {
          newErrors[key] = 'This field is required'
          continue
        }

        if (rule?.minLength && typeof value === 'string' && value.length < rule.minLength) {
          newErrors[key] = `Minimum length is ${rule.minLength}`
          continue
        }

        if (rule?.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
          newErrors[key] = `Maximum length is ${rule.maxLength}`
          continue
        }

        if (rule?.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
          newErrors[key] = 'Invalid format'
          continue
        }

        if (rule?.custom) {
          const error = rule.custom(value)
          if (error) {
            newErrors[key] = error
          }
        }
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [rules]
  )

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  return { errors, validate, clearErrors }
}
