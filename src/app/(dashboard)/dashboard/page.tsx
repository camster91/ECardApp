import { getMockUser } from "@/lib/mock-auth";
import { getEvents, getResponseCount } from "@/lib/mock-data";
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
  const user = await getMockUser();
  if (!user) redirect("/login");

  const events = getEvents(user.id);

  const responseCounts: Record<string, number> = {};
  for (const e of events) {
    responseCounts[e.id] = getResponseCount(e.id);
  }

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "published").length;
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
          {events.map((event) => (
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
