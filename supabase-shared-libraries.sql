-- Run once in the Bookmark Buddyy Supabase SQL Editor.
-- Public library links can be read by anyone. Visitors can create libraries,
-- but cannot modify or delete a library after it has been shared.

create table if not exists public.shared_libraries (
  id uuid primary key default gen_random_uuid(),
  library_name text not null check (char_length(library_name) between 1 and 70),
  books jsonb not null default '[]'::jsonb check (
    jsonb_typeof(books) = 'array'
    and jsonb_array_length(books) between 1 and 50
  ),
  created_at timestamptz not null default now()
);

alter table public.shared_libraries enable row level security;

drop policy if exists "Anyone can read shared libraries" on public.shared_libraries;
create policy "Anyone can read shared libraries"
  on public.shared_libraries for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can create shared libraries" on public.shared_libraries;
create policy "Anyone can create shared libraries"
  on public.shared_libraries for insert
  to anon, authenticated
  with check (
    char_length(library_name) between 1 and 70
    and jsonb_typeof(books) = 'array'
    and jsonb_array_length(books) between 1 and 50
  );

create index if not exists shared_libraries_created_at_idx
  on public.shared_libraries (created_at desc);
