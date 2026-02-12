import { NextRequest, NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getEvents, createEvent } from "@/lib/mock-data";
import { eventCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const user = await getMockUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = getEvents(user.id);
    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getMockUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = eventCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const event = createEvent(user.id, parsed.data);
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
