import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const items = [
  { to: '/dashboard', label: 'داشبورد', icon: '📊', adminOnly: false },
  { to: '/requests/new', label: 'ثبت درخواست جدید', icon: '➕', adminOnly: false },
  { to: '/requests', label: 'لیست درخواست‌ها', icon: '📋', adminOnly: false },
  { to: '/archive', label: 'آرشیو', icon: '🗄️', adminOnly: true },
  { to: '/reports', label: 'گزارشات', icon: '📈', adminOnly: true },
  { to: '/settings', label: 'تنظیمات', icon: '⚙️', adminOnly: true },
]

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 border-l border-gray-100 dark:border-gray-700 z-40 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
            ک
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              مدیریت درخواست کالا
            </p>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {items
            .filter((i) => !i.adminOnly || isAdmin)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  )
}
