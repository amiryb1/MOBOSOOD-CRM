import { useEffect, useState } from 'react'
import api from '../api/axios'
import StatusBadge from './StatusBadge'
import { useAuth } from '../context/AuthContext'

const priorityLabels = { normal: 'عادی', important: 'مهم', urgent: 'فوری' }
const probabilityLabels = { certain: 'قطعی', high: 'زیاد', medium: 'متوسط', low: 'کم' }

export default function ProductModal({ productId, onClose, onChanged }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get(`/product-requests/${productId}`).then(({ data }) => {
      if (active) {
        setDetail(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [productId])

  const changeStatus = async (status) => {
    await api.patch(`/product-requests/${productId}/status`, { status })
    onChanged?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {loading || !detail ? (
          <div className="p-10 text-center text-gray-400">در حال بارگذاری...</div>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {detail.product.product_name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {detail.product.brand} {detail.product.model} {detail.product.color}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <StatusBadge status={detail.product.status} />
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                اولویت: {priorityLabels[detail.product.priority]}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                احتمال خرید: {probabilityLabels[detail.product.purchase_probability]}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <Stat label="تعداد کل درخواست" value={detail.total_requests} />
              <Stat label="تعداد مشتریان" value={detail.customers.length} />
              <Stat label="روزهای انتظار" value={detail.waiting_days} />
              <Stat label="تعداد کل موردنیاز" value={detail.product.total_quantity} />
            </div>

            <Section title="مشتریان">
              {detail.customers.map((c) => (
                <span key={c.id} className="tag">{c.name}</span>
              ))}
            </Section>

            <Section title="فروشندگان ثبت‌کننده">
              {detail.sellers.map((s) => (
                <span key={s.id} className="tag">{s.name}</span>
              ))}
            </Section>

            <div className="grid grid-cols-2 gap-3 text-sm my-4">
              <p className="text-gray-500 dark:text-gray-400">
                تاریخ اولین درخواست: <span className="text-gray-800 dark:text-gray-100">{detail.first_request_date}</span>
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                تاریخ آخرین درخواست: <span className="text-gray-800 dark:text-gray-100">{detail.last_request_date}</span>
              </p>
            </div>

            {detail.product.description && (
              <div className="mb-4">
                <p className="label">توضیحات</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{detail.product.description}</p>
              </div>
            )}

            {isAdmin && (
              <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => changeStatus('fulfilled')} className="btn-primary bg-success hover:bg-green-700 flex-1">
                  تامین شد
                </button>
                <button onClick={() => changeStatus('pending')} className="btn-secondary flex-1">
                  در حال پیگیری
                </button>
                <button onClick={() => changeStatus('not_fulfilled')} className="btn-secondary flex-1">
                  تامین نشد
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <p className="label">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
