"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="gradient-top-bar h-1" />
      <nav className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-foreground">ECard</span>
              <span className="text-brand-600">App</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              My Dashboard
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-neutral-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            mobileOpen ? "max-h-64" : "max-h-0"
          )}
        >
          <div className="space-y-2 px-4 pb-4">
            <Link
              href="/pricing"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-neutral-50"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-neutral-50"
              onClick={() => setMobileOpen(false)}
            >
              My Dashboard
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
