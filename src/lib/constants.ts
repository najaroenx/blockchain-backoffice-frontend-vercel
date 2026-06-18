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
