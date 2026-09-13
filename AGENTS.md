# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack
- **Backend**: Python 3.12, FastAPI + SQLAlchemy 2.0 + Alembic, PostgreSQL (`ai_services_platform` DB, user: `watsonx_user`)
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, plain JS (not TypeScript despite `@types/*` dev deps)
- **Auth**: JWT via `python-jose` (HS256) + OAuth (Google/Microsoft/GitHub/LinkedIn) via `httpx`

## Commands

### Backend (run from `backend/`)
```bash
# Activate venv first (Windows)
venv\Scripts\activate
# Run dev server
uvicorn app.main:app --reload
# Run tests
pytest
# Run single test
pytest tests/test_api/test_contact.py::test_function_name -v
```

### Frontend (run from `frontend/`)
```bash
npm run dev   # :3000
npm run build
npm run lint  # next lint
```

## Critical Architecture Gotchas

### Dual DB session problem
`app/core/database.py` and `app/db/session.py` **both** define `engine` + `SessionLocal` + `get_db` independently. Routes use `from ...core.database import get_db`; the `app/db/session.py` version is a dead duplicate. Only modify `app/core/database.py`.

### Middleware execution order is inverted
In `app/main.py`, middleware is added with `app.add_middleware()` in reverse-execution order (FastAPI applies last-added first):
```python
app.add_middleware(SecurityHeadersMiddleware)  # executes last
app.add_middleware(RequestLoggingMiddleware)   # executes second
app.add_middleware(AuthenticationMiddleware)   # executes first
```

### Public paths are prefix-matched, not exact
`AuthenticationMiddleware.PUBLIC_PATHS` uses `path.startswith()` — adding `/api/contact` makes ALL `/api/contact*` paths public. Be precise when adding new public routes.

### User model has two `Base` declarations
`app/models/user.py` declares its own `Base = declarative_base()` separate from `app/core/database.py`'s `Base`. Tables are created via `Base.metadata.create_all()` in `database.py` which imports the models — both bases must be imported before `create_all` or the `users` table won't be created.

### `init_db` is called twice on startup
`app/main.py` startup event calls `app.db.init_db()` AND `app/core/database.py.init_db()` both exist with overlapping logic (create tables + super admin). The `app/db/__init__.py` version calls `get_password_hash` from `app.core.auth` which doesn't export that function — it will fail silently (logged but not raised).

### Frontend token storage is split
- `middleware.js` reads auth token from **cookies** (`request.cookies.get('token')`)
- `context/AuthContext.js` stores/reads from **`localStorage`** (`auth_token` key)
These are not in sync — middleware route protection and in-app auth state use different storage locations.

### Next.js API rewrites proxy to backend
`/api/*` in the frontend is rewritten to `http://localhost:8000/api/*` via `next.config.js`. Do not add backend routes without the `/api` prefix if they need to be callable from the frontend.

### `alembic.ini` and `docker-compose.yml` are empty stubs
Neither has been configured. Alembic migrations are not set up — the app uses `Base.metadata.create_all()` directly on startup. Docker Compose has no services defined.

## Code Style

### Backend
- Pydantic v2 (`pydantic-settings`): validators use `@field_validator(..., mode="before")` not `@validator`
- `Settings` class uses `model_config = SettingsConfigDict(...)` not `class Config:`
- `DATABASE_URL` is a `@property` on `Settings`, not a plain field — cannot be overridden via env var directly
- Auth exceptions subclass `HTTPException` directly (see `app/core/auth.py`) — raise them by instantiation, not by raising `HTTPException` inline
- Use `from ...core.database import get_db` (relative imports) in route files; use `from app.core.database import get_db` (absolute) in core/middleware files

### Frontend
- App Router (`app/` directory), `.js` files only (no `.tsx`)
- Client components must have `'use client'` directive at top
- Tailwind custom tokens: `primary-*` (blue scale), custom animations `fade-in`, `slide-up`, `float`, `glow`
- `clsx` + `tailwind-merge` available for conditional class merging
- `useAuth()` hook from `context/AuthContext.js` for all auth state; `withAuth(Component, {role})` HOC for page-level protection

## Environment Variables (Backend `.env`)
```
SECRET_KEY=          # Required; defaults to random token (rotates on restart if not set!)
DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD
GROQ_API_KEY         # Optional, for future chat
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
MICROSOFT_CLIENT_ID / MICROSOFT_CLIENT_SECRET
GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET
SUPER_ADMIN_EMAIL    # Overrides default admin@aiservices.com
```
`SECRET_KEY` defaults to `secrets.token_urlsafe(32)` **per process** — all JWT tokens are invalidated on every backend restart unless `SECRET_KEY` is set in `.env`.
