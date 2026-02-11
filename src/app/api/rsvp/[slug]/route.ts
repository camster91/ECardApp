import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rsvpSubmissionSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    // Find the published event by slug
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, status, tier, max_responses")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found or not published" },
        { status: 404 }
      );
    }

    // Check response limit
    const { count } = await supabase
      .from("rsvp_responses")
      .select("*", { count: "exact", head: true })
      .eq("event_id", event.id);

    if (count !== null && count >= event.max_responses) {
      return NextResponse.json(
        {
          error: "This event has reached its maximum number of responses. The host may need to upgrade their plan.",
        },
        { status: 403 }
      );
    }

    // Validate submission
    const parsed = rsvpSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { respondent_name, respondent_email, status, headcount, response_data } =
      parsed.data;

    // Insert RSVP response
    const { data: response, error: insertError } = await supabase
      .from("rsvp_responses")
      .insert({
        event_id: event.id,
        respondent_name,
        respondent_email: respondent_email || null,
        status,
        headcount,
        response_data,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to submit RSVP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, response });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
