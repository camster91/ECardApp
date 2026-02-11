"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: `${window.location.origin}/callback?next=/settings`,
      }
    );

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          If an account exists with that email, we sent password reset
          instructions.
        </p>
        <Link href="/login" className="text-sm text-brand-600 hover:text-brand-700">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-accent-red">
          {error}
        </div>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Send reset link
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-brand-600 hover:text-brand-700">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
