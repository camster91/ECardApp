'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatRelative } from '@/lib/utils';
import type { EventComment } from '@/types/database';

interface CommentsSectionProps {
  eventSlug: string;
}

export function CommentsSection({ eventSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<EventComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments/${eventSlug}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
    setLoading(false);
  }, [eventSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments/${eventSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      setMessage('');
      fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      <p className="mt-1 text-sm text-muted-foreground">Leave a message for the host and other guests</p>

      {/* Post form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name"
          maxLength={100}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          maxLength={1000}
          required
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting || !authorName.trim() || !message.trim()}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Posting...' : 'Post Message'}
        </button>
      </form>

      {/* Comments list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No messages yet. Be the first to leave one!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{comment.author_name}</p>
                <p className="text-xs text-muted-foreground">{formatRelative(comment.created_at)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
