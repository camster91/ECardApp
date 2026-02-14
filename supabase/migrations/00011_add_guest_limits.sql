-- Add guest limit and +1 settings to events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS max_attendees integer,
  ADD COLUMN IF NOT EXISTS allow_plus_ones boolean DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS max_guests_per_rsvp integer DEFAULT 10 NOT NULL;
