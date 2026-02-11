"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-brand-600 text-white",
                  isCurrent &&
                    "border-2 border-brand-600 bg-brand-50 text-brand-600",
                  !isCompleted &&
                    !isCurrent &&
                    "border-2 border-neutral-200 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isCurrent ? "text-brand-600" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 sm:w-12",
                  isCompleted ? "bg-brand-600" : "bg-neutral-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { Stepper };
export type { Step };
