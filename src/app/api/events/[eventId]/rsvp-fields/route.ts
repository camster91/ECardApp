import { NextRequest, NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getEventById, getRsvpFields, setRsvpFields } from "@/lib/mock-data";
import { nanoid } from "nanoid";
import type { RSVPField } from "@/types/database";

type RouteParams = { params: Promise<{ eventId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;
    const user = await getMockUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = getEventById(eventId, user.id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const fields = getRsvpFields(eventId);
    return NextResponse.json(fields);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;
    const user = await getMockUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = getEventById(eventId, user.id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be an array of RSVP field objects" },
        { status: 400 }
      );
    }

    const fields: RSVPField[] = body.map(
      (field: Record<string, unknown>, index: number) => ({
        id: `field-${nanoid(8)}`,
        event_id: eventId,
        field_name: field.field_name as string,
        field_type: field.field_type as RSVPField["field_type"],
        field_label: field.field_label as string,
        is_required: (field.is_required as boolean) ?? false,
        is_enabled: (field.is_enabled as boolean) ?? true,
        sort_order: index,
        options: (field.options as string[] | null) ?? null,
        placeholder: (field.placeholder as string | null) ?? null,
        created_at: new Date().toISOString(),
      })
    );

    const updated = setRsvpFields(eventId, fields);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
