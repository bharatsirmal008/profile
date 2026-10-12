-- Run in the Supabase SQL Editor. No browser key can grant admin access.
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;

create or replace function public.is_portfolio_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.portfolio_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table if not exists public.portfolio_content (
  kind text not null check (kind in ('project', 'certificate', 'resume')),
  id text not null check (length(id) between 1 and 240),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  is_private boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (kind, id)
);
alter table public.portfolio_content enable row level security;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;
drop policy if exists "Portfolio public read" on public.portfolio_content;
create policy "Portfolio public read" on public.portfolio_content for select to anon, authenticated
  using (not is_private and not is_deleted);
drop policy if exists "Portfolio admin manage" on public.portfolio_content;
create policy "Portfolio admin manage" on public.portfolio_content for all to authenticated
  using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()));

-- Private bucket: access follows the associated entry's visibility.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-files', 'portfolio-files', false, 10485760,
  array['application/pdf','image/png','image/jpeg','image/webp','image/avif'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Portfolio file public read" on storage.objects;
create policy "Portfolio file public read" on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio-files' and exists (
  select 1 from public.portfolio_content c where not c.is_private and not c.is_deleted
  and (c.data->>'imagePath' = storage.objects.name or c.data->>'filePath' = storage.objects.name)
));
drop policy if exists "Portfolio file admin manage" on storage.objects;
create policy "Portfolio file admin manage" on storage.objects for all to authenticated
using (bucket_id = 'portfolio-files' and (select public.is_portfolio_admin()))
with check (bucket_id = 'portfolio-files' and (select public.is_portfolio_admin()));

-- AFTER creating your own user in Authentication > Users, run separately:
-- insert into public.portfolio_admins(user_id) values ('YOUR-USER-UUID') on conflict do nothing;
