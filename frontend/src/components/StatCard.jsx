export default function StatCard({ title, value, icon, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 dark:bg-green-900/30 text-success',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-warning',
    danger: 'bg-red-100 dark:bg-red-900/30 text-danger',
  }

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">
          {value}
        </p>
      </div>
    </div>
  )
}
