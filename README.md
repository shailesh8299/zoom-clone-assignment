# Zoom Clone

A functional Zoom-like video conferencing web app built with Next.js + FastAPI.

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Python 3.11 + FastAPI + SQLAlchemy
- Database: SQLite

## Setup

### Backend
cd server
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv
python seed.py          # seeds sample data
uvicorn main:app --reload --port 8000

### Frontend
cd client
npm install
npm run dev             # runs on localhost:3000

## DB Schema
- meetings: id (8-char), title, host_id, desc, sched_at, dur_min, link, active, created
- participants: id, mtg_id (FK), name, joined, is_host

## Assumptions
- Default user is always logged in (no auth flow)
- Instant meetings have sched_at = null
- Video/audio are simulated (no WebRTC in this build)
- Meeting IDs are 8-char uppercase alphanumeric

## Features
- Dashboard with New Meeting, Join, Schedule, Share Screen
- Instant meeting creation with unique ID
- Join by meeting ID with name entry
- Schedule meetings with date/time/duration
- Meeting room with participant tiles and controls
- Upcoming + Recent meeting lists
