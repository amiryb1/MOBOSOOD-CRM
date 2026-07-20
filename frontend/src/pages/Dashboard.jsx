import { useEffect, useState } from 'react'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import RequestsChart from '../components/RequestsChart'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setData(data))
  }, [])

  if (!data) {
    return <div className="text-center text-gray-400 py-20">در حال بارگذاری...</div>
  }

  const { stats, daily_chart, alerts } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">داشبورد</h1>
        <p className="text-sm text-gray-400">نمای کلی وضعیت درخواست‌های خرید کالا</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="کالاهای در انتظار تامین" value={stats.pending_count} icon="⏳" tone="warning" />
        <StatCard title="تامین‌شده امروز" value={stats.fulfilled_today} icon="✅" tone="success" />
        <StatCard title="درخواست‌های ثبت‌شده امروز" value={stats.requests_today} icon="📝" tone="primary" />
        <StatCard
          title="ارزش تقریبی فروش ازدست‌رفته"
          value={new Intl.NumberFormat('fa-IR').format(Math.round(stats.lost_sales_value || 0))}
          icon="💰"
          tone="danger"
        />
        <StatCard
          title="بیشترین کالای درخواست‌شده"
          value={stats.most_requested_product || '—'}
          icon="🔥"
          tone="primary"
        />
      </div>

      <RequestsChart data={daily_chart} />

      {alerts?.length > 0 && (
        <div className="card border-red-200 dark:border-red-900/40">
          <p className="text-sm font-semibold text-danger mb-3">⚠️ کالاهای نیازمند توجه فوری</p>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5"
              >
                <span className="text-sm text-gray-700 dark:text-gray-200">{a.product_name}</span>
                <span className="text-xs text-danger">
                  {a.request_count} درخواست · {a.waiting_days} روز انتظار
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
