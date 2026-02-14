import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/resend";
import { buildInvitationEmail } from "@/lib/email-templates";
import { generateInviteToken } from "@/lib/utils";

type RouteParams = { params: Promise<{ eventId: string }> };

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;
    const supabase = await createClient();

    // Auth check
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
      .select("id, title, event_date, location_name, slug, status, design_url, host_name, dress_code, rsvp_deadline")
      .eq("id", eventId)
      .eq("user_id", user.id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "published") {
      return NextResponse.json(
        { error: "Event must be published before sending invites" },
        { status: 400 }
      );
    }

    // Fetch guests that need invitations
    const { data: guests, error: guestsError } = await adminSupabase
      .from("guests")
      .select("id, name, email, invite_status, invite_token")
      .eq("event_id", eventId)
      .not("email", "is", null)
      .in("invite_status", ["not_sent", "failed"]);

    if (guestsError) {
      return NextResponse.json(
        { error: guestsError.message },
        { status: 500 }
      );
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0 });
    }

    const resend = getResendClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let sent = 0;
    let failed = 0;

    for (const guest of guests) {
      if (!guest.email) continue;

      // Generate invite token if guest doesn't have one
      let token = guest.invite_token;
      if (!token) {
        token = generateInviteToken();
        await adminSupabase
          .from("guests")
          .update({ invite_token: token })
          .eq("id", guest.id);
      }

      const rsvpUrl = `${siteUrl}/e/${event.slug}?t=${token}`;

      const { subject, html } = buildInvitationEmail({
        guestName: guest.name,
        eventTitle: event.title,
        eventDate: event.event_date,
        locationName: event.location_name,
        designUrl: event.design_url,
        hostName: event.host_name || undefined,
        dressCode: event.dress_code,
        rsvpDeadline: event.rsvp_deadline,
        rsvpUrl,
      });

      try {
        await resend.emails.send({
          from: "ECardApp <onboarding@resend.dev>",
          to: guest.email,
          subject,
          html,
        });

        await adminSupabase
          .from("guests")
          .update({
            invite_status: "sent",
            invite_sent_at: new Date().toISOString(),
          })
          .eq("id", guest.id);

        sent++;
      } catch {
        await adminSupabase
          .from("guests")
          .update({ invite_status: "failed" })
          .eq("id", guest.id);

        failed++;
      }
    }

    return NextResponse.json({ sent, failed });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
