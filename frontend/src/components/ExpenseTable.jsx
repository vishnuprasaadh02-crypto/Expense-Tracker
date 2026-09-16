import CategoryBadge from './CategoryBadge.jsx'

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="empty-state">Loading expenses…</p>
  }

  if (!expenses.length) {
    return <p className="empty-state">No expenses yet — add your first one above.</p>
  }

  return (
    <div className="table-wrap">
      <table className="app-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Payment</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.title}</td>
              <td>₹{Number(exp.amount).toFixed(2)}</td>
              <td><CategoryBadge category={exp.category} /></td>
              <td>{exp.payment_method_display}</td>
              <td>{exp.date}</td>
              <td className="app-table__actions">
                <button className="btn btn--icon" onClick={() => onEdit(exp)} title="Edit">✎</button>
                <button className="btn btn--icon btn--danger" onClick={() => onDelete(exp)} title="Delete">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
