import { useEffect, useState } from 'react'
import api from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import ProductModal from '../components/ProductModal'
import { useAuth } from '../context/AuthContext'

const filterChips = [
  { key: 'today_only', label: 'فقط امروز' },
  { key: 'status:not_fulfilled', label: 'فقط تامین‌نشده' },
  { key: 'status:pending', label: 'فقط در حال پیگیری' },
  { key: 'status:fulfilled', label: 'فقط تامین‌شده' },
  { key: 'urgent_only', label: 'فقط فوری' },
]

export default function RequestsList() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  const load = async () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (activeFilter === 'today_only') params.today_only = 1
    if (activeFilter === 'urgent_only') params.urgent_only = 1
    if (activeFilter?.startsWith('status:')) params.status = activeFilter.split(':')[1]

    const { data } = await api.get('/product-requests', { params })
    setItems(data.data)
    setLoading(false)
  }

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeFilter])

  const exportExcel = () => {
    window.open(`${api.defaults.baseURL}/export/products`, '_blank')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">لیست درخواست‌ها</h1>
          <p className="text-sm text-gray-400">جستجو، فیلتر و مشاهده جزئیات کالاهای درخواستی</p>
        </div>
        {isAdmin && (
          <button onClick={exportExcel} className="btn-secondary">
            📥 خروجی اکسل
          </button>
        )}
      </div>

      <div className="card space-y-4">
        <input
          className="input-field"
          placeholder="جستجو بر اساس نام کالا، برند، فروشنده یا مشتری..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {filterChips.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(activeFilter === f.key ? null : f.key)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card !p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="p-4 font-medium">کالا</th>
              <th className="p-4 font-medium">تعداد درخواست</th>
              <th className="p-4 font-medium">تعداد مشتری</th>
              <th className="p-4 font-medium">اولویت</th>
              <th className="p-4 font-medium">وضعیت</th>
              <th className="p-4 font-medium">آخرین درخواست</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-10 text-gray-400">در حال بارگذاری...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-10 text-gray-400">موردی یافت نشد.</td></tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{item.product_name}</p>
                    <p className="text-xs text-gray-400">{item.brand} {item.model} {item.color}</p>
                  </td>
                  <td className="p-4">{item.request_count}</td>
                  <td className="p-4">{item.customer_count}</td>
                  <td className="p-4">
                    <PriorityTag priority={item.priority} />
                  </td>
                  <td className="p-4"><StatusBadge status={item.status} /></td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{item.last_request_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <ProductModal productId={selected} onClose={() => setSelected(null)} onChanged={load} />
      )}
    </div>
  )
}

function PriorityTag({ priority }) {
  const map = {
    urgent: { label: 'فوری', cls: 'bg-red-50 dark:bg-red-900/20 text-danger' },
    important: { label: 'مهم', cls: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
    normal: { label: 'عادی', cls: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' },
  }
  const c = map[priority] || map.normal
  return <span className={`text-xs px-2.5 py-1 rounded-full ${c.cls}`}>{c.label}</span>
}
