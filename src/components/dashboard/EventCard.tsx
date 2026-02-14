import Link from "next/link";
import { Calendar, Users, MapPin, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/types/database";

interface EventCardProps {
  event: Event;
  responseCount?: number;
}

export function EventCard({ event, responseCount = 0 }: EventCardProps) {
  const isPublished = event.status === "published";
  const progress = event.max_responses > 0
    ? Math.min((responseCount / event.max_responses) * 100, 100)
    : 0;

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-brand-200 hover:shadow-md">
        <div className="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div className="relative h-36 w-full shrink-0 sm:h-auto sm:w-40">
            {event.design_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.design_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50">
                <span className="text-3xl font-bold text-brand-300">
                  {event.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Status badge overlay */}
            <div className="absolute left-2 top-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
                  isPublished
                    ? "bg-green-500/90 text-white"
                    : "bg-amber-500/90 text-white"
                }`}
              >
                {isPublished ? "Live" : "Draft"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400" />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                {event.event_date && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(event.event_date)}
                  </span>
                )}
                {event.location_name && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{event.location_name}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Response progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-medium text-gray-600">
                  <Users className="h-3.5 w-3.5" />
                  {responseCount} response{responseCount !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-400">
                  / {event.max_responses} max
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
