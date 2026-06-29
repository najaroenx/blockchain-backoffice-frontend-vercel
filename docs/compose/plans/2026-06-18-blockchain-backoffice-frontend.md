# Blockchain Backoffice Frontend Implementation Plan

> [!NOTE]
> This document may not reflect the current implementation.
> See the final report for up-to-date state:
> [Final Report](../reports/blockchain-backoffice-frontend.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js web application (3-5 pages) with REST API integration for blockchain backoffice management

**Architecture:** Next.js App Router with TypeScript, Tailwind CSS for styling, custom hooks for API integration, and Jest + React Testing Library for testing

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Axios, Jest, React Testing Library, Yarn

---

## File Structure

```
blockchain-backoffice-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── table.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   └── features/
│   │       ├── transaction-list.tsx
│   │       └── transaction-detail.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── use-api.ts
│   │   └── use-validation.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── pages/
├── public/
│   └── assets/
├── config/
│   ├── next.config.js
│   ├── tsconfig.json
│   └── jest.config.js
├── docs/
└── SPEC.md
```

---

## Task 1: Project Setup and Configuration

**Covers:** S2 (Commands), S3 (Project Structure)

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `jest.config.js`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest blockchain-backoffice-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-yarn
cd blockchain-backoffice-frontend
```

- [ ] **Step 2: Install dependencies**

```bash
yarn add axios date-fns
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

- [ ] **Step 3: Configure Jest**

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(config)
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Update package.json scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 5: Verify setup**

```bash
yarn typecheck
yarn test --passWithNoTests
```

Expected: Both commands succeed

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with testing setup"
```

---

## Task 2: Types and Constants

**Covers:** S4 (Code Style)

**Files:**
- Create: `src/types/index.ts`, `src/lib/constants.ts`

- [ ] **Step 1: Create TypeScript types**

```typescript
// src/types/index.ts
export interface Transaction {
  id: string
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  blockNumber?: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  message: string
  statusCode: number
  details?: Record<string, unknown>
}

export type TransactionStatus = Transaction['status']
```

- [ ] **Step 2: Create constants**

```typescript
// src/lib/constants.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  SETTINGS: '/settings',
} as const

export const ITEMS_PER_PAGE = 10
```

- [ ] **Step 3: Verify types compile**

```bash
yarn typecheck
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/lib/constants.ts
git commit -m "feat: add TypeScript types and constants"
```

---

## Task 3: API Client

**Covers:** S4 (Code Style), S6 (Boundaries - Error Handling)

**Files:**
- Create: `src/lib/api.ts`

- [ ] **Step 1: Write failing test for API client**

```typescript
// tests/lib/api.test.ts
import { ApiClient, ApiError } from '@/lib/api'

describe('ApiClient', () => {
  it('should create an instance with base URL', () => {
    const client = new ApiClient('https://api.example.com')
    expect(client).toBeDefined()
  })

  it('should throw ApiError on failed request', async () => {
    const client = new ApiClient('https://invalid-url.example.com')
    await expect(client.get('/test')).rejects.toThrow(ApiError)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/lib/api.test.ts
```

Expected: FAIL - "Cannot find module '@/lib/api'"

- [ ] **Step 3: Implement API client**

```typescript
// src/lib/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_BASE_URL } from './constants'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          throw new ApiError(
            error.response.data?.message || 'Request failed',
            error.response.status,
            error.response.data as Record<string, unknown>
          )
        }
        throw new ApiError('Network error', 0)
      }
    )
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.client.get<T>(endpoint)
    return response.data
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data)
    return response.data
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data)
    return response.data
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint)
    return response.data
  }
}

export const apiClient = new ApiClient()
```

- [ ] **Step 4: Run test to verify it passes**

```bash
yarn test tests/lib/api.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/api.ts tests/lib/api.test.ts
git commit -m "feat: add API client with error handling"
```

---

## Task 4: Custom Hooks

**Covers:** S4 (Code Style), S6 (Boundaries - Error Handling)

**Files:**
- Create: `src/hooks/use-api.ts`, `src/hooks/use-validation.ts`

- [ ] **Step 1: Write failing test for useApi hook**

```typescript
// tests/hooks/use-api.test.ts
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
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/hooks/use-api.test.ts
```

Expected: FAIL - "Cannot find module '@/hooks/use-api'"

- [ ] **Step 3: Implement useApi hook**

```typescript
// src/hooks/use-api.ts
import { useState, useEffect, useCallback } from 'react'

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

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetchFn()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }, [fetchFn])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { ...state, refetch: execute }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
yarn test tests/hooks/use-api.test.ts
```

Expected: PASS

- [ ] **Step 5: Write failing test for useValidation hook**

```typescript
// tests/hooks/use-validation.test.ts
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
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
yarn test tests/hooks/use-validation.test.ts
```

Expected: FAIL

- [ ] **Step 7: Implement useValidation hook**

```typescript
// src/hooks/use-validation.ts
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
```

- [ ] **Step 8: Run test to verify it passes**

```bash
yarn test tests/hooks/use-validation.test.ts
```

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/hooks/use-api.ts src/hooks/use-validation.ts tests/hooks/
git commit -m "feat: add custom hooks for API and validation"
```

---

## Task 5: UI Components

**Covers:** S3 (Project Structure), S4 (Code Style)

**Files:**
- Create: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/card.tsx`, `src/components/ui/table.tsx`

- [ ] **Step 1: Write failing test for Button component**

```typescript
// tests/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should apply variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/components/ui/button.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement Button component**

```typescript
// src/components/ui/button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
yarn test tests/components/ui/button.test.tsx
```

Expected: PASS

- [ ] **Step 5: Write failing test for Input component**

```typescript
// tests/components/ui/input.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('should render with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('should show error message', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('should call onChange when value changes', () => {
    const handleChange = jest.fn()
    render(<Input label="Email" onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
yarn test tests/components/ui/input.test.tsx
```

Expected: FAIL

- [ ] **Step 7: Implement Input component**

```typescript
// src/components/ui/input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

- [ ] **Step 8: Run test to verify it passes**

```bash
yarn test tests/components/ui/input.test.tsx
```

Expected: PASS

- [ ] **Step 9: Implement Card component**

```typescript
// src/components/ui/card.tsx
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>{children}</div>
}
```

- [ ] **Step 10: Implement Table component**

```typescript
// src/components/ui/table.tsx
import { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  loading?: boolean
  emptyMessage?: string
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4" />
        <div className="h-10 bg-gray-200 rounded mb-4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                >
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 11: Commit**

```bash
git add src/components/ui/ tests/components/ui/
git commit -m "feat: add UI components (Button, Input, Card, Table)"
```

---

## Task 6: Layout Components

**Covers:** S3 (Project Structure)

**Files:**
- Create: `src/components/layout/header.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/footer.tsx`

- [ ] **Step 1: Implement Header component**

```typescript
// src/components/layout/header.tsx
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="text-xl font-bold text-gray-900">
              Blockchain Backoffice
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href={ROUTES.DASHBOARD} className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href={ROUTES.TRANSACTIONS} className="text-gray-600 hover:text-gray-900">
              Transactions
            </Link>
            <Link href={ROUTES.SETTINGS} className="text-gray-600 hover:text-gray-900">
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Implement Sidebar component**

```typescript
// src/components/layout/sidebar.tsx
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

const menuItems = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: '📊' },
  { label: 'Transactions', href: ROUTES.TRANSACTIONS, icon: '💱' },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: '⚙️' },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Implement Footer component**

```typescript
// src/components/layout/footer.tsx
export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blockchain Backoffice. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add layout components (Header, Sidebar, Footer)"
```

---

## Task 7: Root Layout and Pages

**Covers:** S3 (Project Structure), S2 (Commands)

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/transactions/page.tsx`, `src/app/settings/page.tsx`

- [ ] **Step 1: Update root layout**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blockchain Backoffice',
  description: 'Blockchain backoffice management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 bg-gray-50 p-6">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create home page**

```typescript
// src/app/page.tsx
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome to Blockchain Backoffice
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Dashboard</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View your blockchain transaction overview and statistics.
            </p>
            <Link
              href={ROUTES.DASHBOARD}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to Dashboard →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Transactions</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Manage and monitor all blockchain transactions.
            </p>
            <Link
              href={ROUTES.TRANSACTIONS}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Transactions →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create dashboard page**

```typescript
// src/app/dashboard/page.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Dashboard() {
  const stats = [
    { label: 'Total Transactions', value: '1,234', change: '+12%' },
    { label: 'Pending', value: '56', change: '-5%' },
    { label: 'Confirmed', value: '1,178', change: '+15%' },
    { label: 'Failed', value: '0', change: '0%' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : stat.change === '0%' ? 'text-gray-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create transactions page**

```typescript
// src/app/transactions/page.tsx
'use client'

import { useState } from 'react'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Transaction } from '@/types'

const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0x123...abc',
    from: '0x456...def',
    to: '0x789...ghi',
    value: '1.5 ETH',
    timestamp: Date.now() - 3600000,
    status: 'confirmed',
    blockNumber: 12345678,
  },
  {
    id: '2',
    hash: '0xabc...123',
    from: '0xdef...456',
    to: '0xghi...789',
    value: '0.5 ETH',
    timestamp: Date.now() - 7200000,
    status: 'pending',
  },
]

const columns = [
  { key: 'hash', header: 'Hash' },
  { key: 'from', header: 'From' },
  { key: 'to', header: 'To' },
  { key: 'value', header: 'Value' },
  {
    key: 'status',
    header: 'Status',
    render: (tx: Transaction) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          tx.status === 'confirmed'
            ? 'bg-green-100 text-green-800'
            : tx.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {tx.status}
      </span>
    ),
  },
]

export default function Transactions() {
  const [search, setSearch] = useState('')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button>Export</Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        data={mockTransactions}
        columns={columns}
        keyExtractor={(tx) => tx.id}
      />
    </div>
  )
}
```

- [ ] **Step 5: Create settings page**

```typescript
// src/app/settings/page.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">API Configuration</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="API Base URL" placeholder="https://api.example.com" />
              <Input label="API Key" type="password" placeholder="Enter your API key" />
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify build**

```bash
yarn build
```

Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/app/
git commit -m "feat: add pages (Home, Dashboard, Transactions, Settings)"
```

---

## Task 8: Feature Components and API Integration

**Covers:** S4 (Code Style), S6 (Boundaries)

**Files:**
- Create: `src/components/features/transaction-list.tsx`, `src/components/features/transaction-detail.tsx`

- [ ] **Step 1: Implement TransactionList component**

```typescript
// src/components/features/transaction-list.tsx
'use client'

import { useApi } from '@/hooks/use-api'
import { apiClient } from '@/lib/api'
import { Table } from '@/components/ui/table'
import { Transaction, ApiResponse } from '@/types'
import Link from 'next/link'

interface TransactionListProps {
  initialData?: Transaction[]
}

const columns = [
  {
    key: 'hash',
    header: 'Hash',
    render: (tx: Transaction) => (
      <Link href={`/transactions/${tx.id}`} className="text-blue-600 hover:text-blue-800">
        {tx.hash.slice(0, 10)}...
      </Link>
    ),
  },
  { key: 'from', header: 'From' },
  { key: 'to', header: 'To' },
  { key: 'value', header: 'Value' },
  {
    key: 'status',
    header: 'Status',
    render: (tx: Transaction) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          tx.status === 'confirmed'
            ? 'bg-green-100 text-green-800'
            : tx.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {tx.status}
      </span>
    ),
  },
]

export function TransactionList({ initialData }: TransactionListProps) {
  const { data, loading, error } = useApi<Transaction[]>(
    () => apiClient.get<ApiResponse<Transaction[]>>('/transactions').then((res) => res.data),
    !initialData
  )

  const transactions = initialData || data || []

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error loading transactions: {error}</p>
      </div>
    )
  }

  return (
    <Table
      data={transactions}
      columns={columns}
      keyExtractor={(tx) => tx.id}
      loading={loading}
      emptyMessage="No transactions found"
    />
  )
}
```

- [ ] **Step 2: Implement TransactionDetail component**

```typescript
// src/components/features/transaction-detail.tsx
'use client'

import { useApi } from '@/hooks/use-api'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Transaction, ApiResponse } from '@/types'
import { formatDate } from '@/lib/utils'

interface TransactionDetailProps {
  id: string
}

export function TransactionDetail({ id }: TransactionDetailProps) {
  const { data: transaction, loading, error } = useApi<Transaction>(
    () => apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`).then((res) => res.data)
  )

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading transaction: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!transaction) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-500">Transaction not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-600">Hash</dt>
            <dd className="text-sm font-mono text-gray-900 break-all">{transaction.hash}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Status</dt>
            <dd>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {transaction.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">From</dt>
            <dd className="text-sm font-mono text-gray-900">{transaction.from}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">To</dt>
            <dd className="text-sm font-mono text-gray-900">{transaction.to}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Value</dt>
            <dd className="text-sm text-gray-900">{transaction.value}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Timestamp</dt>
            <dd className="text-sm text-gray-900">{formatDate(transaction.timestamp)}</dd>
          </div>
          {transaction.blockNumber && (
            <div>
              <dt className="text-sm text-gray-600">Block Number</dt>
              <dd className="text-sm text-gray-900">{transaction.blockNumber}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Create utility function**

```typescript
// src/lib/utils.ts
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function truncateAddress(address: string, chars: number = 6): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

- [ ] **Step 4: Update transactions page to use TransactionList**

```typescript
// src/app/transactions/page.tsx
'use client'

import { TransactionList } from '@/components/features/transaction-list'
import { Button } from '@/components/ui/button'

export default function Transactions() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button>Export</Button>
      </div>
      <TransactionList />
    </div>
  )
}
```

- [ ] **Step 5: Create transaction detail page**

```typescript
// src/app/transactions/[id]/page.tsx
import { TransactionDetail } from '@/components/features/transaction-detail'

interface TransactionPageProps {
  params: {
    id: string
  }
}

export default function TransactionPage({ params }: TransactionPageProps) {
  return <TransactionDetail id={params.id} />
}
```

- [ ] **Step 6: Verify build**

```bash
yarn build
```

Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/components/features/ src/lib/utils.ts src/app/transactions/
git commit -m "feat: add feature components and API integration"
```

---

## Task 9: Testing and Quality Assurance

**Covers:** S5 (Testing Strategy), S6 (Boundaries)

**Files:**
- Create: Various test files

- [ ] **Step 1: Run all tests**

```bash
yarn test
```

Expected: All tests pass

- [ ] **Step 2: Run type checking**

```bash
yarn typecheck
```

Expected: No errors

- [ ] **Step 3: Run linting**

```bash
yarn lint
```

Expected: No errors

- [ ] **Step 4: Run build**

```bash
yarn build
```

Expected: Build succeeds

- [ ] **Step 5: Generate test coverage**

```bash
yarn test:coverage
```

Expected: Coverage meets targets (80% components, 90% utilities)

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: verify all tests pass and build succeeds"
```

---

## Summary

Total Tasks: 9
Estimated Time: 2-3 hours

Key Milestones:
1. Project setup and configuration
2. Core types and API client
3. Custom hooks
4. UI components
5. Layout components
6. Pages and routing
7. Feature components with API integration
8. Testing and quality assurance

Next Steps:
1. Execute this plan using compose:execute or compose:subagent
2. Verify all tests pass
3. Deploy to Vercel
