# Expense Tracker

A full-stack CRUD web application for tracking personal expenses — title,
amount, category, payment method, date, notes — built to the CRUD Web
Application SOP (React + Django REST Framework + SQLite).

## 1. Problem Statement

Students and young professionals often lose track of where their money
goes. This app gives a single place to log every expense and see spend
broken down by category, so spending patterns are visible at a glance.

## 2. Objectives

- Log, edit, and delete expenses through a clean dashboard
- Full CRUD via a REST API, consumed by a React frontend
- Server-side + client-side validation (no zero/negative amounts, no blank titles)
- Search and filter by title, notes, and category
- At-a-glance stats: total spent, entry count, top spending category

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), plain CSS |
| Backend | Django 5 + Django REST Framework |
| Database | SQLite (dev) — swappable to PostgreSQL/MySQL |
| API Testing | Postman collection (`docs/Expense_Tracker.postman_collection.json`) |
| Version Control | Git / GitHub |

## 4. System Architecture

```
User → React (Vite) frontend  →  REST API (JSON)  →  Django REST Framework
                                                       ↓ ORM
                                                    SQLite database
```

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:8000`
- CORS is enabled on the backend for the Vite dev origin

## 5. Data Model (ER Summary)

Single entity: **Expense**

| Field | Type | Notes |
|---|---|---|
| id | AutoField (PK) | |
| title | CharField(150) | required |
| amount | DecimalField(10,2) | required, must be > 0 |
| category | Choice: Food / Travel / Rent / Utilities / Education / Shopping / Entertainment / Health / Other | |
| payment_method | Choice: Cash / UPI / Card / Net Banking | |
| date | Date | required |
| notes | Text | optional |
| created_at / updated_at | DateTime | auto |

## 6. REST API Reference

Base URL: `/api/`

| Operation | Method | Endpoint | Notes |
|---|---|---|---|
| Create | POST | `/expenses/` | Validates required fields, amount > 0 |
| List | GET | `/expenses/` | Supports `?search=`, `?category=`, `?payment_method=`, `?ordering=` |
| Retrieve | GET | `/expenses/{id}/` | |
| Update | PUT/PATCH | `/expenses/{id}/` | |
| Delete | DELETE | `/expenses/{id}/` | |
| Dashboard stats | GET | `/expenses/stats/` | Total spend, entry count, per-category totals; respects the same `?search=`/`?category=` filters |

Example response (`GET /api/expenses/1/`):
```json
{
  "id": 1,
  "title": "Groceries",
  "amount": "450.50",
  "category": "FOOD",
  "category_display": "Food & Dining",
  "payment_method": "UPI",
  "payment_method_display": "UPI",
  "date": "2026-09-10",
  "notes": "",
  "created_at": "2026-09-17T00:32:42.037808+05:30",
  "updated_at": "2026-09-17T00:32:42.037837+05:30"
}
```

## 7. Validation

- **Client-side**: required title, amount > 0, required date
- **Server-side** (still enforced even if the frontend is bypassed, e.g. via Postman):
  - `title` cannot be blank
  - `amount` must be strictly greater than zero (rejected with `400` otherwise)
  - model-level `clean()` re-checks the amount constraint

## 8. Setup & Execution

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin/
python manage.py runserver
```
Backend now serves the API at `http://127.0.0.1:8000/api/` and the Django
admin at `http://127.0.0.1:8000/admin/`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # adjust VITE_API_BASE_URL if needed
npm run dev
```
Frontend runs at `http://localhost:5173`.

Run both servers at the same time (two terminals) to use the full app.

## 9. Testing

A ready-made Postman collection is at
`docs/Expense_Tracker.postman_collection.json` — import it into Postman and
run against the local backend. It covers:

- Create with valid data
- Create with a negative amount (expects `400`)
- Create with a missing title (expects `400`)
- Retrieve, update (PATCH), delete
- Delete on a non-existent id (expects `404`)
- Search and filter
- Dashboard stats endpoint

Manual verification already performed during development:
- `POST /api/expenses/` → `201`, record persisted
- `GET /api/expenses/` → returns the created record
- `PATCH /api/expenses/{id}/` → amount updated correctly
- `DELETE /api/expenses/{id}/` → record removed, confirmed via subsequent `GET`
- `POST` with a negative amount → `400`, rejected as expected
- `python manage.py check` → 0 issues
- `npm run build` → frontend builds with no errors

## 10. Security Notes

- No secrets are committed; `SECRET_KEY` and `DEBUG` are read from environment
  variables with safe dev-only fallbacks (see `backend/expense_tracker/settings.py`)
- `.gitignore` excludes `db.sqlite3`, `node_modules/`, `dist/`, and `.env`
- All queries go through the Django ORM (parameterized — no raw SQL)
- CORS is restricted to the local dev origin, not wide open in production

## 11. Challenges & Solutions

- **Negative/zero-amount entries**: solved with validation at both the
  serializer and model level, so it's enforced no matter which client calls the API.
- **Stale dashboard after CRUD actions**: the frontend refetches the list
  and stats together after every create/update/delete instead of guessing new state.
- **Stats respecting active filters**: the `stats` endpoint reuses the same
  filter backend as `list`, so category totals match whatever the user is currently viewing.

## 12. Future Enhancements

- Monthly budget limits with over-budget warnings
- Charts (pie chart by category, line chart of spend over time)
- CSV export/import
- Multi-user accounts with per-user expense lists

## 13. Publishing to GitHub

From the project root (this folder):
```bash
git init
git add .
git commit -m "Initial commit: Expense Tracker CRUD app"
git branch -M main
git remote add origin https://github.com/<your-username>/expense-tracker.git
git push -u origin main
```
Create the empty repository first at github.com/new (no README/gitignore
selected there, since this project already has both), then run the commands
above.

## 14. Project Structure

```
expense-tracker/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── expense_tracker/        # settings, urls, wsgi/asgi
│   └── tracker/                # models, serializers, views, urls, admin
├── frontend/
│   ├── src/
│   │   ├── components/         # CategoryBadge, StatCards, ExpenseForm, ExpenseTable
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   └── package.json
├── docs/
│   └── Expense_Tracker.postman_collection.json
└── README.md
```
