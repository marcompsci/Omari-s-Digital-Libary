-- Run once in Bookmark Buddy → Supabase SQL Editor.
-- Visitors can read recommendations and add one, but cannot update or delete rows.

create table if not exists public.book_recommendations (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 90),
  author text not null check (char_length(author) between 1 and 60),
  recommender_name text not null default '' check (char_length(recommender_name) <= 40),
  note text not null default '' check (char_length(note) <= 280),
  color smallint not null default 0 check (color between 0 and 7),
  created_at timestamptz not null default now()
);

alter table public.book_recommendations enable row level security;

drop policy if exists "Anyone can read book recommendations" on public.book_recommendations;
create policy "Anyone can read book recommendations"
  on public.book_recommendations for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can add book recommendations" on public.book_recommendations;
create policy "Anyone can add book recommendations"
  on public.book_recommendations for insert
  to anon, authenticated
  with check (
    char_length(title) between 1 and 90
    and char_length(author) between 1 and 60
    and char_length(recommender_name) <= 40
    and char_length(note) <= 280
    and color between 0 and 7
  );

create index if not exists book_recommendations_created_at_idx
  on public.book_recommendations (created_at asc);
