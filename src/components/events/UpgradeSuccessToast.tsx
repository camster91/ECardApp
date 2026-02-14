"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function UpgradeSuccessToast() {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Remove ?upgraded=true from URL without reload
    const url = new URL(window.location.href);
    url.searchParams.delete("upgraded");
    window.history.replaceState({}, "", url.pathname);

    const timer = setTimeout(() => {
      setVisible(false);
      router.refresh();
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in rounded-xl border border-green-200 bg-green-50 px-5 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-semibold text-green-800">
          Event upgraded successfully!
        </p>
      </div>
    </div>
  );
}
