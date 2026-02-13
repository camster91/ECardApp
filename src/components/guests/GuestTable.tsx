"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Edit2 } from "lucide-react";
import type { Guest, InviteStatus } from "@/types/database";

const inviteBadge: Record<InviteStatus, { label: string; variant: "secondary" | "success" | "destructive" }> = {
  not_sent: { label: "Not Sent", variant: "secondary" },
  sent: { label: "Sent", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
};

interface GuestTableProps {
  guests: Guest[];
  eventId: string;
  onEdit: (guest: Guest) => void;
  onRefresh: () => void;
}

export function GuestTable({ guests, eventId, onEdit, onRefresh }: GuestTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(guestId: string) {
    if (!confirm("Are you sure you want to remove this guest?")) return;
    setDeleting(guestId);
    try {
      await fetch(`/api/events/${eventId}/guests/${guestId}`, {
        method: "DELETE",
      });
      onRefresh();
    } finally {
      setDeleting(null);
    }
  }

  const columns: Column<Guest & Record<string, unknown>>[] = [
    { key: "name", header: "Name", sortable: true },
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground">{item.email || "\u2014"}</span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (item) => (
        <span className="text-muted-foreground">{item.phone || "\u2014"}</span>
      ),
    },
    {
      key: "invite_status",
      header: "Invite",
      render: (item) => {
        const guest = item as Guest;
        if (!guest.email) return <span className="text-muted-foreground">\u2014</span>;
        const badge = inviteBadge[guest.invite_status] || inviteBadge.not_sent;
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item as Guest);
            }}
            className="rounded-lg p-1.5 hover:bg-neutral-100"
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
            disabled={deleting === item.id}
            className="rounded-lg p-1.5 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-accent-red" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={guests as (Guest & Record<string, unknown>)[]}
      keyExtractor={(item) => item.id}
      emptyMessage="No guests added yet"
    />
  );
}
