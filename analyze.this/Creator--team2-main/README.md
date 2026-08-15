# CreatorIQ

## Overview

CreatorIQ is a content analytics platform that helps creators manage content and analyze engagement.

---

## Tech Stack

- FastAPI
- Python
- SQLAlchemy
- SQLite
- JWT Authentication
- Passlib (bcrypt)

---

## Features

### Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected APIs

### Content Management
- Add Content
- View Content
- Delete Content

### Dashboard
- Total Posts
- Total Views
- Total Likes
- Engagement Rate

---

## Project Structure

backend/
├── app/
│   ├── auth/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── database.py
│   └── main.py

---

## API Endpoints

| Method | Endpoint |
|---------|----------|
| POST | /register |
| POST | /login |
| POST | /token |
| GET | /profile |
| POST | /content |
| GET | /content |
| DELETE | /content/{id} |
| GET | /dashboard |

---

## Development

Recommended dev setup to avoid network/CORS errors:

- Start the backend bound to all interfaces so it can be reached from other devices:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- Start the frontend with host exposure and let Vite proxy API calls to the backend:
```bash
cd frontend
# Vite will run on 5173 by default; use --host to expose on the network
npm run dev -- --host
```

Notes:
- The frontend uses a development proxy for `/api` -> `http://localhost:8000` (see `frontend/vite.config.js`).
- In development `VITE_API_BASE_URL` is set to `/api` so calls are proxied and avoid CORS/port/host mismatches.
- If port 5173 is already in use, Vite may select the next available port (e.g. 5174). Start both servers as above and open the frontend URL shown by Vite.
- For production, set `VITE_API_BASE_URL` to your backend URL (e.g. `https://api.example.com`).

## Team

Backend Lead:
- Chandan

Frontend Lead:
- Pallavi

Database Lead:
- Sandeep

Dashboard and Analytics Lead:
- Sabarmathi


