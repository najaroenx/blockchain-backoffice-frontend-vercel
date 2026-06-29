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
