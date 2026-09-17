import "./HomePage.css";

const CATEGORY_DOTS = {
  Food: "#1f5c4c",
  Travel: "#b98b2b",
  Rent: "#a6431f",
  Utilities: "#5c7a8c",
  Education: "#7a5c8c",
  Shopping: "#c26d3f",
  Entertainment: "#2f7a63",
  Health: "#8c5c5c",
  Other: "#8a8578",
};

const formatCurrency = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function HomePage({
  userName = "there",
  totalSpent = 1469.5,
  entryCount = 8,
  topCategory = "Food",
  recentExpenses = [
    { id: 1, title: "Groceries", category: "Food", amount: 450.5, date: "10 Sep" },
    { id: 2, title: "Metro pass", category: "Travel", amount: 120.0, date: "9 Sep" },
    { id: 3, title: "Textbooks", category: "Education", amount: 899.0, date: "6 Sep" },
  ],
  onAddExpense,
  onViewAll,
}) {
  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <p className="home-eyebrow">Good to see you, {userName}</p>
          <h1 className="home-title">Here's where things stand.</h1>
        </div>
        <button className="home-cta" onClick={onAddExpense}>
          + Add expense
        </button>
      </header>

      <section className="home-hero">
        <div className="hero-figure">
          <span className="hero-label">Spent this month</span>
          <span className="hero-amount">{formatCurrency(totalSpent)}</span>
          <span className="hero-sub">
            across {entryCount} {entryCount === 1 ? "entry" : "entries"}
          </span>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-label">Top category</span>
            <span className="stat-value">
              <i
                className="dot"
                style={{ background: CATEGORY_DOTS[topCategory] || "#8a8578" }}
              />
              {topCategory}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Entries logged</span>
            <span className="stat-value">{entryCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Avg. per entry</span>
            <span className="stat-value">
              {formatCurrency(entryCount ? totalSpent / entryCount : 0)}
            </span>
          </div>
        </div>
      </section>

      <section className="home-recent">
        <div className="recent-header">
          <h2>Recent activity</h2>
          <button className="text-link" onClick={onViewAll}>
            View all
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <p>Nothing logged yet.</p>
            <p className="empty-sub">Add your first expense to start the ledger.</p>
          </div>
        ) : (
          <ul className="recent-list">
            {recentExpenses.map((expense) => (
              <li key={expense.id} className="recent-row">
                <span className="recent-dot-wrap">
                  <i
                    className="dot"
                    style={{ background: CATEGORY_DOTS[expense.category] || "#8a8578" }}
                  />
                </span>
                <span className="recent-title">{expense.title}</span>
                <span className="recent-category">{expense.category}</span>
                <span className="recent-date">{expense.date}</span>
                <span className="recent-amount">{formatCurrency(expense.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
