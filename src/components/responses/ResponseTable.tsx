"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { RSVPResponse } from "@/types/database";

interface ResponseTableProps {
  responses: RSVPResponse[];
  eventId: string;
  onRefresh: () => void;
  filter?: string;
}

const statusVariant: Record<string, "success" | "destructive" | "default" | "secondary"> = {
  attending: "success",
  not_attending: "destructive",
  maybe: "default",
  pending: "secondary",
};

const statusLabel: Record<string, string> = {
  attending: "Attending",
  not_attending: "Not Attending",
  maybe: "Maybe",
  pending: "Pending",
};

export function ResponseTable({ responses, eventId, onRefresh, filter }: ResponseTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = filter && filter !== "all"
    ? responses.filter((r) => r.status === filter)
    : responses;

  async function handleDelete(responseId: string) {
    if (!confirm("Delete this response?")) return;
    setDeleting(responseId);
    try {
      await fetch(`/api/events/${eventId}/responses/${responseId}`, {
        method: "DELETE",
      });
      onRefresh();
    } finally {
      setDeleting(null);
    }
  }

  const columns: Column<RSVPResponse & Record<string, unknown>>[] = [
    { key: "respondent_name", header: "Name", sortable: true },
    {
      key: "respondent_email",
      header: "Email",
      render: (item) => (
        <span className="text-muted-foreground">
          {(item as RSVPResponse).respondent_email || "\u2014"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => {
        const r = item as RSVPResponse;
        return (
          <Badge variant={statusVariant[r.status] || "secondary"}>
            {statusLabel[r.status] || r.status}
          </Badge>
        );
      },
    },
    {
      key: "headcount",
      header: "Guests",
      sortable: true,
      render: (item) => (item as RSVPResponse).headcount,
    },
    {
      key: "submitted_at",
      header: "Submitted",
      sortable: true,
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime((item as RSVPResponse).submitted_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id as string);
          }}
          disabled={deleting === item.id}
          className="rounded-lg p-1.5 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 text-accent-red" />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filtered as (RSVPResponse & Record<string, unknown>)[]}
      keyExtractor={(item) => item.id as string}
      emptyMessage="No responses yet"
    />
  );
}
