"use client";

import { FAQ_ITEMS } from "@/lib/constants";
import { Accordion } from "@/components/ui/Accordion";

export default function PricingFAQ() {
  const items = FAQ_ITEMS.map((item, idx) => ({
    id: `faq-${idx}`,
    title: item.question,
    content: item.answer,
  }));

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
        Frequently Asked Questions
      </h2>
      <Accordion items={items} />
    </section>
  );
}
