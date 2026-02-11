import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Users, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/types/database";

interface EventCardProps {
  event: Event;
  responseCount?: number;
}

export function EventCard({ event, responseCount = 0 }: EventCardProps) {
  const statusVariant =
    event.status === "published"
      ? "success"
      : event.status === "archived"
        ? "secondary"
        : "default";

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold">
                  {event.title}
                </h3>
                <Badge variant={statusVariant}>
                  {event.status}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                {event.event_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(event.event_date)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {responseCount} / {event.max_responses} replies
                </span>
              </div>
            </div>
            {event.status === "published" && (
              <span className="shrink-0 text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
