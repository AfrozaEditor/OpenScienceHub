import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 w-fit transition-colors overflow-hidden focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:size-3 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-foreground",
        brand: "border-transparent bg-brand text-brand-foreground",
        ai: "border-transparent bg-ai/10 text-[var(--ai)]",
        success: "border-transparent bg-success/12 text-[var(--success)]",
        warning: "border-transparent bg-warning/15 text-[#b45309]",
        thesis: "border-transparent bg-violet-100 text-violet-700",
        destructive: "border-transparent bg-destructive/10 text-[var(--destructive)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
