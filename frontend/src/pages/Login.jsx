import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'ورود ناموفق بود. ایمیل یا رمز عبور را بررسی کنید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-transparent">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            ک
          </div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            مدیریت درخواست خرید کالا
          </h1>
          <p className="text-xs text-gray-400 mt-1">برای ورود اطلاعات خود را وارد کنید</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-danger text-xs rounded-xl p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="label">ایمیل</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="label">رمز عبور</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>
    </div>
  )
}
