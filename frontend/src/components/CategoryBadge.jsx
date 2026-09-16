const CATEGORY_STYLES = {
  FOOD: { label: 'Food & Dining', color: '#f5c451' },
  TRAVEL: { label: 'Travel', color: '#4fd1ff' },
  RENT: { label: 'Rent', color: '#ff9f4f' },
  UTILITIES: { label: 'Utilities', color: '#8b8fa3' },
  EDUCATION: { label: 'Education', color: '#39ff9f' },
  SHOPPING: { label: 'Shopping', color: '#c17aff' },
  ENTERTAINMENT: { label: 'Entertainment', color: '#ff5f9d' },
  HEALTH: { label: 'Health', color: '#ff5f7e' },
  OTHER: { label: 'Other', color: '#6b6f80' },
}

export default function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.OTHER
  return (
    <span className="status-badge" style={{ '--badge-color': style.color }}>
      {style.label}
    </span>
  )
}

export { CATEGORY_STYLES }
