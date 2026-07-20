import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Reports() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/reports').then(({ data }) => setData(data))
  }, [])

  if (!data) {
    return <div className="text-center text-gray-400 py-20">در حال بارگذاری...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">گزارشات</h1>
        <p className="text-sm text-gray-400">تحلیل تقاضای بازار و عملکرد تامین کالا</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-xs text-gray-400">ارزش تقریبی فروش ازدست‌رفته</p>
          <p className="text-2xl font-bold text-danger mt-1">
            {new Intl.NumberFormat('fa-IR').format(Math.round(data.lost_sales_value || 0))} تومان
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-400">میانگین زمان تامین کالا</p>
          <p className="text-2xl font-bold text-primary mt-1">{data.average_fulfillment_days} روز</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <ListCard title="پرتقاضاترین کالاها" items={data.top_products.map(p => ({ label: p.product_name, value: `${p.request_count} درخواست` }))} />
        <ListCard title="پرتقاضاترین برندها" items={data.top_brands.map(b => ({ label: b.brand, value: `${b.total} درخواست` }))} />
        <ListCard title="فعال‌ترین فروشندگان" items={data.top_sellers.map(s => ({ label: s.seller?.name || '—', value: `${s.total} ثبت` }))} />
      </div>

      <div className="card">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
          کالاهای بیش از ۷ روز تامین‌نشده
        </p>
        {data.overdue_products.length === 0 ? (
          <p className="text-sm text-gray-400">موردی وجود ندارد.</p>
        ) : (
          <div className="space-y-2">
            {data.overdue_products.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5">
                <span className="text-sm text-gray-700 dark:text-gray-200">{p.product_name}</span>
                <span className="text-xs text-danger">{p.waiting_days} روز انتظار</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ListCard({ title, items }) {
  return (
    <div className="card">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{title}</p>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400">داده‌ای موجود نیست.</p>
        ) : (
          items.map((it, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-200">{it.label}</span>
              <span className="text-gray-400 text-xs">{it.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
