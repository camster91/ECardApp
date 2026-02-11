create table public.guest_tags (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  tag_name text not null,
  color text default '#7c3aed',
  created_at timestamptz default now() not null
);

create index guest_tags_event_id_idx on public.guest_tags(event_id);

create table public.guest_tag_assignments (
  guest_id uuid references public.guests(id) on delete cascade not null,
  tag_id uuid references public.guest_tags(id) on delete cascade not null,
  primary key (guest_id, tag_id)
);
