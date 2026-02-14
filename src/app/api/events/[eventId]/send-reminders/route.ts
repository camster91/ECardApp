import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/resend";
import { buildReminderEmail } from "@/lib/email-templates";
import { buildReminderSms } from "@/lib/sms-templates";
import { isTwilioConfigured, getTwilioClient, getTwilioSendOptions } from "@/lib/twilio";

type RouteParams = { params: Promise<{ eventId: string }> };

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;
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
      .select("id, title, event_date, location_name, slug, status")
      .eq("id", eventId)
      .eq("user_id", user.id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "published") {
      return NextResponse.json(
        { error: "Event must be published before sending reminders" },
        { status: 400 }
      );
    }

    // Fetch guests that have been invited but not reminded
    const { data: guests, error: guestsError } = await adminSupabase
      .from("guests")
      .select("id, name, email, phone, invite_status, invite_token, reminder_sent_at")
      .eq("event_id", eventId)
      .eq("invite_status", "sent")
      .is("reminder_sent_at", null);

    if (guestsError) {
      return NextResponse.json({ error: guestsError.message }, { status: 500 });
    }

    // Filter to guests with email or phone
    const sendableGuests = (guests || []).filter((g) => g.email || g.phone);
    if (sendableGuests.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, sms_sent: 0, sms_failed: 0 });
    }

    const resend = getResendClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const smsEnabled = isTwilioConfigured();

    let sent = 0;
    let failed = 0;
    let smsSent = 0;
    let smsFailed = 0;

    for (const guest of sendableGuests) {
      const rsvpUrl = guest.invite_token
        ? `${siteUrl}/e/${event.slug}?t=${guest.invite_token}`
        : `${siteUrl}/e/${event.slug}`;

      let emailOk = false;
      let smsOk = false;

      // Send email reminder
      if (guest.email) {
        const { subject, html } = buildReminderEmail({
          guestName: guest.name,
          eventTitle: event.title,
          eventDate: event.event_date,
          locationName: event.location_name,
          rsvpUrl,
        });

        try {
          await resend.emails.send({
            from: "ECardApp <onboarding@resend.dev>",
            to: guest.email,
            subject,
            html,
          });
          emailOk = true;
          sent++;
        } catch {
          failed++;
        }
      }

      // Send SMS reminder
      if (guest.phone && smsEnabled) {
        const smsBody = buildReminderSms({
          guestName: guest.name,
          eventTitle: event.title,
          eventDate: event.event_date,
          rsvpUrl,
        });

        try {
          const twilioClient = getTwilioClient();
          await twilioClient.messages.create({
            body: smsBody,
            to: guest.phone,
            ...getTwilioSendOptions(),
          });
          smsOk = true;
          smsSent++;
        } catch {
          smsFailed++;
        }
      }

      if (emailOk || smsOk) {
        await adminSupabase
          .from("guests")
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq("id", guest.id);
      }
    }

    return NextResponse.json({ sent, failed, sms_sent: smsSent, sms_failed: smsFailed });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
