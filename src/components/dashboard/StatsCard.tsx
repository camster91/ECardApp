import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "purple" | "blue" | "green" | "amber";
  className?: string;
}

const colorMap = {
  purple: {
    bg: "from-brand-500 to-brand-600",
    light: "bg-brand-50",
    text: "text-brand-700",
  },
  blue: {
    bg: "from-blue-500 to-blue-600",
    light: "bg-blue-50",
    text: "text-blue-700",
  },
  green: {
    bg: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-50",
    text: "text-emerald-700",
  },
  amber: {
    bg: "from-amber-500 to-amber-600",
    light: "bg-amber-50",
    text: "text-amber-700",
  },
};

export function StatsCard({
  title,
  value,
  icon,
  color = "purple",
  className,
}: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            c.bg
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
