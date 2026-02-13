import Image from "next/image";
import type { Event } from "@/types/database";
import { isValidHexColor } from "@/lib/utils";

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  const primaryColor = isValidHexColor(event.customization?.primaryColor ?? "")
    ? event.customization.primaryColor
    : "#7c3aed";

  if (!event.design_url) {
    return (
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
    );
  }

  return (
    <div className="overflow-hidden rounded-xl">
      <Image
        src={event.design_url}
        alt={event.title}
        width={800}
        height={600}
        className="h-auto w-full object-cover"
        priority
      />
    </div>
  );
}
