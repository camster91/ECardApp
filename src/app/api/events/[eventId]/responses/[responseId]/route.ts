import { NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getEventById, deleteResponse } from "@/lib/mock-data";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ eventId: string; responseId: string }> }
) {
  try {
    const { eventId, responseId } = await params;
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = getEventById(eventId, user.id);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    deleteResponse(eventId, responseId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
