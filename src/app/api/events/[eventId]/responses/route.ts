import { NextResponse } from "next/server";
import { getMockUser } from "@/lib/mock-auth";
import { getEventById, getResponses } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const user = await getMockUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = getEventById(eventId, user.id);
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const url = new URL(request.url);
    const format = url.searchParams.get("format");
    const responses = getResponses(eventId);

    if (format === "csv") {
      const headers = ["Name", "Email", "Status", "Headcount", "Submitted At"];

      const dataKeys = new Set<string>();
      responses.forEach((r) => {
        if (r.response_data && typeof r.response_data === "object") {
          Object.keys(r.response_data as Record<string, unknown>).forEach((k) =>
            dataKeys.add(k)
          );
        }
      });
      const dataKeysList = Array.from(dataKeys);
      headers.push(...dataKeysList);

      const rows = responses.map((r) => {
        const rd = (r.response_data || {}) as Record<string, unknown>;
        return [
          r.respondent_name,
          r.respondent_email || "",
          r.status,
          String(r.headcount),
          r.submitted_at,
          ...dataKeysList.map((k) => String(rd[k] || "")),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="responses-${eventId}.csv"`,
        },
      });
    }

    return NextResponse.json(responses);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
