# Suggested Supabase / Postgres Schema (MVP)

This document proposes a simple, dashboard-centric schema for the MVP entities:
`Employee`, `OnboardingTask`, `TrainingRecord`, `Trigger`, `GeneratedDocument`.

## Conventions

- Multi-tenant support via `organization_id` on every table.
- `id` columns use `uuid` with `gen_random_uuid()` (requires `pgcrypto`).
- `created_at` defaults to `now()`.
- `updated_at` is maintained by an application SQL trigger (see below).
- FK relationships use `ON DELETE CASCADE` so removing an employee cleans up related dashboard items.

## SQL (starter)

```sql
-- Enable UUID helper
create extension if not exists pgcrypto;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums
create type onboarding_task_status as enum ('todo', 'in_progress', 'done');
create type generated_document_status as enum ('queued', 'generated', 'failed');
create type trigger_type as enum (
  'onboarding_task_completed',
  'onboarding_task_due',
  'training_completed',
  'training_expired',
  'manual'
);

-- Employees
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  full_name varchar(200) not null,
  email varchar(320),
  role_title varchar(200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employees_organization_id_idx
  on public.employees (organization_id);

create trigger employees_set_updated_at
before update on public.employees
for each row execute function public.set_updated_at();

-- Onboarding tasks
create table if not exists public.onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  employee_id uuid not null references public.employees(id) on delete cascade,
  title varchar(250) not null,
  description text,
  due_date date,
  status onboarding_task_status not null default 'todo',
  assigned_to varchar(200),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_tasks_org_employee_idx
  on public.onboarding_tasks (organization_id, employee_id);

create trigger onboarding_tasks_set_updated_at
before update on public.onboarding_tasks
for each row execute function public.set_updated_at();

-- Training records
create table if not exists public.training_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  employee_id uuid not null references public.employees(id) on delete cascade,
  training_name varchar(250) not null,
  provider varchar(250),
  completed_at timestamptz,
  expires_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists training_records_org_employee_idx
  on public.training_records (organization_id, employee_id);

create trigger training_records_set_updated_at
before update on public.training_records
for each row execute function public.set_updated_at();

-- Triggers (rules / events)
create table if not exists public.triggers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  name varchar(200) not null,
  description text,
  trigger_type trigger_type not null default 'manual',
  payload jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists triggers_org_idx
  on public.triggers (organization_id);

create trigger triggers_set_updated_at
before update on public.triggers
for each row execute function public.set_updated_at();

-- Generated documents
create table if not exists public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  employee_id uuid not null references public.employees(id) on delete cascade,
  trigger_id uuid references public.triggers(id) on delete set null,
  document_type varchar(200) not null,
  status generated_document_status not null default 'queued',
  content text,
  metadata jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists generated_documents_org_employee_idx
  on public.generated_documents (organization_id, employee_id);

create index if not exists generated_documents_org_trigger_idx
  on public.generated_documents (organization_id, trigger_id);

create trigger generated_documents_set_updated_at
before update on public.generated_documents
for each row execute function public.set_updated_at();
```

## Next (later)

- Enable RLS and add policies based on `organization_id`.
- Add additional indexes for the dashboard views (e.g., “tasks due this week”).
- Add uniqueness constraints where appropriate (example: unique `email` per organization).

