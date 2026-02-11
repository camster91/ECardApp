import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { EventCard } from "@/components/dashboard/EventCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/Button";
import { CalendarPlus, Calendar, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get response counts for all events
  const eventIds = (events ?? []).map((e) => e.id);
  let responseCounts: Record<string, number> = {};

  if (eventIds.length > 0) {
    const { data: responses } = await supabase
      .from("rsvp_responses")
      .select("event_id")
      .in("event_id", eventIds);

    if (responses) {
      responseCounts = responses.reduce(
        (acc, r) => {
          acc[r.event_id] = (acc[r.event_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
    }
  }

  const totalEvents = events?.length ?? 0;
  const publishedEvents =
    events?.filter((e) => e.status === "published").length ?? 0;
  const totalResponses = Object.values(responseCounts).reduce(
    (sum, c) => sum + c,
    0
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your events and track RSVPs
          </p>
        </div>
        <Link href="/events/new">
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {totalEvents > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Events"
            value={totalEvents}
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatsCard
            title="Published"
            value={publishedEvents}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatsCard
            title="Total Responses"
            value={totalResponses}
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      )}

      {totalEvents === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {events?.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              responseCount={responseCounts[event.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
