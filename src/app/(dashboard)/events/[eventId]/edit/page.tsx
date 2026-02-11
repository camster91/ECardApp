import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import WizardContainer from '@/components/events/wizard/WizardContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Event',
};

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { eventId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single();

  if (error || !event) {
    notFound();
  }

  // Fetch RSVP fields for this event
  const { data: rsvpFields } = await supabase
    .from('rsvp_fields')
    .select('*')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true });

  // Transform the event data into wizard form data shape
  const initialData = {
    title: event.title ?? '',
    description: event.description ?? '',
    event_date: event.event_date
      ? new Date(event.event_date).toISOString().slice(0, 16)
      : '',
    event_end_date: event.event_end_date
      ? new Date(event.event_end_date).toISOString().slice(0, 16)
      : '',
    location_name: event.location_name ?? '',
    location_address: event.location_address ?? '',
    design_url: event.design_url ?? '',
    design_type: event.design_type ?? 'upload',
    customization: event.customization ?? {
      primaryColor: '#6366f1',
      backgroundColor: '#ffffff',
      backgroundImage: '',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
      showCountdown: true,
    },
    rsvp_fields: (rsvpFields ?? []).map((f) => ({
      field_name: f.field_name,
      field_type: f.field_type,
      field_label: f.field_label,
      is_required: f.is_required,
      is_enabled: f.is_enabled,
      options: f.options ?? null,
      placeholder: f.placeholder ?? null,
    })),
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Edit Event</h1>
        <WizardContainer
          mode="edit"
          eventId={eventId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
