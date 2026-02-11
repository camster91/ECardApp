create table public.guests (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index guests_event_id_idx on public.guests(event_id);

create trigger guests_updated_at
  before update on public.guests
  for each row execute function update_updated_at_column();
