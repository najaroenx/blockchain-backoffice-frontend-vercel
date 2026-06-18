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
