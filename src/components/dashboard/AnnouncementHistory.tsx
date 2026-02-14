'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatRelative } from '@/lib/utils';
import type { EventAnnouncement } from '@/types/database';

interface AnnouncementHistoryProps {
  eventId: string;
  refreshKey: number;
}

export function AnnouncementHistory({ eventId, refreshKey }: AnnouncementHistoryProps) {
  const [announcements, setAnnouncements] = useState<EventAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/events/${eventId}/announcements`);
    if (res.ok) {
      const data = await res.json();
      setAnnouncements(data);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements, refreshKey]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (announcements.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Announcement History
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {announcements.map((ann) => (
          <div key={ann.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">{ann.subject}</p>
              <span className="text-xs text-muted-foreground">{formatRelative(ann.created_at)}</span>
            </div>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{ann.message}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sent to {ann.sent_to_count} guest{ann.sent_to_count !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
