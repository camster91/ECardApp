create type rsvp_field_type as enum (
  'attendance',
  'text',
  'select',
  'multiselect',
  'number',
  'email',
  'phone'
);

create table public.rsvp_fields (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  field_name text not null,
  field_label text not null,
  field_type rsvp_field_type not null,
  options jsonb,
  placeholder text,
  is_required boolean default false,
  is_enabled boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now() not null
);

create index rsvp_fields_event_id_idx on public.rsvp_fields(event_id);
