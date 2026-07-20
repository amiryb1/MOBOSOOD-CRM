import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function RequestsChart({ data }) {
  const chartData = (data || []).map((d) => ({
    date: new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(new Date(d.date)),
    تعداد: d.total,
  }))

  return (
    <div className="card">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        روند درخواست‌های روزانه (۱۴ روز اخیر)
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-700" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, fontFamily: 'Vazirmatn', fontSize: 12 }}
          />
          <Bar dataKey="تعداد" fill="#2563EB" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
