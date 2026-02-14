"use client";

import { Accordion } from "@/components/ui/Accordion";

interface FAQ {
  question: string;
  answer: string;
}

export default function UseCaseFAQ({ faqs }: { faqs: FAQ[] }) {
  const items = faqs.map((faq, idx) => ({
    id: `uc-faq-${idx}`,
    title: faq.question,
    content: faq.answer,
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
