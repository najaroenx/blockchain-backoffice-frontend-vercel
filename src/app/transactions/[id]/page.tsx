import { TransactionDetail } from '@/components/features/transaction-detail'

interface TransactionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { id } = await params
  return <TransactionDetail id={id} />
}
