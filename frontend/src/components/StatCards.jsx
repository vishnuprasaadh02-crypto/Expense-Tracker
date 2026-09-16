export default function StatCards({ stats }) {
  const total = stats?.total ?? 0
  const count = stats?.count ?? 0
  const topCategory = stats?.by_category?.[0]

  const cards = [
    { label: 'Total spent', value: `₹${Number(total).toFixed(2)}`, color: '#4fd1ff' },
    { label: 'Entries', value: count, color: '#39ff9f' },
    { label: 'Top category', value: topCategory ? topCategory.category : '—', color: '#f5c451' },
    { label: 'Top category spend', value: topCategory ? `₹${Number(topCategory.total).toFixed(2)}` : '₹0.00', color: '#ff9f4f' },
  ]

  return (
    <div className="stat-cards">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <span className="stat-card__dot" style={{ background: c.color }} />
          <div>
            <p className="stat-card__value">{c.value}</p>
            <p className="stat-card__label">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
