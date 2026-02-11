-- Enable RLS on all tables
alter table public.events enable row level security;
alter table public.rsvp_fields enable row level security;
alter table public.guests enable row level security;
alter table public.guest_tags enable row level security;
alter table public.guest_tag_assignments enable row level security;
alter table public.rsvp_responses enable row level security;

-- EVENTS
create policy "Users can view own events"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Users can create events"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Users can delete own events"
  on public.events for delete
  using (auth.uid() = user_id);

create policy "Anyone can view published events"
  on public.events for select
  using (status = 'published');

-- RSVP FIELDS
create policy "Event owner can manage rsvp fields"
  on public.rsvp_fields for all
  using (
    exists (
      select 1 from public.events
      where events.id = rsvp_fields.event_id
      and events.user_id = auth.uid()
    )
  );

create policy "Anyone can read rsvp fields for published events"
  on public.rsvp_fields for select
  using (
    exists (
      select 1 from public.events
      where events.id = rsvp_fields.event_id
      and events.status = 'published'
    )
  );

-- GUESTS
create policy "Event owner can manage guests"
  on public.guests for all
  using (
    exists (
      select 1 from public.events
      where events.id = guests.event_id
      and events.user_id = auth.uid()
    )
  );

-- GUEST TAGS
create policy "Event owner can manage guest tags"
  on public.guest_tags for all
  using (
    exists (
      select 1 from public.events
      where events.id = guest_tags.event_id
      and events.user_id = auth.uid()
    )
  );

create policy "Event owner can manage tag assignments"
  on public.guest_tag_assignments for all
  using (
    exists (
      select 1 from public.guests g
      join public.events e on e.id = g.event_id
      where g.id = guest_tag_assignments.guest_id
      and e.user_id = auth.uid()
    )
  );

-- RSVP RESPONSES
create policy "Event owner can view responses"
  on public.rsvp_responses for select
  using (
    exists (
      select 1 from public.events
      where events.id = rsvp_responses.event_id
      and events.user_id = auth.uid()
    )
  );

create policy "Event owner can delete responses"
  on public.rsvp_responses for delete
  using (
    exists (
      select 1 from public.events
      where events.id = rsvp_responses.event_id
      and events.user_id = auth.uid()
    )
  );

create policy "Anyone can submit rsvp for published events"
  on public.rsvp_responses for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = rsvp_responses.event_id
      and events.status = 'published'
    )
  );
