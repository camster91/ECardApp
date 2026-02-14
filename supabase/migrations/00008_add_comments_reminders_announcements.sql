-- Event Comments (message board on public event page)
CREATE TABLE public.event_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX event_comments_event_id_idx ON public.event_comments(event_id);

-- Reminder tracking on guests
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Event Announcements (broadcast emails to guests)
CREATE TABLE public.event_announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_to_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX event_announcements_event_id_idx ON public.event_announcements(event_id);
