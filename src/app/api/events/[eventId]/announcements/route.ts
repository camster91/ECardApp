import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/resend";
import { buildAnnouncementEmail } from "@/lib/email-templates";
import { announcementSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ eventId: string }> };

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { eventId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminSupabase = createAdminClient();

    // Verify ownership
    const { data: event } = await adminSupabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .eq("user_id", user.id)
      .single();

    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: announcements, error } = await adminSupabase
      .from("event_announcements")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    // Ownership + status check
    const { data: event, error: eventError } = await adminSupabase
      .from("events")
      .select("id, title, slug, status")
      .eq("id", eventId)
      .eq("user_id", user.id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "published") {
      return NextResponse.json(
        { error: "Event must be published before sending announcements" },
        { status: 400 }
      );
    }

    const parsed = announcementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Fetch all guests with email
    const { data: guests, error: guestsError } = await adminSupabase
      .from("guests")
      .select("id, name, email")
      .eq("event_id", eventId)
      .not("email", "is", null);

    if (guestsError) {
      return NextResponse.json({ error: guestsError.message }, { status: 500 });
    }

    const resend = getResendClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const rsvpUrl = `${siteUrl}/e/${event.slug}`;

    let sentCount = 0;

    for (const guest of guests || []) {
      if (!guest.email) continue;

      const { subject, html } = buildAnnouncementEmail({
        guestName: guest.name,
        eventTitle: event.title,
        announcementSubject: parsed.data.subject,
        announcementMessage: parsed.data.message,
        rsvpUrl,
      });

      try {
        await resend.emails.send({
          from: "ECardApp <onboarding@resend.dev>",
          to: guest.email,
          subject,
          html,
        });
        sentCount++;
      } catch {
        // Continue sending to other guests
      }
    }

    // Save the announcement record
    const { data: announcement, error: insertError } = await adminSupabase
      .from("event_announcements")
      .insert({
        event_id: eventId,
        subject: parsed.data.subject,
        message: parsed.data.message,
        sent_to_count: sentCount,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(announcement, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
