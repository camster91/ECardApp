import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  quote: string;
  rating: number;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Twyla Tyler",
    quote:
      "I was blown away by how easy it was to create a gorgeous invitation for my daughter's baby shower. The RSVP tracking saved me so much time!",
    rating: 5,
    color: "bg-pink-500",
  },
  {
    name: "Monica W",
    quote:
      "We used this for our wedding and the response was incredible. Guests loved the digital invites and we loved not licking envelopes!",
    rating: 5,
    color: "bg-violet-500",
  },
  {
    name: "Ashley Corbett",
    quote:
      "Perfect for corporate events. I manage dozens of events a year and the dashboard makes it effortless to keep everything organized.",
    rating: 5,
    color: "bg-brand-600",
  },
  {
    name: "Brian Stuart",
    quote:
      "The free tier is genuinely generous. I tested it for a small birthday party and upgraded for my company holiday party. Worth every penny.",
    rating: 5,
    color: "bg-emerald-500",
  },
  {
    name: "Lise Lumb",
    quote:
      "Beautiful templates, super intuitive editor, and the cards looked amazing on every phone. I've recommended it to all my friends.",
    rating: 5,
    color: "bg-amber-500",
  },
  {
    name: "Thomas Reinhard",
    quote:
      "As someone who designs for a living, I appreciate the attention to detail. The customization options are top-notch and the output is polished.",
    rating: 5,
    color: "bg-sky-500",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Over 500 5-star reviews
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by event organizers everywhere
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <StarRating count={t.rating} />

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="mt-5 flex items-center gap-3">
                {/* Initial avatar */}
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                    t.color
                  )}
                >
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
