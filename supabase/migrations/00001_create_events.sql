create extension if not exists "uuid-ossp";

create type event_status as enum ('draft', 'published', 'archived');
create type event_tier as enum ('free', 'pro30', 'pass');

create table public.events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  event_date timestamptz,
  event_end_date timestamptz,
  location_name text,
  location_address text,
  location_lat double precision,
  location_lng double precision,
  design_url text,
  design_type text default 'image',
  customization jsonb default '{
    "primaryColor": "#7c3aed",
    "backgroundColor": "#ffffff",
    "backgroundImage": null,
    "fontFamily": "Inter",
    "buttonStyle": "rounded",
    "showCountdown": true
  }'::jsonb,
  slug text unique not null,
  status event_status default 'draft' not null,
  tier event_tier default 'free' not null,
  max_responses integer default 15,
  payment_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create unique index events_slug_idx on public.events(slug);
create index events_user_id_idx on public.events(user_id);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at
  before update on public.events
  for each row execute function update_updated_at_column();
