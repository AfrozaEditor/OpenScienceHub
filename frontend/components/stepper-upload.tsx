import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
  description?: string;
}

export function StepperUpload({
  steps,
  current,
}: {
  steps: StepperStep[];
  current: number;
}) {
  return (
    <ol className="flex w-full items-center">
      {steps.map((step, index) => {
        const isCompleted = index < current;
        const isActive = index === current;
        const isLast = index === steps.length - 1;
        return (
          <li
            key={step.label}
            className={cn("flex items-center", !isLast && "flex-1")}
          >
            <div className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary bg-primary/10 text-primary",
                  !isCompleted && !isActive && "border-border bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </span>
              <span className="mt-2 hidden text-xs sm:block">
                <span
                  className={cn(
                    "font-medium",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full transition-colors sm:mx-3",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
