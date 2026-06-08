# Autonomous Learning Path — Run & Deploy

Quick instructions to run the app locally (development) and with Docker.

Local (backend):

- Create and activate a Python virtualenv inside `backend`:

   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r Requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

Local (frontend):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Docker (recommended for deployment/testing):

- Build and start services (Postgres + backend):

   ```bash
   docker-compose up --build
   ```

- The backend will be available at: http://localhost:8000

Notes:
- Set `GROQ_API_KEY` and other secrets via environment variables or your deployment platform.
- The backend will use `DATABASE_URL` env var; docker-compose sets a local Postgres URL.
