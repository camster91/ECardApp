import { TIERS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

const tierOrder = ["free", "standard", "premium"] as const;

export default function PricingCards() {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-6xl rounded-2xl bg-neutral-900 p-6 sm:p-10">
        <div className="grid gap-6 md:grid-cols-3">
          {tierOrder.map((key) => {
            const tier = TIERS[key];
            const isPremium = key === "premium";
            const isStandard = key === "standard";
            const highlighted = isStandard;

            return (
              <Card
                key={key}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-xl bg-white text-neutral-900",
                  highlighted && "ring-2 ring-brand-600"
                )}
              >
                {/* Header area */}
                <div
                  className={cn(
                    "px-6 pt-6 pb-4",
                    highlighted && "bg-brand-50"
                  )}
                >
                  <span
                    className={cn(
                      "mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold",
                      highlighted
                        ? "bg-brand-100 text-brand-700"
                        : isPremium
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-700"
                    )}
                  >
                    {tier.tagline}
                  </span>

                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tier.replyLabel}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 px-6 py-4">
                  <span className="text-3xl font-extrabold tracking-tight">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.price === 0 ? "forever" : "per event"}
                  </span>
                  {"badge" in tier && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-brand-100/80 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                      {tier.badge}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <div className="px-6 pb-4">
                  <Link
                    href="/signup"
                    className={cn(
                      "block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors",
                      highlighted
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : isPremium
                          ? "bg-neutral-900 text-white hover:bg-neutral-800"
                          : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    {tier.price === 0
                      ? "Get Started"
                      : `Upgrade for $${tier.price}`}
                  </Link>
                </div>

                {/* Divider */}
                <hr className="mx-6 border-neutral-200" />

                {/* Features */}
                <ul className="flex flex-1 flex-col gap-3 px-6 py-5">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <span>
                        <strong>{feature.title}</strong>
                        {feature.description && (
                          <span className="text-muted-foreground">
                            {" "}
                            &mdash; {feature.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                {"footnote" in tier && (
                  <p className="px-6 pb-4 text-xs text-muted-foreground">
                    {tier.footnote}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
