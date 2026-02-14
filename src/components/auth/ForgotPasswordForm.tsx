"use client";

import Link from "next/link";

export function ForgotPasswordForm() {
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        We no longer use passwords. Sign in with just your email address
        and we&apos;ll send you a magic link.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        Go to Sign In
      </Link>
    </div>
  );
}
