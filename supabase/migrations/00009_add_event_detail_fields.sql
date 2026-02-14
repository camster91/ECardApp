-- Add host name, dress code, and RSVP deadline to events
alter table public.events add column if not exists host_name text;
alter table public.events add column if not exists dress_code text;
alter table public.events add column if not exists rsvp_deadline timestamptz;
