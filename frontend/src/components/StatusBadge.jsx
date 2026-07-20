const config = {
  fulfilled: { label: 'تامین شد', dot: 'bg-success', text: 'text-success', bg: 'bg-green-50 dark:bg-green-900/20' },
  pending: { label: 'در حال پیگیری', dot: 'bg-warning', text: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  not_fulfilled: { label: 'تامین نشد', dot: 'bg-danger', text: 'text-danger', bg: 'bg-red-50 dark:bg-red-900/20' },
}

export default function StatusBadge({ status }) {
  const c = config[status] || config.not_fulfilled

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
