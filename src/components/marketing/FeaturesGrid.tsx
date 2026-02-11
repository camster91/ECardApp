import { FEATURES_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Palette,
  Mail,
  BarChart3,
  Globe,
  Smartphone,
  Lock,
  Users,
  Sparkles,
  CalendarCheck,
  Gift,
  Image,
  Share2,
  type LucideIcon,
} from "lucide-react";

/** Map icon name strings from constants to actual Lucide components. */
const iconMap: Record<string, LucideIcon> = {
  Palette,
  Mail,
  BarChart3,
  Globe,
  Smartphone,
  Lock,
  Users,
  Sparkles,
  CalendarCheck,
  Gift,
  Image,
  Share2,
};

export default function FeaturesGrid() {
  return (
    <section className="bg-neutral-900 px-4 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All the features you need for your event
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything from design to delivery, all in one platform.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES_LIST.map((feature, idx) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                )}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>

                {feature.subtitle && (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
                    {feature.subtitle}
                  </p>
                )}

                <h3 className="text-lg font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
