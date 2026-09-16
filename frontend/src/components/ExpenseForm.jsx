import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: 'OTHER',
  payment_method: 'UPI',
  date: '',
  notes: '',
}

export default function ExpenseForm({ editingExpense, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || 'OTHER',
        payment_method: editingExpense.payment_method || 'UPI',
        date: editingExpense.date || '',
        notes: editingExpense.notes || '',
      })
    } else {
      setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) })
    }
    setErrors({})
  }, [editingExpense])

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Amount must be greater than zero.'
    if (!form.date) next.date = 'Date is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    try {
      await onSubmit({ ...form, amount: Number(form.amount).toFixed(2) }, editingExpense?.id)
    } catch (err) {
      setErrors({ form: err.message })
    }
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>

      <div className="app-form__grid">
        <label>
          Title *
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Groceries" />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label>
          Amount (₹) *
          <input type="number" step="0.01" min="0.01" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="FOOD">Food & Dining</option>
            <option value="TRAVEL">Travel</option>
            <option value="RENT">Rent</option>
            <option value="UTILITIES">Utilities</option>
            <option value="EDUCATION">Education</option>
            <option value="SHOPPING">Shopping</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="HEALTH">Health</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label>
          Payment method
          <select name="payment_method" value={form.payment_method} onChange={handleChange}>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>
        </label>

        <label>
          Date *
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </label>

        <label className="app-form__wide">
          Notes
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Optional details..." />
        </label>
      </div>

      {errors.form && <p className="field-error field-error--form">{errors.form}</p>}

      <div className="app-form__actions">
        <button type="submit" className="btn btn--primary">
          {editingExpense ? 'Save changes' : 'Add expense'}
        </button>
        {editingExpense && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
