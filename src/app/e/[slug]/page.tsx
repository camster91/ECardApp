import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { EventHero } from "@/components/public-event/EventHero";
import { EventDetails } from "@/components/public-event/EventDetails";
import { RSVPForm } from "@/components/public-event/RSVPForm";
import { LocationMap } from "@/components/public-event/LocationMap";
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: event.customization?.backgroundColor || "#ffffff" }}
    >
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Event Design */}
        <EventHero event={event} />

        {/* Event Details */}
        <div className="mt-8">
          <EventDetails event={event} />
        </div>

        {/* Location Map */}
        {event.location_address && (
          <div className="mt-8">
            <LocationMap
              address={event.location_address}
              name={event.location_name || undefined}
            />
          </div>
        )}

        {/* RSVP Form */}
        <div className="mt-8 rounded-xl border border-border bg-white p-6">
          <RSVPForm
            eventSlug={slug}
            fields={rsvpFields || []}
            primaryColor={event.customization?.primaryColor || "#7c3aed"}
          />
        </div>

        {/* Footer branding (free tier) */}
        {event.tier === "free" && (
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by{" "}
              <span className="font-semibold">
                ECard<span className="text-brand-600">App</span>
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
