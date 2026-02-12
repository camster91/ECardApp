import { NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getEventById, getGuests, createGuest } from "@/lib/mock-data";
import { guestSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = getEventById(eventId, user.id);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const guests = getGuests(eventId);
    return NextResponse.json(guests);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = getEventById(eventId, user.id);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const parsed = guestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const guest = createGuest(eventId, {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      notes: parsed.data.notes || null,
    });

    return NextResponse.json(guest, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
