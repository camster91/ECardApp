import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AnnouncementSection } from '@/components/dashboard/AnnouncementSection';

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single();

  if (error || !event) {
    notFound();
  }

  // Fetch response count
  const { count: responseCount } = await supabase
    .from('rsvp_responses')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);

  const isPublished = event.status === 'published';

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isPublished
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-gray-500">{event.description}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/events/${eventId}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </Link>
            <Link
              href={`/events/${eventId}/responses`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
              View Responses
            </Link>
            <Link
              href={`/events/${eventId}/guests`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Manage Guests
            </Link>
            <Link
              href={`/events/${eventId}/comments`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              Comments
            </Link>
            <PublishButton eventId={eventId} isPublished={isPublished} />
          </div>
        </div>

        {/* Event details card */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Info card */}
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
                  {event.location_name || 'Not set'}
                  {event.location_address && (
                    <span className="block text-gray-500">{event.location_address}</span>
                  )}
                </dd>
              </div>
              {event.host_name && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Hosted By</dt>
                  <dd className="mt-0.5 text-sm text-gray-900">{event.host_name}</dd>
                </div>
              )}
              {event.dress_code && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Dress Code</dt>
                  <dd className="mt-0.5 text-sm text-gray-900">{event.dress_code}</dd>
                </div>
              )}
              {event.rsvp_deadline && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">RSVP Deadline</dt>
                  <dd className="mt-0.5 text-sm text-gray-900">{formatDate(event.rsvp_deadline)}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-500">Slug</dt>
                <dd className="mt-0.5 text-sm font-mono text-gray-900">{event.slug}</dd>
              </div>
            </dl>
          </div>

          {/* Stats card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Statistics
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs font-medium text-gray-500">Total Responses</dt>
                <dd className="mt-0.5 text-2xl font-bold text-gray-900">
                  {responseCount ?? 0}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Status</dt>
                <dd className="mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {isPublished ? 'Published' : 'Draft'}
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
                  {new Date(event.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Design preview */}
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

        {/* Announcements section */}
        {isPublished && (
          <AnnouncementSection eventId={eventId} />
        )}
      </div>
    </div>
  );
}

// ── Publish Button (client component) ────────────────────────────────

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
        'use server';
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const newStatus = isPublished ? 'draft' : 'published';
        await supabase
          .from('events')
          .update({ status: newStatus })
          .eq('id', eventId)
          .eq('user_id', user.id);

        const { revalidatePath } = await import('next/cache');
        revalidatePath(`/events/${eventId}`);
      }}
    >
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
          isPublished
            ? 'border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isPublished ? (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            Unpublish
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Publish
          </>
        )}
      </button>
    </form>
  );
}

