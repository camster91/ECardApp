"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface ExportCSVButtonProps {
  eventId: string;
}

export function ExportCSVButton({ eventId }: ExportCSVButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/responses?format=csv`);
      if (!res.ok) return;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `responses-${eventId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} loading={loading}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
