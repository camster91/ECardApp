import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "success" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-brand-100 text-brand-800",
  secondary: "bg-neutral-100 text-neutral-800",
  success: "bg-green-100 text-green-800",
  destructive: "bg-red-100 text-red-800",
  outline: "border border-border text-foreground bg-transparent",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps };
