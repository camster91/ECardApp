import type { Metadata } from "next";
import PricingCards from "@/components/marketing/PricingCards";
import PricingFAQ from "@/components/marketing/PricingFAQ";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import Testimonials from "@/components/marketing/Testimonials";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main>
      {/* Hero header */}
      <section className="gradient-brand px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Simple, transparent pricing for every event size. Start free and
            upgrade only when you need to.
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <PricingCards />

      {/* Features */}
      <FeaturesGrid />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <PricingFAQ />
    </main>
  );
}
