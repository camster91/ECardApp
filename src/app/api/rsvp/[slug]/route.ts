import { NextResponse } from "next/server";
import { getEventBySlug, getResponseCount, createResponse } from "@/lib/mock-data";
import { rsvpSubmissionSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const event = getEventBySlug(slug);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found or not published" },
        { status: 404 }
      );
    }

    const count = getResponseCount(event.id);
    if (count >= event.max_responses) {
      return NextResponse.json(
        {
          error:
            "This event has reached its maximum number of responses. The host may need to upgrade their plan.",
        },
        { status: 403 }
      );
    }

    const parsed = rsvpSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { respondent_name, respondent_email, status, headcount, response_data } =
      parsed.data;

    const response = createResponse(event.id, {
      respondent_name,
      respondent_email: respondent_email || null,
      status,
      headcount,
      response_data,
    });

    return NextResponse.json({ success: true, response });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
