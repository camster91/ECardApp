import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "200,000+", label: "guests" },
  { value: "10,000+", label: "events" },
  { value: "80+", label: "countries" },
];

export default function Hero() {
  return (
    <section className="gradient-brand relative overflow-hidden px-4 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Create &amp; Send Beautiful Digital Invitations
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
          Design stunning eCards, collect RSVPs instantly, and manage your events
          all in one place &mdash; no stamps required.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-brand-700"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
          >
            See Pricing
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-16 flex max-w-lg flex-wrap items-center justify-center gap-8 sm:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
