import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getMockUser } from "@/lib/mock-auth";
import { getEventById, getResponseCount, updateEvent } from "@/lib/mock-data";

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const user = await getMockUser();

  if (!user) {
    redirect("/login");
  }

  const event = getEventById(eventId, user.id);
  if (!event) {
    notFound();
  }

  const responseCount = getResponseCount(eventId);
  const isPublished = event.status === "published";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-gray-500">{event.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/events/${eventId}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Edit
            </Link>
            <Link
              href={`/events/${eventId}/responses`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              View Responses
            </Link>
            <Link
              href={`/events/${eventId}/guests`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Manage Guests
            </Link>
            <PublishButton eventId={eventId} isPublished={isPublished} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Event Details
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500">Date</dt>
                <dd className="mt-0.5 text-sm text-gray-900">
                  {formatDate(event.event_date)}
                </dd>
              </div>
              {event.event_end_date && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">End Date</dt>
                  <dd className="mt-0.5 text-sm text-gray-900">
                    {formatDate(event.event_end_date)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-500">Location</dt>
                <dd className="mt-0.5 text-sm text-gray-900">
                  {event.location_name || "Not set"}
                  {event.location_address && (
                    <span className="block text-gray-500">{event.location_address}</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Slug</dt>
                <dd className="mt-0.5 text-sm font-mono text-gray-900">{event.slug}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Statistics
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500">Total Responses</dt>
                <dd className="mt-0.5 text-2xl font-bold text-gray-900">
                  {responseCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Status</dt>
                <dd className="mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </dd>
              </div>
              {isPublished && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Public Link</dt>
                  <dd className="mt-0.5">
                    <Link
                      href={`/e/${event.slug}`}
                      className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                      target="_blank"
                    >
                      /e/{event.slug}
                    </Link>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-500">Created</dt>
                <dd className="mt-0.5 text-sm text-gray-900">
                  {new Date(event.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {event.design_url && (
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Event Design
              </h2>
            </div>
            <div className="p-6">
              <img
                src={event.design_url}
                alt="Event design"
                className="h-auto max-h-[400px] w-full rounded-lg object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PublishButton({
  eventId,
  isPublished,
}: {
  eventId: string;
  isPublished: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        const user = await getMockUser();
        if (!user) return;

        const newStatus = isPublished ? "draft" : "published";
        updateEvent(eventId, { status: newStatus });

        const { revalidatePath } = await import("next/cache");
        revalidatePath(`/events/${eventId}`);
      }}
    >
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
          isPublished
            ? "border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>
    </form>
  );
}
