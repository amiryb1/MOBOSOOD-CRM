import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const initial = {
  product_name: '',
  brand: '',
  model: '',
  color: '',
  quantity: 1,
  customer_name: '',
  customer_phone: '',
  expected_price: '',
  priority: 'normal',
  purchase_probability: 'medium',
  description: '',
}

export default function NewRequest() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess(false)
    try {
      await api.post('/product-requests', form)
      setSuccess(true)
      setForm(initial)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">ثبت درخواست جدید</h1>
        <p className="text-sm text-gray-400">اگر کالا قبلاً ثبت شده باشد، بجای رکورد جدید به سابقه آن اضافه می‌شود</p>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-success text-sm rounded-xl p-3 text-center">
          درخواست با موفقیت ثبت شد ✅
        </div>
      )}

      <form onSubmit={submit} className="card space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">مشخصات کالا</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="نام کالا" error={errors.product_name}>
              <input className="input-field" value={form.product_name} onChange={set('product_name')} required />
            </Field>
            <Field label="برند" error={errors.brand}>
              <input className="input-field" value={form.brand} onChange={set('brand')} />
            </Field>
            <Field label="مدل" error={errors.model}>
              <input className="input-field" value={form.model} onChange={set('model')} />
            </Field>
            <Field label="رنگ" error={errors.color}>
              <input className="input-field" value={form.color} onChange={set('color')} />
            </Field>
            <Field label="تعداد درخواستی" error={errors.quantity}>
              <input type="number" min="1" className="input-field" value={form.quantity} onChange={set('quantity')} required />
            </Field>
            <Field label="قیمت مورد انتظار (تومان)" error={errors.expected_price}>
              <input type="number" min="0" className="input-field" value={form.expected_price} onChange={set('expected_price')} />
            </Field>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">مشتری</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="نام مشتری" error={errors.customer_name}>
              <input className="input-field" value={form.customer_name} onChange={set('customer_name')} required />
            </Field>
            <Field label="شماره مشتری" error={errors.customer_phone}>
              <input className="input-field" value={form.customer_phone} onChange={set('customer_phone')} />
            </Field>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">اولویت و احتمال خرید</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="اولویت" error={errors.priority}>
              <select className="input-field" value={form.priority} onChange={set('priority')}>
                <option value="normal">عادی</option>
                <option value="important">مهم</option>
                <option value="urgent">فوری</option>
              </select>
            </Field>
            <Field label="احتمال خرید" error={errors.purchase_probability}>
              <select className="input-field" value={form.purchase_probability} onChange={set('purchase_probability')}>
                <option value="certain">قطعی</option>
                <option value="high">زیاد</option>
                <option value="medium">متوسط</option>
                <option value="low">کم</option>
              </select>
            </Field>
          </div>
        </div>

        <Field label="توضیحات" error={errors.description}>
          <textarea rows="3" className="input-field" value={form.description} onChange={set('description')} />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'در حال ثبت...' : 'ثبت درخواست'}
          </button>
          <button type="button" onClick={() => navigate('/requests')} className="btn-secondary">
            مشاهده لیست درخواست‌ها
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error[0]}</p>}
    </div>
  )
}
