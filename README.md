# Autonomous Learning Path — Overview & Concepts  [🔗](https://skillgraph-os.vercel.app/)

This repository implements an adaptive learning path engine (Skillgraph) with a FastAPI backend and a lightweight frontend. It demonstrates core techniques used in modern AI-enabled learning systems: multi-agent orchestration, retrieval-augmented generation (RAG), and directed acyclic graph (DAG) path planning.

Quick start

- Local backend (development):

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Local frontend (development):

```bash
cd frontend
npm install
npm run dev
```

- Docker (recommended for testing/deploy):

```bash
docker-compose up --build
```

The backend API will be available at: http://localhost:8000

Environment & secrets

- `DATABASE_URL`: DB connection string used by the backend.
- `GROQ_API_KEY` (or other search/index API keys) for external retrieval services.
- Any other secrets can be set via your deployment platform or local env files.

Architecture (high level)

- Backend: FastAPI app under `backend/app` exposing REST endpoints for paths, quizzes, users, and recommendations.
- Services: modular services in `backend/app/services` encapsulate graph logic, adaptive algorithms, and recommendation heuristics.
- Data: CSVs in `data/` are used for initial seeding and examples.
- Frontend: simple Vite + React UI in `frontend/src` that queries the backend APIs.

Key concepts explained

**Multi-agent orchestration**:
- What: coordinating multiple specialized agents (components) to solve a complex task. In the learning-path context agents might include a content retriever, a sequencer/planner, an assessment agent, and a personalization agent.
- Why: splitting responsibilities lets you use different models, tools, or heuristics for each subtask and orchestrate them to produce coherent outputs (e.g., a tailored learning path).
- How this repo uses it: the backend separates concerns into services (retrieval, graph planner, quiz generator). An orchestration layer composes results from these services to form the final path or recommendation.

**Retrieval-Augmented Generation (RAG)**:
- What: combine a retrieval system (search/vector DB) with a generative model so the model can ground answers in retrieved documents, improving factuality and traceability.
- Why: for educational content you want model responses to be backed by curated source material (lecture notes, course descriptions, or topic definitions).
- How to apply: store content as documents + vectors, retrieve a small set of relevant passages for a query, then pass those passages as context to the LLM when generating an explanation, question, or recommendation. Maintain provenance metadata so you can show sources to the user.

**Directed Acyclic Graphs (DAGs) for learning paths**:
- What: a DAG models prerequisite relationships between topics or skills. Nodes are topics; edges represent "prerequisite" or "helps-with" relations.
- Why: learning should respect dependencies; a DAG captures ordering constraints and enables algorithms to compute valid sequences and alternative routes.
- How this repo uses it: the `graph_service` and `path_service` implement graph traversal and path-building logic that take prerequisites into account when recommending the next topics.

Design notes & trade-offs

- Modularity: services are independent so you can swap the retrieval backend (local embeddings, external vector DB) or the LLM provider without rewriting orchestration logic.
- Determinism vs personalization: DAG-based planners guarantee prerequisite order; personalization layers adapt difficulty or skip nodes when a user demonstrates mastery.
- Explainability: keep retrieval provenance and scoring details surfaced in responses so recommendations can be audited.

Extending the project

- Add a vector database: plug a vector store (FAISS, Milvus, Pinecone) and update the retrieval service.
- Replace or augment LLMs: encapsulate calls to different models behind a single interface so orchestration can route tasks to the best agent.
- Add user telemetry: log completions, assessment results, and time-on-task to refine personalization heuristics.

Developer pointers

- Seed sample data: `backend/seed.py` reads `data/*.csv` to populate the database for local testing.
- Backend code entry: see `backend/app/main.py` to inspect routes and dependency wiring.
- Services: `backend/app/services` contains `graph_service.py`, `path_service.py`, and `recommendation_service.py` — good starting points for extending logic.

Troubleshooting

- If the backend fails to start, ensure your virtualenv is activated and `requirements.txt` packages are installed.
- Database errors: confirm `DATABASE_URL` points to a running Postgres instance; docker-compose sets up Postgres for you when running the provided compose file.

License & credits

This project is provided as a learning/demo artifact. Check individual files for any copyright notices.

Feedback and contributions

Please open issues or PRs to propose improvements, bug fixes, or new features.

**Vercel link 🔗**
Take a look to the project👇:

[Skillgraph-OS](https://skillgraph-os.vercel.app/)

