# WorkBenchHR

Building an AI-powered platform for HR specialists at small businesses

## Repository layout

| Path | Purpose |
|------|---------|
| **`web/`** | React + Vite frontend (`npm install` and `npm run dev` here, or use root `npm run dev`) |
| **`web/design/`** | Design reference images imported by the UI |
| **`app/`** | Python package (models, Supabase helpers, SQL migrations) |
| **`scripts/`** | Shell and Python utilities (schema, connectivity checks) |

## Run the website locally

```bash
cd web && npm install && npm run dev
```

Or from the repository root:

```bash
npm install --prefix web
npm run dev
```

Open the URL Vite prints (by default `http://localhost:5173`).

## Publish to GitHub Pages

1. On GitHub: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. Push to `main`; the workflow **Deploy to GitHub Pages** builds `web/` and uploads `web/dist`.
3. For a normal project site (`https://<user>.github.io/<repo>/`), the workflow sets `VITE_BASE_PATH` to `/<repo>/` automatically.
4. For a **user or organization** site where the repo is named `<user>.github.io` and the site lives at `https://<user>.github.io/`, add a repository variable **`VITE_BASE_PATH`** with value **`/`** (Settings → Secrets and variables → Actions → Variables).

## Database foundation (Supabase)

The executable MVP schema lives in:

- `app/db/migrations/001_initial_schema.sql`

This schema is aligned with the existing Pydantic entities:

- `Employee` -> `employees`
- `OnboardingTask` -> `onboarding_tasks`
- `TrainingRecord` -> `training_records`
- `Trigger` -> `triggers`
- `GeneratedDocument` -> `generated_documents`

### Option A: Apply in Supabase SQL Editor

1. Open Supabase project -> **SQL Editor**.
2. Open `app/db/migrations/001_initial_schema.sql`.
3. Copy-paste the full file and run it.

### Option B: Apply via psql script

```bash
export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres'
bash scripts/apply_schema.sh
```

### Verify connectivity

Set `.env` with:

- `SUPABASE_URL`
- `SUPABASE_KEY`

Then run:

```bash
python scripts/check_supabase_connection.py
```

Expected output:

```json
{"ok": true, "employees_count": 0}
```
