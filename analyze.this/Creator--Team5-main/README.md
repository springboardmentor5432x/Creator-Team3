# CreatorIQ — Milestone 1 Starter

This folder contains a working end-to-end skeleton covering everything required for
Milestone 1 (Week 1 & 2): auth, RBAC, DB models, dashboard shell, and one live chart
fed by a dummy analytics endpoint.

```
creatoriq/
├── creatoriq-backend/     # FastAPI + PostgreSQL + JWT auth
└── creatoriq-frontend/    # React + Vite + Tailwind + Recharts
```

## 1. Backend setup

```bash
cd creatoriq-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env: set DATABASE_URL to your local Postgres or Neon connection string,
# and set SECRET_KEY to a random string

uvicorn app.main:app --reload
```

The API will be live at `http://localhost:8000`. Visit `http://localhost:8000/docs`
for the interactive Swagger UI — use this to test `/auth/register` and `/auth/login`
before wiring up the frontend.

Tables are auto-created on startup for Milestone 1 (`Base.metadata.create_all`).
Once you're comfortable, switch to Alembic migrations:

```bash
alembic init alembic
# point alembic/env.py's target_metadata to app.database.Base.metadata
alembic revision --autogenerate -m "init tables"
alembic upgrade head
```

## 2. Frontend setup

```bash
cd creatoriq-frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173`.

## 3. Try it end-to-end

1. Go to `http://localhost:5173/register`, create an account as role `creator`.
2. You'll be auto-logged-in and redirected to `/dashboard`.
3. The Overview page calls `/analytics/overview` (protected by JWT) and renders a
   live line chart — this satisfies the Milestone 1 requirement for a functional
   analytics visualization component, even though the data is dummy for now.
4. Try registering a second account as role `admin`, then hit
   `GET /users/admin-only` in Swagger with that admin's token — you'll get a 200.
   Try it with the creator's token — you'll get a 403. That's your RBAC working.

## 4. What's deliberately deferred to Milestone 2+

- Real YouTube / Instagram API integration (currently dummy data in `analytics.py`)
- MongoDB (only needed once analytics payloads become variable-shaped)
- Redis caching, Celery background jobs, Docker/deployment

Keeping these out of Milestone 1 matches the evaluation checklist exactly:
auth + RBAC + one working chart + schema + wireframes — nothing more is needed yet.
