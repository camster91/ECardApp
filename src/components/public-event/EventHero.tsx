import type { Event } from "@/types/database";
import { isValidHexColor } from "@/lib/utils";

interface EventHeroProps {
  event: Event;
}

function isVideo(event: Event): boolean {
  return (
    event.design_type === "video" ||
    /\.(mp4|webm)$/i.test(event.design_url || "")
  );
}

export function EventHero({ event }: EventHeroProps) {
  const primaryColor = isValidHexColor(event.customization?.primaryColor ?? "")
    ? event.customization.primaryColor
    : "#7c3aed";
  const logoUrl = event.customization?.logoUrl;

  return (
    <div className="space-y-4">
      {/* Logo */}
      {logoUrl && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={`${event.title} logo`}
            className="h-16 w-auto object-contain sm:h-20"
          />
        </div>
      )}

      {/* Design */}
      {!event.design_url ? (
        <div
          className="flex h-64 items-center justify-center rounded-xl"
          style={{ backgroundColor: primaryColor + "20" }}
        >
          <h1
            className="text-3xl font-bold"
            style={{ color: primaryColor }}
          >
            {event.title}
          </h1>
        </div>
      ) : isVideo(event) ? (
        <div className="overflow-hidden rounded-xl">
          <video
            src={event.design_url}
            autoPlay
            muted
            loop
            playsInline
            className="h-auto w-full object-cover"
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.design_url}
            alt={event.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
