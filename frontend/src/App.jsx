import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'
import StatCards from './components/StatCards.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseTable from './components/ExpenseTable.jsx'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [toast, setToast] = useState(null)
  const [apiError, setApiError] = useState(false)

  const showToast = (message, kind = 'success') => {
    setToast({ message, kind })
    setTimeout(() => setToast(null), 3000)
  }

  const loadExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (categoryFilter) params.category = categoryFilter
      const [listRes, statsRes] = await Promise.all([api.list(params), api.stats(params)])
      setExpenses(listRes.results ?? listRes)
      setStats(statsRes)
      setApiError(false)
    } catch (err) {
      setApiError(true)
      showToast(`Could not reach the API: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }, [search, categoryFilter])

  useEffect(() => {
    const timeout = setTimeout(loadExpenses, 250)
    return () => clearTimeout(timeout)
  }, [loadExpenses])

  async function handleSubmit(payload, id) {
    if (id) {
      await api.update(id, payload)
      showToast('Expense updated.')
    } else {
      await api.create(payload)
      showToast('Expense added.')
    }
    setEditingExpense(null)
    await loadExpenses()
  }

  async function handleDelete(exp) {
    if (!window.confirm(`Delete "${exp.title}"?`)) return
    try {
      await api.remove(exp.id)
      showToast('Expense deleted.')
      await loadExpenses()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Expense Tracker</h1>
          <p className="app-header__subtitle">CRUD-based personal expense manager</p>
        </div>
      </header>

      {apiError && (
        <div className="banner banner--error">
          Can't reach the backend at the configured API URL. Make sure the Django server is running
          (<code>python manage.py runserver</code>) on port 8000.
        </div>
      )}

      <StatCards stats={stats} />

      <section className="panel">
        <ExpenseForm
          editingExpense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={() => setEditingExpense(null)}
        />
      </section>

      <section className="panel">
        <div className="toolbar">
          <input
            className="toolbar__search"
            placeholder="Search title or notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
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
        </div>

        <ExpenseTable
          expenses={expenses}
          loading={loading}
          onEdit={setEditingExpense}
          onDelete={handleDelete}
        />
      </section>

      {toast && <div className={`toast toast--${toast.kind}`}>{toast.message}</div>}
    </div>
  )
}
