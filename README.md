# OPC Genie — One Person Company Platform

> **Your One-Person Company** — An AI-powered business-in-a-box platform for solo founders. Describe your business and your Genie builds the site, writes the copy, and runs sales & support — so you can launch and own a real company, solo.

---

## Table of Contents

1. [What This Platform Does](#what-this-platform-does)
2. [Feature Breakdown](#feature-breakdown)
3. [Technical Stack](#technical-stack)
4. [Project Structure](#project-structure)
5. [Data Models](#data-models)
6. [API Reference](#api-reference)
7. [Quick Start](#quick-start)
8. [Environment Variables](#environment-variables)
9. [Docker](#docker)
10. [Known Architecture Gotchas](#known-architecture-gotchas)
11. [Scope of Improvement](#scope-of-improvement)

---

## What This Platform Does

OPC Genie is a full-stack SaaS platform built for **solo founders, independent consultants, freelancers, and one-person businesses** who want to launch and run a real company without hiring a team. It is designed around four core pillars:

- **Build** — AI generates your website, offer pages, and brand copy from a plain-language description of your business
- **Sell** — Offer builder with payment-ready pages, smart pricing recommendations, and sales automation
- **Run** — AI Genie handles inbound enquiries, follow-ups, and customer support around the clock
- **Grow** — Founder analytics, content studio, community, and business playbooks

The platform ships a **three-tier pricing model** (Free Starter → Pro Founder → Enterprise) and is designed for a founder to go from idea to a live, revenue-generating business in a single day.

---

## Feature Breakdown

### Public / Marketing

| Page | Description |
|------|-------------|
| `/` | Hero, stats bar, feature grid, testimonials, final CTA |
| `/pricing` | Plan comparison table with FAQ |
| `/platform/*` | Deep-dive pages for each core capability |
| `/resources` | Founder playbooks, guides, templates, and business tools |
| `/community` | Founder forum, live events, member directory |
| `/contact` | Contact form (stored in DB, email forwarded) |
| `/get_started` | Onboarding / sign-up funnel entry |

### Platform Feature Pages

| Route | Content |
|-------|---------|
| `/platform/skillgraph-engine` | AI Website Builder |
| `/platform/industry-simulator` | AI Genie Assistant (live `/api/chat` demo) |
| `/platform/peer-mentor-matching` | Offers & Payments |
| `/platform/content-co-creation` | Content Studio |

> The header **Features** dropdown, footer Platform links, and `site.config.js` feature cards all point directly to these routes. No redirects are needed.

### Authenticated User

| Page | Description |
|------|-------------|
| `/dashboard` | Personalised founder dashboard (API-wired; reads from `siteConfig` + `/api/auth/me`) |
| `/profile` | User profile management |

### Admin Panel (`/admin`)

The admin panel uses the same clean **white + `primary-600` blue** visual theme as the public landing page — consistent typography, white card surfaces, `gray-50` backgrounds, and blue accent colours throughout.

| Section | Description |
|---------|-------------|
| `/admin/login` | Admin-only sign-in page (email + password); redirects to dashboard on success |
| `/admin` | Overview dashboard — Total Users, Active Founders, AI Queries, Monthly Revenue |
| `/admin/users` | User management (roles: `User`, `Founder`, `Admin`, `Enterprise`) |
| `/admin/content` | Offer management — create/edit/delete offers via `/api/content/offers`; Playbooks tab |
| `/admin/settings` | Live site settings editor — all brand copy, pricing, features, and nav propagate to frontend without redeployment |
| `/admin/analytics` | Business Intelligence — Overview, Revenue, Users, Offers, Forecasting tabs |
| `/admin/support` | Contact form submissions / support queue |
| `/admin/ai-tools` | AI Genie configuration, conversation monitoring, live testing panel |

### Auth System

- **OAuth-only** registration for regular users (Google, Microsoft, GitHub, LinkedIn)
- **Email + password** login only for the seeded super-admin account (`/admin/login`)
- JWT tokens (HS256) stored as an **httpOnly cookie** set by the backend; also written to `document.cookie` on the Next.js origin so the middleware can read it for route protection
- Role-based access control enforced at both Next.js middleware and FastAPI route level

---

## Technical Stack

### Backend

| Layer | Technology |
|-------|-----------|
| Language | Python 3.12 |
| Web framework | FastAPI 0.141 |
| ORM | SQLAlchemy 2.0 (async-ready) |
| Migrations | Alembic 1.20 — configured and initialised; initial migration script generated |
| Database | PostgreSQL 14+ (`ai_services_platform` DB) |
| Auth | `python-jose` (JWT HS256) + `passlib`/`bcrypt` for password hashing |
| OAuth | `httpx` (direct token exchange with Google / Microsoft / GitHub / LinkedIn) |
| Validation | Pydantic v2 + `pydantic-settings` |
| File handling | `python-multipart`, `aiofiles` |
| Templates | Jinja2 (email templates) |
| AI integration | Groq SDK (dependency installed; `/api/chat` route not yet implemented) |
| Server | Uvicorn with standard extras |

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (`.js`) |
| Styling | Tailwind CSS 3 + `@tailwindcss/forms`, `typography`, `aspect-ratio` |
| Animation | Framer Motion 10 |
| Icons | Lucide React + React Icons |
| Config | `site.config.js` + `useSiteConfig()` hook fetches `/api/settings/public` — DB values override static defaults at runtime |
| Auth state | `context/AuthContext.js` → `localStorage` + `useAuth()` hook + `withAuth()` HOC |
| Route protection | `middleware.js` reads JWT from cookie |
| API proxy | `next.config.js` rewrites `/api/*` → `http://localhost:8000/api/*` |
| Route aliases | `next.config.js` redirects clean platform URLs to directory-based routes |
| Utilities | `clsx`, `tailwind-merge`, `jwt-decode` |

### Infrastructure

| Component | Technology |
|-----------|-----------|
| Containerisation | Docker + Docker Compose (compose file is a stub — not yet configured with services) |
| Configuration | `site.config.js` — single file controls all brand copy, pricing, features, and nav without code changes |
| Settings persistence | `site_settings` table in PostgreSQL (JSONB key-value store) — admin edits sync to DB and override `site.config.js` at runtime |

---

## Project Structure

```
one-person-company/
├── frontend/
│   ├── app/
│   │   ├── page.js                    # Home page
│   │   ├── layout.js                  # Root layout + SEO metadata
│   │   ├── header.js / footer.js      # Global nav + footer (config-driven)
│   │   ├── admin/                     # Admin panel (white/blue landing-page theme)
│   │   │   ├── layout.js              # Admin-specific layout wrapper
│   │   │   ├── page.js                # Dashboard overview
│   │   │   ├── login/                 # Admin sign-in (email + password)
│   │   │   ├── users/                 # User management
│   │   │   ├── content/               # Offer management
│   │   │   ├── analytics/             # Business intelligence
│   │   │   ├── ai-tools/              # AI Genie admin
│   │   │   ├── settings/              # Live site settings editor
│   │   │   └── support/               # Support queue
│   │   ├── community/                 # Founder forum & events
│   │   ├── contact/                   # Contact form
│   │   ├── dashboard/                 # Authenticated founder dashboard
│   │   ├── platform/
│   │   │   ├── skillgraph-engine/     # AI Website Builder
│   │   │   ├── industry-simulator/    # AI Genie Assistant
│   │   │   ├── peer-mentor-matching/  # Offers & Payments
│   │   │   └── content-co-creation/   # Content Studio
│   │   ├── pricing/                   # Pricing page
│   │   ├── profile/                   # User profile
│   │   ├── resources/                 # Founder playbooks & resources
│   │   ├── get_started/               # Onboarding funnel
│   │   ├── login/ & signup/           # Auth pages
│   │   └── providers.js
│   ├── context/
│   │   └── AuthContext.js             # Global auth state
│   ├── hooks/
│   │   └── useSiteConfig.js           # Config hook: static → DB override
│   ├── middleware.js                   # JWT cookie check for protected routes
│   ├── site.config.js                 # ⚡ Single source of truth for brand defaults
│   ├── next.config.js                 # API proxy + platform URL redirects
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app, middleware, startup events
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth_routes.py     # Login, register, OAuth, me, verify, logout
│   │   │   │   ├── content_routes.py  # /api/content/offers (CRUD)
│   │   │   │   ├── community_routes.py # /api/community/* (threads, events, members)
│   │   │   │   ├── resource_routes.py  # /api/resources (playbooks)
│   │   │   │   ├── page_routes.py      # /api/pages (CMS pages)
│   │   │   │   ├── settings_routes.py  # /api/settings/public + admin CRUD
│   │   │   │   └── contact_routes.py   # /api/contact
│   │   │   └── dependencies.py
│   │   ├── core/
│   │   │   ├── database.py            # Engine, SessionLocal, Base, get_db, init_db
│   │   │   └── auth.py                # JWT helpers, password hashing, auth exceptions
│   │   ├── models/
│   │   │   ├── user.py                # User, UserRole, OAuthProvider
│   │   │   ├── offer.py               # Offer (replaces Course)
│   │   │   ├── content_asset.py       # ContentAsset (replaces Resource for media)
│   │   │   ├── community.py           # CommunityThread, Post, Member, Event, Settings
│   │   │   ├── resource.py            # Resource (playbooks/guides)
│   │   │   ├── page.py                # CMS page model
│   │   │   ├── site_settings.py       # SiteSetting (JSONB key-value)
│   │   │   └── contact.py             # ContactSubmission
│   │   ├── schemas/                   # Pydantic request/response schemas
│   │   ├── services/                  # Business logic layer
│   │   └── db/                        # DB init helpers + playbook seed data
│   ├── alembic/                       # Migration environment (configured + initialised)
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       └── aabc0f0a2cfd_*.py      # Rename Course→Offer, Resource→ContentAsset
│   ├── push_config.py                 # Utility: push site.config.js defaults to DB
│   ├── tests/                         # pytest test suite
│   ├── config.py                      # Settings via pydantic-settings
│   └── requirements.txt
│
└── docker-compose.yml                 # (stub — needs service definitions)
```

---

## Data Models

| Model | Table | Purpose |
|-------|-------|---------|
| `User` | `users` | All registered users; roles: `user`, `admin`, `super_admin` |
| `Offer` | `offers` | Offer catalogue — products and services sold by founders |
| `ContentAsset` | `content_assets` | Media and downloadable assets (videos, templates, guides) |
| `Resource` | `resources` | Founder playbooks and reference guides |
| `CommunityThread` | `community_threads` | Forum discussion threads with tags, view/like/reply counters |
| `CommunityPost` | `community_posts` | Replies within threads; supports accepted-answer marking |
| `CommunityMember` | `community_members` | Extended community profile with badges, reputation, bans |
| `CommunityEvent` | `community_events` | Webinars, AMAs, founder meetups, workshops with RSVP counts |
| `CommunitySettings` | `community_settings` | Admin-controlled community config (rules, categories, feature flags) |
| `SiteSetting` | `site_settings` | JSONB key-value store for live site configuration (brand, pricing, etc.) |
| `ContactSubmission` | `contacts` | Contact form submissions |
| `Page` | `pages` | CMS-managed pages (header nav flag controls visibility in nav) |

---

## API Reference

### Auth

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `POST` | `/api/auth/login` | Public | Super-admin email/password login — sets httpOnly `token` cookie + returns JWT |
| `POST` | `/api/auth/register` | Public | Register via OAuth token exchange |
| `POST` | `/api/auth/logout` | Auth | Clear auth cookie |
| `GET` | `/api/auth/verify` | Auth | Verify JWT validity (Bearer header) |
| `GET` | `/api/auth/me` | Auth | Get current user profile (cookie or Bearer) |
| `POST` | `/api/auth/oauth/callback` | Public | Exchange OAuth code → JWT |
| `POST` | `/api/auth/change-password` | Admin | Change the admin account password |

### Offers (Content)

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/api/content/offers` | Auth | List offers |
| `POST` | `/api/content/offers` | Admin | Create an offer |
| `PUT` | `/api/content/offers/{id}` | Admin | Update an offer |
| `DELETE` | `/api/content/offers/{id}` | Admin | Delete an offer |

### Content Assets / Resources

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/api/content-assets/public` | Public | List published content assets |
| `GET` | `/api/resources` | Public | List playbooks/guides (filterable by category, content type, search) |
| `POST` | `/api/resources` | Admin | Create a resource |
| `PUT` | `/api/resources/{id}` | Admin | Update a resource |
| `DELETE` | `/api/resources/{id}` | Admin | Delete a resource |

### Community

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/api/community/threads` | Public | List forum threads |
| `POST` | `/api/community/threads` | Auth | Create a thread |
| `GET` | `/api/community/threads/{id}` | Public | Get thread + posts |
| `POST` | `/api/community/threads/{id}/posts` | Auth | Reply to a thread |
| `GET` | `/api/community/events` | Public | List upcoming events |
| `POST` | `/api/community/events` | Admin | Create an event |
| `GET` | `/api/community/members` | Auth | List community members |
| `GET` | `/api/community/settings` | Public | Get community config |

### Pages (CMS)

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/api/pages/public` | Public | List published pages (used by header nav) |
| `GET` | `/api/pages` | Admin | List all pages |
| `POST` | `/api/pages` | Admin | Create a page |
| `PUT` | `/api/pages/{id}` | Admin | Update a page |
| `DELETE` | `/api/pages/{id}` | Admin | Delete a page |

### Settings

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/api/settings/public` | Public | Get all public settings (used by `useSiteConfig()`) |
| `GET` | `/api/settings` | Admin | Get full settings including private keys |
| `PUT` | `/api/settings` | Admin | Update one or more settings keys |

### AI Genie *(not yet implemented)*

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `POST` | `/api/chat` | Auth | Send a message to the AI Genie (Groq backend) — **route pending** |

### Other

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `POST` | `/api/contact` | Public | Submit contact form |
| `GET` | `/health` | Public | Health check |
| `GET` | `/api/db-status` | Public | Database connection status |

Full interactive docs: **http://localhost:8000/docs**

---

## Quick Start

### Prerequisites

- Node.js v18+
- Python 3.12 (use `py -3` launcher on Windows)
- PostgreSQL 14+

### 1 — Backend

```bash
cd backend

# Create a fresh virtual environment
# Windows (PowerShell)
py -3 -m venv venv
.\venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# If PowerShell blocks the activation script, run once:
# Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Install dependencies
pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary pydantic pydantic-settings python-dotenv "python-jose[cryptography]" "passlib[bcrypt]" python-multipart email-validator alembic httpx aiofiles pyyaml

# Configure environment
copy .env.example .env          # Windows
# cp .env.example .env          # macOS / Linux
# Edit .env — fill in DB credentials, SECRET_KEY, and OAuth app credentials

# Run Alembic migrations (creates tables with migration history)
alembic upgrade head

# Start the server
# Auto-seeds super-admin and default site settings on first run
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> ⚠️ **Do not use `pip install -r requirements.txt`** if the venv was originally created at a different path (e.g. copied from another project). The launcher scripts inside `venv/Scripts/` embed the absolute path they were created with, and will fail with *"Unable to create process"*. Always recreate the venv in-place with `py -3 -m venv venv` before installing.

### 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Frontend application (landing page) |
| http://localhost:3000/admin/login | Admin sign-in |
| http://localhost:8000/docs | FastAPI Swagger UI |
| http://localhost:8000/redoc | FastAPI ReDoc |

### First Login

The super-admin account is seeded automatically from `SUPER_ADMIN_EMAIL` in `.env` (defaults to `admin@aiservices.com`, password set via `FIRST_SUPERUSER_PASSWORD`).

Navigate to **`/admin/login`** and sign in with the super-admin email and password. The login sets a `token` cookie on both the backend origin and the Next.js origin so the middleware can protect subsequent admin routes correctly.

All other users sign in via OAuth at `/login`.

### Pushing Default Config to the Database

After the first run, push the `site.config.js` defaults into the `site_settings` DB table so the admin Settings page has data to work with:

```bash
cd backend
python push_config.py
```

### Site Configuration

All brand copy, pricing, features, and nav labels are controlled from two places — whichever is more specific wins:

1. **`frontend/site.config.js`** — static fallback defaults (brand name, hero copy, features, pricing, etc.)
2. **`site_settings` DB table** — admin edits via `/admin/settings` write JSONB rows here and override the static config at runtime via `/api/settings/public`

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# Required
SECRET_KEY=           # Static secret — if unset, rotates on every restart (invalidates all JWTs)

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_services_platform
DB_USER=watsonx_user
DB_PASSWORD=

# Super-admin seed
SUPER_ADMIN_EMAIL=admin@aiservices.com
FIRST_SUPERUSER_PASSWORD=

# OAuth providers (configure at least one)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# AI Genie (required for /api/chat)
GROQ_API_KEY=
```

> ⚠️ **`SECRET_KEY` is critical.** If left unset, a new random key is generated on every backend restart, invalidating all issued JWTs and logging out every user.

---

## Docker

The `docker-compose.yml` is currently a stub and does not define services. To run with Docker, the compose file needs:
- A `postgres` service
- A `backend` service (Dockerfile in `backend/Dockerfile/`)
- A `frontend` service

Once configured:

```bash
# Copy and edit the env file first, then:
docker compose up --build
```

---

## Known Architecture Gotchas

| Issue | Impact | Location |
|-------|--------|----------|
| **Token storage split** | Middleware reads cookie; app reads `localStorage` — route protection and UI auth state can desync. Admin login now writes to both, but regular OAuth login only writes `localStorage` | `middleware.js` vs `context/AuthContext.js` |
| **`SECRET_KEY` not set** | All JWTs invalidated on every restart | `config.py` / `.env` |
| **`/api/chat` not implemented** | AI Genie live demo falls back to a graceful error message | `platform/industry-simulator/page.js` + missing `chat_routes.py` |
| **Platform directory names are legacy** | Page directories still use original EdTech names (`skillgraph-engine` etc.) — nav and config now point to them correctly, but renaming would improve clarity | `frontend/app/platform/` |
| **Public path prefix matching** | `startswith()` check makes all sub-paths of a route public | `AuthenticationMiddleware` |
| **venv path is hardcoded** | `venv/Scripts/` launchers embed the creation-time absolute path — copying the project breaks them | Recreate with `py -3 -m venv venv` at the new location |
| **Docker Compose is empty** | Cannot containerise as-is | `docker-compose.yml` |

---

## Scope of Improvement

### 1. AI Genie — `/api/chat` Backend Route (Highest Priority)

The Groq SDK is installed but **not wired to any endpoint**. The AI Genie live demo on `/platform/industry-simulator` calls `/api/chat` and gracefully shows an error. To make it live:

- Create `backend/app/api/routes/chat_routes.py` with a `POST /api/chat` endpoint calling Groq
- Add a system prompt describing OPC Genie's role as a business-building assistant
- Register the router in `main.py`
- Implement per-user query quotas matching pricing tiers
- Persist chat history per user session

### 2. Auth Token Storage Unification

The admin login page now writes the JWT to `document.cookie` on the Next.js origin so the middleware works correctly. Regular OAuth users still rely purely on `localStorage`. Unify both paths:

- Standardise on **httpOnly cookies** for all auth flows (admin + OAuth)
- Remove the `localStorage` fallback from `AuthContext.js`
- Ensure logout clears both storage locations consistently

### 3. Offer Builder — Wire Founder-Facing Flow

The `/admin/content` page calls `/api/content/offers` correctly. The next step is the **founder-facing offer builder**:

- Self-serve offer creation at `/dashboard/offers/new`
- AI-generated offer copy from a plain-language description
- Payment page with Stripe/Razorpay integration
- Public offer landing page at `/{username}/{offer-slug}`

### 4. Payments & Subscription Management

The pricing page and plan structure are fully designed but **there is no payment integration**:

- Integrate Stripe (international) or Razorpay (India)
- `UserSubscription` model to track active plan, billing cycle, renewal date
- Enforce tier-based feature gating in both API middleware and frontend UI
- Webhook handler for subscription lifecycle events (renewal, cancellation, failure)

### 5. Admin Analytics — Real Data

`/admin/analytics` has a working UI but sample data is hardcoded. Connect it to real aggregation queries:

- Daily/weekly active users, new signups, churn
- Offer creation and sales funnel
- Revenue by plan (post-payments integration)
- AI Genie usage metrics (queries per user, topics)
- Community engagement metrics

### 6. Community — Wire Frontend to Backend

The community models (`CommunityThread`, `CommunityPost`, `CommunityEvent`, `CommunityMember`) are fully built and the API routes exist. The frontend `/community` page exists. **They are not connected**:

- Build thread list, thread detail, and reply composer views backed by the existing API
- Implement event RSVP and attendee count updates
- Moderation actions (hide post, ban member) available in models but not surfaced in admin UI

### 7. Platform Route Rename (Low effort, high clarity)

The header Features dropdown, footer Platform links, and `site.config.js` feature cards **now all point to the correct existing routes**. The directories still carry their original EdTech names which is cosmetic only. To clean up:

```
platform/skillgraph-engine/    →  platform/website-builder/
platform/industry-simulator/   →  platform/ai-genie/
platform/peer-mentor-matching/ →  platform/offers/
platform/content-co-creation/  →  platform/content-studio/
```

After renaming, update all `href` references in `header.js`, `site.config.js` (features + footerLinks), and any `<Link>` in the feature pages themselves.

### 8. Docker Compose

Define services in `docker-compose.yml` so the full stack can be stood up with a single command:

```yaml
services:
  db:        # postgres:16
  backend:   # uvicorn behind gunicorn
  frontend:  # next build + next start
  nginx:     # reverse proxy (optional)
```

### 9. Email Notifications

Jinja2 is already a dependency (email templates implied):

- Welcome email on first OAuth login / sign-up
- Offer published confirmation
- New lead / sale notification to the founder
- Password-reset flow for the admin account
- Event reminders for registered attendees

### 10. Profile Page — API-Wired

`/profile/page.js` currently uses blank placeholder defaults. Wire it to `/api/auth/me` on mount and implement a `PUT /api/auth/me` endpoint to persist profile updates.

### 11. SEO & Performance

- Implement `generateMetadata` on offer and resource pages for dynamic OG tags
- Add structured data (`Product` schema.org) for offer pages
- Set up image optimisation pipeline for offer thumbnails
- Lighthouse audit and Core Web Vitals baseline before launch
