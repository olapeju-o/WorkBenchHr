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

3. **CORS:** Add every origin that serves the HTML app to `ALLOWED_ORIGINS` (comma-separated). For **GitHub Pages**, include the full site origin, e.g. `https://username.github.io` (user site) or `https://username.github.io/repo-name` (project site). `file://` does not send a reliable `Origin` for CORS.

## Frontend configuration

- In `document-review.html`, set `<meta name="wb-doc-gen-api" content="https://your-deployed-api.example.com" />` (no trailing slash). Empty `content` uses `http://localhost:8000` only when the page is served from `localhost` / `127.0.0.1`.
- Deployed static hosts (e.g. GitHub Pages) **cannot** call `localhost`; the API must be on a public `https://` host.
- Override with `window.__WB_DOC_GEN_API__ = "https://your-api.example.com"` before `app.js` loads.

The React demo under `frontend/` proxies `/api` to this server; the static site talks to `/documents/*` directly on the configured base URL.
