# Vehicle Rental Marketplace

A full-stack vehicle rental marketplace: renters browse and book vehicles, owners list and manage inventory, and admins moderate users, listings, and bookings.

# Live Demo : https://vehicle-rental-marketplace-2.onrender.com/

## Stack

| Layer | Tech |
|-------|------|
| Backend | Go, [Gin](https://gin-gonic.com/), GORM, JWT auth |
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query |
| Database | PostgreSQL (Docker / production) or SQLite (local default) |
| Deploy | Docker, [Render](https://render.com) |

## Project structure

```
vehicle-rental-marketplace/
├── backend/          # Go API (port 8000)
├── frontend/         # React SPA (Vite dev :5173, nginx :80 in Docker)
└── docker-compose.yml
```

## Features

- **Renters** — browse vehicles, filter by city/category/price, create and cancel bookings
- **Owners** — list vehicles, manage listings, view bookings on their vehicles
- **Admins** — dashboard stats, user management, approve/reject vehicles and bookings

Default seeded admin (override with env vars):

- Email: `admin@example.com`
- Password: `ChangeMeAdmin123!`

---

## Quick start (Docker Compose)

Runs Postgres, API, and frontend together.

**Prerequisites:** Docker and Docker Compose

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000 |
| Health check | http://localhost:8000/health |

The frontend image is built with `VITE_API_BASE=http://localhost:8000/api/v1` so the browser talks to the API on your machine.

Stop:

```bash
docker compose down
```

---

## Local development (without Docker)

### Backend

**Prerequisites:** Go 1.21+

```bash
cd backend
cp env.example .env   # optional; edit as needed
go run .
```

API listens on `http://localhost:8000` (or `PORT` from env).

SQLite is used by default (`DATABASE_URL=sqlite:///./rental.db`). For Postgres locally:

```bash
DATABASE_URL=postgresql://rental:rental@localhost:5432/rental go run .
```

### Frontend

**Prerequisites:** Node.js 20+

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

With no env file, requests go to `/api/v1` and Vite proxies them to `http://127.0.0.1:8000` (see `frontend/vite.config.ts`).

To point at a remote API (e.g. Render), create `frontend/.env.local`:

```env
VITE_API_BASE=https://your-api.onrender.com/api/v1
```

---

## Docker (individual services)

### Backend

```bash
cd backend
docker build -t vehicle-rental-api .
docker run --rm -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/dbname \
  -e SECRET_KEY=your-secret \
  -e CORS_ORIGINS=http://localhost:5173 \
  vehicle-rental-api
```

### Frontend

The API URL is baked in at **build** time via `VITE_API_BASE`.

```bash
cd frontend
docker build -t vehicle-rental-web \
  --build-arg VITE_API_BASE=https://your-api.onrender.com/api/v1 \
  .
docker run --rm -p 5173:80 vehicle-rental-web
```

Open http://localhost:5173.

> **Note:** Do not proxy `/api` to a hostname `api` in `nginx.conf` on Render — that name only exists inside docker-compose. The frontend calls the backend directly using `VITE_API_BASE`.

---

## Environment variables

### Backend

Copy `backend/env.example` to `.env` or set on your host.

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | App display name | `Vehicle Rental Marketplace` |
| `SECRET_KEY` | JWT signing secret | *(change in production)* |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime | `1440` |
| `DATABASE_URL` | `sqlite:///./rental.db` or Postgres URL | SQLite file |
| `CORS_ORIGINS` | Comma-separated allowed browser origins | `http://localhost:5173,...` |
| `TRUSTED_PROXIES` | Proxy IPs for Gin | `127.0.0.1,::1` |
| `SEED_ADMIN_EMAIL` | First-run admin email | `admin@example.com` |
| `SEED_ADMIN_PASSWORD` | First-run admin password | `ChangeMeAdmin123!` |
| `GIN_MODE` | `debug` or `release` | `debug` |
| `PORT` | HTTP port (Render sets this) | `8000` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | Full API base URL including `/api/v1` | `/api/v1` (same origin / Vite proxy) |

Example: `VITE_API_BASE=https://your-api.onrender.com/api/v1`

---

## Deploying on Render

Use **two** web services (or one API + one Docker/static frontend).

### 1. Backend (Docker)

- **Root directory:** `backend` (or repo root with context `backend`)
- **Dockerfile path:** `backend/Dockerfile`
- **Health check path:** `/health`

**Environment (minimum):**

```env
DATABASE_URL=<Render Postgres internal URL>
SECRET_KEY=<long random string>
CORS_ORIGINS=https://your-frontend.onrender.com,http://localhost:5173
GIN_MODE=release
```

Render sets `PORT` automatically.

### 2. Frontend (Docker)

- **Docker build context:** `frontend`
- **Dockerfile path:** `frontend/Dockerfile`
- **Health check path:** `/`
- **Docker command:** leave empty

**Environment:**

```env
VITE_API_BASE=https://your-api.onrender.com/api/v1
```

Redeploy with **Clear build cache** after changing `VITE_API_BASE`.

Set backend `CORS_ORIGINS` to your frontend’s exact URL (scheme + host, no trailing slash).

---

## API overview

Base path: `/api/v1`

| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login` |
| Users | `GET /users/me`, `POST /users/me/become-owner` |
| Vehicles | `GET /vehicles`, `GET /vehicles/:id`, owner/admin routes |
| Bookings | `POST /bookings`, `GET /bookings/mine`, `GET /bookings/owner`, cancel/admin |
| Admin | `GET /admin/stats`, `/admin/users`, `/admin/vehicles`, `/admin/bookings` |

Protected routes require header: `Authorization: Bearer <token>`.

Health: `GET /health` → `{"status":"ok"}`

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| `403` on `OPTIONS /api/v1/...` | CORS | Add frontend URL to backend `CORS_ORIGINS` and redeploy API |
| `host not found in upstream "api"` (nginx) | Old `nginx.conf` proxying to docker-compose service `api` | Use static-only nginx; set `VITE_API_BASE` to full API URL |
| Frontend calls wrong API | `VITE_API_BASE` missing or not rebuilt | Set env on Render, clear cache, redeploy frontend |
| `404` on `/` for API service | Normal | API has no root page; use `/health` or `/api/v1/...` |

---

## Scripts

**Frontend**

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # serve production build locally
```

**Backend**

```bash
go run .         # run API
go test ./...    # run tests
```

---

## License

Private / project-specific — add a license file if you open-source this repo.
