"use client";

import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#7c3aed",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#e11d48",
  "#0ea5e9",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
              value === color ? "border-foreground scale-110" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
          />
        ))}
        <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-neutral-300 hover:border-brand-400">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-0 w-0 opacity-0"
          />
          <span className="text-xs font-bold text-muted-foreground">+</span>
        </label>
      </div>
    </div>
  );
}

export { ColorPicker };
