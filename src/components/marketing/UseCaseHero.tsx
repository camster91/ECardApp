import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface UseCaseHeroProps {
  headline: string;
  subtext: string;
  ctaText: string;
}

export default function UseCaseHero({
  headline,
  subtext,
  ctaText,
}: UseCaseHeroProps) {
  return (
    <section className="gradient-brand px-4 py-20 text-center text-white sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
          {subtext}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-600 shadow-lg transition hover:bg-white/90"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
