import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { eventCreateSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { DEFAULT_RSVP_FIELDS } from '@/lib/constants';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = eventCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, event_date, event_end_date, location_name, location_address, design_url, design_type, customization } = parsed.data;
    const slug = generateSlug(title);

    const { data: event, error: insertError } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        title,
        slug,
        description: description ?? null,
        event_date: event_date ?? null,
        event_end_date: event_end_date ?? null,
        location_name: location_name ?? null,
        location_address: location_address ?? null,
        design_url: design_url ?? null,
        design_type: design_type ?? 'upload',
        customization: customization ?? {},
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // Insert default RSVP fields for the new event
    const rsvpFields = DEFAULT_RSVP_FIELDS.map((field, index) => ({
      event_id: event.id,
      field_name: field.field_name,
      field_type: field.field_type,
      field_label: field.field_label,
      is_required: field.is_required,
      is_enabled: field.is_enabled,
      sort_order: index,
      options: field.options ?? null,
      placeholder: field.placeholder ?? null,
    }));

    const { error: rsvpError } = await supabase
      .from('rsvp_fields')
      .insert(rsvpFields);

    if (rsvpError) {
      // Event created but RSVP fields failed - log but don't fail the request
      console.error('Failed to insert default RSVP fields:', rsvpError.message);
    }

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
