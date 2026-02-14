import { CalendarCheck, Users, Star, Zap } from "lucide-react";

const stats = [
  { icon: CalendarCheck, value: "10,000+", label: "events created" },
  { icon: Users, value: "200,000+", label: "guests invited" },
  { icon: Star, value: "4.9/5", label: "rating" },
  { icon: Zap, value: "Free", label: "to start" },
];

export default function TrustBar() {
  return (
    <section className="border-b border-border bg-white py-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-4 sm:gap-12">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <stat.icon className="h-5 w-5 text-brand-600" />
            <div>
              <span className="text-lg font-bold text-foreground">
                {stat.value}
              </span>{" "}
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
