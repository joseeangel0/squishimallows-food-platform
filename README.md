# UPY Food E-commerce Platform – Squishimallows

Technical skeleton of a web e-commerce platform focused on food orders for the UPY student community. The main objective is to capture and analyze data on user behavior within the system.

## Context

The **Squishimallows** team is developing a functional and reviewable technical base during Sprint 1. The platform is not a complete commercial application — it is an infrastructure designed to capture sessions, navigation, searches, product views, cart events, completed orders, and consumption patterns to serve as a base for answering the team's research questions.

## Sprint Goal

Deliver a functional and documented skeleton that includes:

- Initial repository structure
- Database model and schema (Supabase/PostgreSQL)
- API skeleton (Next.js API Routes)
- Synthetic data generation scripts (Python)
- Sample files in CSV, JSON, and Excel
- Frontend skeleton with minimal views
- QA Checklist
- Basic GitHub Actions configuration

## Repository Structure

```text
.
├── frontend/          # Next.js app (frontend + API routes)
│   ├── app/
│   │   ├── page.tsx           # Product catalog
│   │   ├── search/page.tsx    # Search
│   │   ├── cart/page.tsx      # Cart
│   │   ├── order/page.tsx     # Order summary
│   │   └── api/               # API skeleton
│   │       ├── products/
│   │       ├── categories/
│   │       ├── sessions/
│   │       ├── orders/
│   │       └── events/
│   └── lib/supabase.ts        # Supabase client
├── database/
│   └── schema.sql             # Complete schema with tables and relationships
├── scripts/                   # Synthetic data generation (Python)
│   ├── seed.py                # Main script
│   ├── export.py              # Exports CSV, JSON, and Excel
│   ├── setup.sh               # Automatic environment setup
│   ├── requirements.txt
│   └── generate_*.py          # Individual scripts per entity
├── sample_data/               # Generated CSV, JSON, and Excel files
├── qa/
│   └── checklist.md           # Validation checklist for the Sprint
├── docs/                      # Additional documentation
└── .github/
    └── workflows/
        └── skeleton-ci.yml    # GitHub Actions CI
```

## Data Model

The main entities of the platform:

| Table | Description |
|---|---|
| `users` | Anonymous users with device_type |
| `sessions` | Navigation sessions with timestamps and duration |
| `categories` | Product categories (Drinks, Foods, Snacks, etc.) |
| `products` | Products with price and category |
| `product_views` | Viewing time per product |
| `search_events` | Internal searches and whether they completed a purchase |
| `category_browsing_events` | Browsing time per category |
| `cart_events` | Cart events: add, abandon, return, checkout |
| `orders` | Completed orders with total and search usage |
| `order_items` | Product details per order |

## Local Installation

### Frontend (Next.js)

```bash
cd frontend
npm install
cp ../.env.example .env.local   # fill in the variables with your Supabase keys
npm run dev
```

Open `http://localhost:3000`

### Python Scripts

```bash
# Quick option – creates venv, installs deps, runs seed and export
bash scripts/setup.sh

# Or step-by-step
cd scripts
python3 -m venv ../.venv
source ../.venv/bin/activate
pip install -r requirements.txt
python seed.py      # inserts synthetic data into Supabase
python export.py    # generates files in sample_data/
```

## Environment Variables

Copy `.env.example` and fill in with your Supabase credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (only for Python scripts) |
| `DATABASE_URL` | Direct connection to PostgreSQL |

## Generated Data

The scripts in `scripts/` generate minimum synthetic data to validate the schema. Real data is captured by the frontend when real users interact with the platform.

| Entity | Synthetic Records |
|---|---|
| Users | 3 |
| Sessions | 5 |
| Events per table | ~5–15 |

The exported files in `sample_data/` include CSV and JSON per table, plus a consolidated Excel file (`squishimallows_data.xlsx`).

## CI/CD

The workflow `.github/workflows/skeleton-ci.yml` automatically validates on every push:

1. **Frontend** – Next.js lint and build
2. **Scripts** – Python syntax validation
3. **Structure** – verifies that all required files exist

## Team Roles

| Role | Member |
|---|---|
| Scrum Master | Horta Sánchez |
| Product Owner | Romero Cetina |
| Back-end Developer | De Aquino Castellanos |
| Back-end Developer | Hernández León |
| DevOps | Fuentes Marín |
| Front-end Developer | Pech Xool |
| Quality Assurance | Pérez López |
