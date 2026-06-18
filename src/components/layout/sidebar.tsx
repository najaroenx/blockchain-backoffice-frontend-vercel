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
