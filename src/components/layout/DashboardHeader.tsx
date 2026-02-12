"use client";

import { useEffect, useState } from "react";
import { getInitials } from "@/lib/utils";

function getMockEmail(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )mock-user-email=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function DashboardHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getMockEmail());
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        {email && (
          <>
            <span className="text-sm text-muted-foreground">{email}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
              {getInitials(email.split("@")[0])}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
