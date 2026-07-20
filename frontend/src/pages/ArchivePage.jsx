import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function ArchivePage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      api.get('/archive', { params: search ? { search } : {} }).then(({ data }) => {
        setItems(data.data)
        setLoading(false)
      })
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">آرشیو</h1>
        <p className="text-sm text-gray-400">کالاهای تامین‌شده که به صورت خودکار آرشیو شده‌اند</p>
      </div>

      <input
        className="input-field max-w-md"
        placeholder="جستجو در آرشیو..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card !p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="p-4 font-medium">کالا</th>
              <th className="p-4 font-medium">تاریخ ثبت</th>
              <th className="p-4 font-medium">تاریخ تامین</th>
              <th className="p-4 font-medium">مدت زمان تامین</th>
              <th className="p-4 font-medium">مسئول خرید</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-10 text-gray-400">در حال بارگذاری...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-10 text-gray-400">آرشیو خالی است.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="p-4">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{item.product_name}</p>
                    <p className="text-xs text-gray-400">{item.brand} {item.model} {item.color}</p>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{item.registered_at}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{item.fulfilled_at}</td>
                  <td className="p-4">{item.fulfillment_days} روز</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{item.fulfilled_by?.name || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
