import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { commentSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const adminSupabase = createAdminClient();

    // Find published event by slug
    const { data: event } = await adminSupabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { data: comments, error } = await adminSupabase
      .from("event_comments")
      .select("*")
      .eq("event_id", event.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const adminSupabase = createAdminClient();

    // Find published event by slug
    const { data: event } = await adminSupabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { data: comment, error } = await adminSupabase
      .from("event_comments")
      .insert({
        event_id: event.id,
        author_name: parsed.data.author_name,
        message: parsed.data.message,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
