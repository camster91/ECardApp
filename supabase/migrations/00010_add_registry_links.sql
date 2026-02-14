-- Add registry_links column (JSONB array of {label, url} objects)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registry_links jsonb DEFAULT '[]'::jsonb;
