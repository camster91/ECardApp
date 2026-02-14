import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { EventCard } from "@/components/dashboard/EventCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CalendarPlus, Calendar, Users, BarChart3, Sparkles } from "lucide-react";
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

  const greeting = getGreeting();
  const userName = user.email?.split("@")[0] || "there";

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {greeting}, {userName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalEvents === 0
              ? "Ready to create your first event?"
              : `You have ${totalEvents} event${totalEvents !== 1 ? "s" : ""} and ${totalResponses} response${totalResponses !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/events/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition-all hover:shadow-lg hover:shadow-brand-500/30 active:scale-[0.98] sm:py-2.5"
        >
          <Sparkles className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      {totalEvents > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Events"
            value={totalEvents}
            icon={<Calendar className="h-5 w-5" />}
            color="purple"
          />
          <StatsCard
            title="Published"
            value={publishedEvents}
            icon={<BarChart3 className="h-5 w-5" />}
            color="green"
          />
          <StatsCard
            title="Total Responses"
            value={totalResponses}
            icon={<Users className="h-5 w-5" />}
            color="blue"
          />
        </div>
      )}

      {totalEvents === 0 ? (
        <EmptyState />
      ) : (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Your Events</h2>
          <div className="space-y-4">
            {events?.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                responseCount={responseCounts[event.id] ?? 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
