# Document generation API (WorkbenchAI)

FastAPI service used by the main Workbench HR static site on **document-review**: it calls `GET /documents/config` and `POST /documents/generate` (mounted under the app root, i.e. `{base}/documents/...`).

## Setup

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`, and optionally `PINECONE_NAMESPACE`.
2. Install and run from `backend/`:

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **CORS:** Add every origin that serves the HTML app to `ALLOWED_ORIGINS` (comma-separated, no spaces required). Opening HTML via `file://` does not send a reliable Origin header for CORS—serve the site over `http://localhost` (or similar) instead.

## Frontend configuration

- Default API base: `http://localhost:8000` via `<meta name="wb-doc-gen-api" content="http://localhost:8000" />` on `document-review.html`.
- Override globally with `window.__WB_DOC_GEN_API__ = "https://your-api.example.com"` before `app.js` loads.

The React demo under `frontend/` proxies `/api` to this server; the static site talks to `/documents/*` directly on the configured base URL.
