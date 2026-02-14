import { Paintbrush, UserPlus, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Paintbrush,
    step: "1",
    title: "Design Your Invitation",
    description:
      "Upload your design or start from scratch. Customize colors, add music, and make it uniquely yours.",
  },
  {
    icon: UserPlus,
    step: "2",
    title: "Add Your Guests",
    description:
      "Share via email, text, or a custom link. Your guests get a beautiful, interactive invitation.",
  },
  {
    icon: BarChart3,
    step: "3",
    title: "Track RSVPs",
    description:
      "Watch responses roll in. See headcounts, meal choices, and manage everything from your dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-neutral-50 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Create and send beautiful digital invitations in three simple steps.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="mt-4 inline-block rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                Step {s.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
