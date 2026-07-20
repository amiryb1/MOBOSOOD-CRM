import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-100 dark:border-gray-700 px-4 lg:px-6 py-3 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-600 dark:text-gray-300 text-xl"
      >
        ☰
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
          title="تغییر پوسته"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {user?.name}
          </p>
          <p className="text-xs text-gray-400">
            {user?.role === 'admin' ? 'مدیر خرید' : 'فروشنده'}
          </p>
        </div>

        <button
          onClick={logout}
          className="btn-secondary text-xs"
        >
          خروج
        </button>
      </div>
    </header>
  )
}
