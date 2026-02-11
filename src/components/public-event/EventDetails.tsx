import { Calendar, MapPin, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { Event } from "@/types/database";

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{event.title}</h1>

      {event.description && (
        <p className="text-muted-foreground">{event.description}</p>
      )}

      <div className="space-y-3">
        {event.event_date && (
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-5 w-5 text-brand-600" />
            <div>
              <p className="font-medium">
                {formatDateTime(event.event_date)}
              </p>
              {event.event_end_date && (
                <p className="text-muted-foreground">
                  to {formatDateTime(event.event_end_date)}
                </p>
              )}
            </div>
          </div>
        )}

        {event.location_name && (
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-5 w-5 text-brand-600" />
            <div>
              <p className="font-medium">{event.location_name}</p>
              {event.location_address && (
                <p className="text-muted-foreground">
                  {event.location_address}
                </p>
              )}
            </div>
          </div>
        )}

        {event.customization.showCountdown && event.event_date && (
          <CountdownDisplay eventDate={event.event_date} />
        )}
      </div>
    </div>
  );
}

function CountdownDisplay({ eventDate }: { eventDate: string }) {
  const now = new Date();
  const target = new Date(eventDate);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Clock className="h-5 w-5 text-accent-green" />
        <p className="font-medium text-accent-green">Event is happening now!</p>
      </div>
    );
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="flex items-center gap-3 text-sm">
      <Clock className="h-5 w-5 text-brand-600" />
      <p className="font-medium">
        {days > 0 ? `${days} days and ` : ""}
        {hours} hours until event
      </p>
    </div>
  );
}
