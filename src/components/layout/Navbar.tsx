"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const useCaseLinks = [
  { label: "Weddings", href: "/use-cases/weddings" },
  { label: "Baby Showers", href: "/use-cases/baby-showers" },
  { label: "Birthday Parties", href: "/use-cases/birthday-parties" },
  { label: "Corporate Events", href: "/use-cases/corporate-events" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              How It Works
            </Link>

            {/* Use Cases dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Use Cases
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-white py-1 shadow-lg">
                  {useCaseLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:bg-neutral-50 hover:text-foreground"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Pricing
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
            className="rounded-lg p-2 hover:bg-neutral-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            mobileOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="space-y-2 px-4 pb-4">
            <Link
              href="/how-it-works"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-neutral-50"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </Link>

            <div className="px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Use Cases
              </p>
              <div className="mt-1 space-y-1">
                {useCaseLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-neutral-50 hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/pricing"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-neutral-50"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
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
