# AI Services Website

A full-stack template for an AI services / learning platform.  
**Frontend:** Next.js 14 (App Router) + Tailwind CSS  
**Backend:** FastAPI + PostgreSQL + JWT auth + OAuth (Google, Microsoft, GitHub, LinkedIn)

---

## Project Structure

```
ai-services-website/
├── frontend/          # Next.js web application
└── backend/           # FastAPI server
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- Python 3.10+
- PostgreSQL 14+

---

### 1 — Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env       # Windows
# cp .env.example .env       # macOS / Linux
# Edit .env — fill in DB credentials, SECRET_KEY, etc.

# Start the server (auto-creates DB tables + super-admin on first run)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs available at: http://localhost:8000/docs

---

### 2 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App available at: http://localhost:3000

---

## Auth Flow

The app uses **OAuth-only** registration (no email/password signup for regular users).  
The super-admin account is seeded automatically from `FIRST_SUPERUSER` in `.env`.

Supported OAuth providers (configure credentials in `.env`):
- Google
- Microsoft
- GitHub
- LinkedIn

---

## Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login (super-admin email/password) |
| POST | `/api/auth/register` | Register via OAuth info |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/verify` | Verify JWT token |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/oauth/callback` | Exchange OAuth code for JWT |
| POST | `/api/contact` | Submit contact form |
| GET | `/health` | Health check |

---

## Docker (optional)

```bash
# Copy and edit the env file first, then:
docker compose up --build
```

---

## Environment Variables

See [`backend/.env.example`](backend/.env.example) for all available settings.
