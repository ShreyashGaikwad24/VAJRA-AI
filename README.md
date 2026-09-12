# SAFE AI (Smart AI Framework for Enterprise Industrial Safety)

Phase 1 foundation repository layout for a national-level hackathon build.

## Structure

- frontend: React 19 + TypeScript + Vite foundation
- backend: FastAPI foundation
- docs: project documentation
- assets: design and static assets
- database: DB artifacts and migrations container
- scripts: automation scripts
- .github: GitHub workflows/templates

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Compose

```bash
docker compose up --build
```

## Environment Files

- Root: `.env.example`
- Frontend: `frontend/.env.example`
- Backend: `backend/.env.example`

## Notes

This phase intentionally contains infrastructure and configuration only. No dashboards, APIs, digital twin, SAFE-RL, analytics, or business workflows are implemented.
