-- KHM Tutoring - Staff Resource Library
-- Safe to run multiple times.

create table if not exists public.resources (
  id         uuid        primary key default gen_random_uuid(),
  type       text        not null check (type in ('worksheet', 'test')),
  title      text        not null,
  subject    text        not null,
  grade      text        not null,
  topic      text        not null,
  pages      integer     not null default 1,
  difficulty text        not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  added      date        not null default current_date,
  author     text        not null,
  file_url   text,
  storage_provider text check (storage_provider in ('vercel_blob', 'supabase', 'external')),
  storage_key text,
  original_filename text,
  mime_type text,
  file_size bigint,
  classification_confidence text check (classification_confidence in ('high', 'medium', 'low')),
  source_provider text,
  source_project_ref text,
  source_table text,
  source_id text,
  source_bucket text,
  source_path text,
  source_checksum text,
  migrated_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.resources add column if not exists storage_provider text;
alter table public.resources add column if not exists storage_key text;
alter table public.resources add column if not exists original_filename text;
alter table public.resources add column if not exists mime_type text;
alter table public.resources add column if not exists file_size bigint;
alter table public.resources add column if not exists classification_confidence text;
alter table public.resources add column if not exists source_provider text;
alter table public.resources add column if not exists source_project_ref text;
alter table public.resources add column if not exists source_table text;
alter table public.resources add column if not exists source_id text;
alter table public.resources add column if not exists source_bucket text;
alter table public.resources add column if not exists source_path text;
alter table public.resources add column if not exists source_checksum text;
alter table public.resources add column if not exists migrated_at timestamptz;

alter table public.resources drop constraint if exists resources_storage_provider_check;
alter table public.resources add constraint resources_storage_provider_check
  check (storage_provider is null or storage_provider in ('vercel_blob', 'supabase', 'external'));

alter table public.resources drop constraint if exists resources_classification_confidence_check;
alter table public.resources add constraint resources_classification_confidence_check
  check (classification_confidence is null or classification_confidence in ('high', 'medium', 'low'));

create unique index if not exists resources_source_unique
  on public.resources (source_provider, source_project_ref, source_table, source_id)
  where source_id is not null;

create index if not exists resources_type_idx on public.resources (type);
create index if not exists resources_subject_idx on public.resources (subject);
create index if not exists resources_grade_idx on public.resources (grade);
create index if not exists resources_difficulty_idx on public.resources (difficulty);
create index if not exists resources_added_created_idx on public.resources (added desc, created_at desc);
create index if not exists resources_storage_key_idx on public.resources (storage_key) where storage_key is not null;
create index if not exists resources_source_path_idx on public.resources (source_provider, source_project_ref, source_path) where source_path is not null;
create index if not exists resources_source_checksum_idx on public.resources (source_checksum) where source_checksum is not null;

create table if not exists public.migration_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('dry_run', 'committing', 'completed', 'completed_with_errors', 'failed')),
  source_provider text not null default 'client_supabase',
  source_project_ref text,
  source_table text,
  source_bucket text,
  total_count integer not null default 0,
  ready_count integer not null default 0,
  skipped_count integer not null default 0,
  error_count integer not null default 0,
  committed_count integer not null default 0,
  created_by text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.migration_items (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.migration_runs(id) on delete cascade,
  source_id text not null,
  source_path text,
  source_bucket text,
  source_url text,
  status text not null check (status in ('ready', 'skipped', 'done', 'error')),
  error text,
  suggested_resource jsonb,
  blob_path text,
  resource_id uuid references public.resources(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(run_id, source_id)
);

create index if not exists migration_items_run_status_idx on public.migration_items (run_id, status);
create index if not exists migration_items_source_idx on public.migration_items (source_id);

alter table public.resources enable row level security;
alter table public.migration_runs enable row level security;
alter table public.migration_items enable row level security;

drop policy if exists "staff_read"    on public.resources;
drop policy if exists "admin_insert"  on public.resources;
drop policy if exists "admin_update"  on public.resources;
drop policy if exists "admin_delete"  on public.resources;

create policy "staff_read" on public.resources
  for select to authenticated using (true);

create policy "admin_insert" on public.resources
  for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin_update" on public.resources
  for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin_delete" on public.resources
  for delete to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Diagnostic Test leads
create table if not exists public.diagnostic_leads (
  id              uuid primary key default gen_random_uuid(),
  parent_name     text not null,
  student_name    text not null,
  student_grade   text,
  email           text not null,
  phone           text,
  age_group       text not null check (age_group in ('elementary','middle','high','satact')),
  subject         text not null check (subject in ('math','reading')),
  length          integer not null,
  score           integer not null,
  tier            text not null,
  topic_breakdown jsonb not null,
  answers         jsonb,
  emailed_at      timestamptz,
  booked_at       timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists diagnostic_leads_email_idx on public.diagnostic_leads (email);
create index if not exists diagnostic_leads_created_idx on public.diagnostic_leads (created_at desc);

alter table public.diagnostic_leads enable row level security;

drop policy if exists "staff_read_leads"     on public.diagnostic_leads;
drop policy if exists "service_insert_leads" on public.diagnostic_leads;
drop policy if exists "service_update_leads" on public.diagnostic_leads;

create policy "staff_read_leads" on public.diagnostic_leads
  for select to authenticated using (true);

create policy "service_insert_leads" on public.diagnostic_leads
  for insert to service_role with check (true);

create policy "service_update_leads" on public.diagnostic_leads
  for update to service_role using (true) with check (true);

alter table public.diagnostic_leads add column if not exists client_status text not null default 'new' check (client_status in ('new', 'contacted', 'client'));
alter table public.diagnostic_leads add column if not exists notes text;

create index if not exists diagnostic_leads_status_idx on public.diagnostic_leads (client_status);
