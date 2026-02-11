import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function SignupPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start creating beautiful digital invitations
        </p>
      </div>
      <SignupForm />
    </>
  );
}
