'use client'

import { TransactionList } from '@/components/features/transaction-list'
import { Button } from '@/components/ui/button'

export default function Transactions() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button>Export</Button>
      </div>
      <TransactionList />
    </div>
  )
}
