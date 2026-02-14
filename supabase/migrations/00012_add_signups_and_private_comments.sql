-- Add private flag to comments
ALTER TABLE public.event_comments
  ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false NOT NULL;

-- Sign-up / potluck items
CREATE TABLE IF NOT EXISTS public.event_signup_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  slots integer DEFAULT 1 NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS signup_items_event_id_idx ON public.event_signup_items(event_id);

-- Sign-up claims
CREATE TABLE IF NOT EXISTS public.event_signup_claims (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id uuid REFERENCES public.event_signup_items(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  claimant_name text NOT NULL,
  claimant_email text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS signup_claims_item_id_idx ON public.event_signup_claims(item_id);
CREATE INDEX IF NOT EXISTS signup_claims_event_id_idx ON public.event_signup_claims(event_id);
