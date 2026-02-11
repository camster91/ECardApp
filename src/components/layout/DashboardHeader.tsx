"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";

export function DashboardHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
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
