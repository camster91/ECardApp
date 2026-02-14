-- Enable RLS on tables missing policies
ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_signup_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_signup_claims ENABLE ROW LEVEL SECURITY;

-- event_comments: owner can manage all, public can view/post non-private on published events
CREATE POLICY "Event owner can manage all comments"
  ON public.event_comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_comments.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public comments on published events"
  ON public.event_comments FOR SELECT
  USING (
    is_private = false AND
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_comments.event_id
      AND events.status = 'published'
    )
  );

CREATE POLICY "Anyone can post comments on published events"
  ON public.event_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_comments.event_id
      AND events.status = 'published'
    )
  );

-- event_announcements: owner only
CREATE POLICY "Event owner can manage announcements"
  ON public.event_announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_announcements.event_id
      AND events.user_id = auth.uid()
    )
  );

-- event_signup_items: owner can manage, public can view on published events
CREATE POLICY "Event owner can manage signup items"
  ON public.event_signup_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_signup_items.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view signup items for published events"
  ON public.event_signup_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_signup_items.event_id
      AND events.status = 'published'
    )
  );

-- event_signup_claims: owner can view/delete, public can create/view on published events
CREATE POLICY "Event owner can manage claims"
  ON public.event_signup_claims FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_signup_claims.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view claims for published events"
  ON public.event_signup_claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_signup_claims.event_id
      AND events.status = 'published'
    )
  );

CREATE POLICY "Anyone can create claims for published events"
  ON public.event_signup_claims FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_signup_claims.event_id
      AND events.status = 'published'
    )
  );
