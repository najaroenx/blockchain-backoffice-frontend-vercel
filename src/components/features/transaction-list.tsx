'use client'

import { useApi } from '@/hooks/use-api'
import { apiClient } from '@/libs/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Transaction, ApiResponse } from '@/types'
import Link from 'next/link'

interface TransactionListProps {
  initialData?: Transaction[]
}

export function TransactionList({ initialData }: TransactionListProps) {
  const { data, loading, error } = useApi<Transaction[]>(
    () => apiClient.get<ApiResponse<Transaction[]>>('/transactions').then((res) => res.data),
    !initialData
  )

  const transactions = initialData || data || []

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading transactions: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hash</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Link href={`/transactions/${tx.id}`} className="text-blue-600 hover:text-blue-800 font-mono">
                      {tx.hash.slice(0, 10)}...
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono">{tx.from}</TableCell>
                  <TableCell className="font-mono">{tx.to}</TableCell>
                  <TableCell>{tx.value}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
