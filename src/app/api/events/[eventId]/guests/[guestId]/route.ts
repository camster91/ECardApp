import { NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getEventById, updateGuest, deleteGuest } from "@/lib/mock-data";
import { guestSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string; guestId: string }> }
) {
  try {
    const { eventId, guestId } = await params;
    const body = await request.json();
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = getEventById(eventId, user.id);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const parsed = guestSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const guest = updateGuest(eventId, guestId, parsed.data);
    if (!guest) return NextResponse.json({ error: "Guest not found" }, { status: 404 });

    return NextResponse.json(guest);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ eventId: string; guestId: string }> }
) {
  try {
    const { eventId, guestId } = await params;
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = getEventById(eventId, user.id);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    deleteGuest(eventId, guestId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
