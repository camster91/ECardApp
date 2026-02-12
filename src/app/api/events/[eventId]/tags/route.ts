import { NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getGuestTags, createGuestTag, deleteGuestTag } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tags = getGuestTags(eventId);
    return NextResponse.json(tags);
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

    const tag = createGuestTag(eventId, body.tag_name, body.color || "#7c3aed");
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    deleteGuestTag(eventId, body.tagId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
