create type rsvp_status as enum ('attending', 'not_attending', 'maybe', 'pending');

create table public.rsvp_responses (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  guest_id uuid references public.guests(id) on delete set null,
  respondent_name text not null,
  respondent_email text,
  status rsvp_status default 'pending' not null,
  response_data jsonb default '{}'::jsonb,
  headcount integer default 1,
  submitted_at timestamptz default now() not null
);

create index rsvp_responses_event_id_idx on public.rsvp_responses(event_id);
create index rsvp_responses_status_idx on public.rsvp_responses(event_id, status);
