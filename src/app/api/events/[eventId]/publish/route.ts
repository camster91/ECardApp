import { NextRequest, NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getEventById, updateEvent } from "@/lib/mock-data";

type RouteParams = { params: Promise<{ eventId: string }> };

export async function POST(_request: NextRequest, { params }: RouteParams) {
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

    const newStatus = event.status === "published" ? "draft" : "published";
    const updated = updateEvent(eventId, { status: newStatus });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
