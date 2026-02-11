"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn("flex gap-1 border-b border-border", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === tab.id
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-neutral-300"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export { Tabs };
export type { Tab };
