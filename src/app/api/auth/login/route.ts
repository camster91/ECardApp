import { NextResponse } from "next/server";
import { setMockUser } from "@/lib/mock-auth";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  await setMockUser(email);
  return NextResponse.json({ ok: true });
}
