import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { EventHero } from "@/components/public-event/EventHero";
import { EventDetails } from "@/components/public-event/EventDetails";
import { RSVPForm } from "@/components/public-event/RSVPForm";
import { LocationMap } from "@/components/public-event/LocationMap";
import { CommentsSection } from "@/components/public-event/CommentsSection";
import { SignupBoard } from "@/components/public-event/SignupBoard";
import { ConfettiEffect } from "@/components/public-event/ConfettiEffect";
import { isValidHexColor } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description, design_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: event.description || `RSVP to ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description || `RSVP to ${event.title}`,
      images: event.design_url ? [event.design_url] : [],
    },
  };
}

export default async function PublicEventPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!event) notFound();

  const { data: rsvpFields } = await supabase
    .from("rsvp_fields")
    .select("*")
    .eq("event_id", event.id)
    .order("sort_order", { ascending: true });

  // Calculate spots remaining for guest limits
  let spotsRemaining: number | null = null;
  const maxAttendees = event.max_attendees || null;
  if (maxAttendees) {
    const { data: attendingResponses } = await supabase
      .from("rsvp_responses")
      .select("headcount")
      .eq("event_id", event.id)
      .eq("status", "attending");

    const currentTotal = (attendingResponses || []).reduce(
      (sum: number, r: { headcount: number }) => sum + (r.headcount || 1),
      0
    );
    spotsRemaining = Math.max(0, maxAttendees - currentTotal);
  }

  const safeBgColor = isValidHexColor(event.customization?.backgroundColor ?? "")
    ? event.customization.backgroundColor
    : "#ffffff";
  const safePrimaryColor = isValidHexColor(event.customization?.primaryColor ?? "")
    ? event.customization.primaryColor
    : "#7c3aed";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: safeBgColor }}
    >
      <ConfettiEffect />

      {/* Hero — full width */}
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <EventHero event={event} />
      </div>

      {/* Two-column layout on desktop */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left column: Details + Map */}
          <div className="space-y-8 lg:col-span-3">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <EventDetails event={event} />
            </div>

            {event.location_address && (
              <LocationMap
                address={event.location_address}
                name={event.location_name || undefined}
              />
            )}

            {/* Sign-up board */}
            <SignupBoard eventSlug={slug} />

            {/* Comments / Message Board */}
            <CommentsSection eventSlug={slug} />
          </div>

          {/* Right column: RSVP Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 rounded-xl border border-border bg-white p-6 shadow-sm">
              <RSVPForm
                eventSlug={slug}
                fields={rsvpFields || []}
                primaryColor={safePrimaryColor}
                allowPlusOnes={event.allow_plus_ones !== undefined ? event.allow_plus_ones : true}
                maxGuestsPerRsvp={event.max_guests_per_rsvp || 10}
                spotsRemaining={spotsRemaining}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer branding (free tier) */}
      {event.tier === "free" && (
        <div className="pb-8 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold">
              ECard<span className="text-brand-600">App</span>
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
