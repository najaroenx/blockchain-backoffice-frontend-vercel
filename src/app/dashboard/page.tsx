import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Dashboard() {
  const stats = [
    { label: 'Total Transactions', value: '1,234', change: '+12%' },
    { label: 'Pending', value: '56', change: '-5%' },
    { label: 'Confirmed', value: '1,178', change: '+15%' },
    { label: 'Failed', value: '0', change: '0%' },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
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
