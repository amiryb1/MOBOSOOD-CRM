import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">تنظیمات</h1>
        <p className="text-sm text-gray-400">مدیریت ظاهر و اطلاعات حساب کاربری</p>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">حالت نمایش</p>
            <p className="text-xs text-gray-400">تغییر بین پوسته روشن و تاریک</p>
          </div>
          <button onClick={toggleTheme} className="btn-secondary">
            {theme === 'dark' ? 'روشن' : 'تاریک'}
          </button>
        </div>
      </div>

      <div className="card space-y-3">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">اطلاعات حساب</p>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>نام: {user?.name}</p>
          <p>ایمیل: {user?.email}</p>
          <p>نقش: {user?.role === 'admin' ? 'مدیر خرید' : 'فروشنده'}</p>
        </div>
      </div>
    </div>
  )
}
