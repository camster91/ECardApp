import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/marketing/Hero";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import Testimonials from "@/components/marketing/Testimonials";
import PricingCards from "@/components/marketing/PricingCards";
import CTASection from "@/components/marketing/CTASection";

export const metadata: Metadata = {
  title: "CreateCards.io - Beautiful Digital Invitations",
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <Hero />

        {/* Features */}
        <FeaturesGrid />

        {/* Testimonials */}
        <Testimonials />

        {/* Pricing preview */}
        <section className="bg-neutral-50 py-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Start free. Upgrade when your event grows.
            </p>
          </div>
          <PricingCards />
        </section>

        {/* CTA */}
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
