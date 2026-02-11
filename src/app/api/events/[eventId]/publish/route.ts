import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ eventId: string }> };

export async function POST(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { eventId } = await params;
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

    // Fetch the current event to get its status
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('id, status')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Toggle status between draft and published
    const newStatus = event.status === 'published' ? 'draft' : 'published';

    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({ status: newStatus })
      .eq('id', eventId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedEvent);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
