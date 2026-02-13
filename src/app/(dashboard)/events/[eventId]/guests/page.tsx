"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { GuestTable } from "@/components/guests/GuestTable";
import { AddGuestModal } from "@/components/guests/AddGuestModal";
import { Button } from "@/components/ui/Button";
import { UserPlus, ArrowLeft, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Guest } from "@/types/database";

export default function GuestsPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [sending, setSending] = useState(false);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/events/${eventId}/guests`);
    if (res.ok) {
      const data = await res.json();
      setGuests(data);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  function handleEdit(guest: Guest) {
    setEditingGuest(guest);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditingGuest(null);
  }

  async function handleSendInvites() {
    const pendingCount = guests.filter(
      (g) => g.email && (g.invite_status === "not_sent" || g.invite_status === "failed")
    ).length;

    if (pendingCount === 0) {
      alert("No guests with unsent invitations.");
      return;
    }

    if (!confirm(`Send invitations to ${pendingCount} guest${pendingCount !== 1 ? "s" : ""}?`)) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/events/${eventId}/send-invites`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send invitations.");
      } else {
        alert(`Sent: ${data.sent}, Failed: ${data.failed}`);
        fetchGuests();
      }
    } catch {
      alert("Failed to send invitations.");
    } finally {
      setSending(false);
    }
  }

  const hasUnsent = guests.some(
    (g) => g.email && (g.invite_status === "not_sent" || g.invite_status === "failed")
  );

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/events/${eventId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to event
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Guest List</h1>
            <p className="text-sm text-muted-foreground">
              {guests.length} guest{guests.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsent && (
              <Button variant="outline" onClick={handleSendInvites} disabled={sending}>
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Invites
              </Button>
            )}
            <Button onClick={() => setModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      ) : (
        <GuestTable
          guests={guests}
          eventId={eventId}
          onEdit={handleEdit}
          onRefresh={fetchGuests}
        />
      )}

      <AddGuestModal
        open={modalOpen}
        onClose={handleClose}
        eventId={eventId}
        guest={editingGuest}
        onSuccess={fetchGuests}
      />
    </div>
  );
}
