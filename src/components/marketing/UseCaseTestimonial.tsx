import { Star } from "lucide-react";

interface UseCaseTestimonialProps {
  quote: string;
  name: string;
  role: string;
}

export default function UseCaseTestimonial({
  quote,
  name,
  role,
}: UseCaseTestimonialProps) {
  return (
    <section className="bg-neutral-50 px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-5 w-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <blockquote className="mt-6 text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="mt-6">
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </section>
  );
}
