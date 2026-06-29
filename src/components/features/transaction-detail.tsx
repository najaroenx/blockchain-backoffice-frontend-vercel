'use client'

import { useApi } from '@/hooks/use-api'
import { apiClient } from '@/libs/api'
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
        <CardContent className="p-6">
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
        <CardContent className="p-6">
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
        <CardContent className="p-6">
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
