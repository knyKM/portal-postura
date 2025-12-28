"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-800 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800/80",
        outline:
          "border-zinc-200 bg-transparent text-zinc-800 dark:border-zinc-800 dark:text-zinc-100",
        success:
          "border-transparent bg-emerald-600/15 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300",
        warning:
          "border-transparent bg-amber-500/15 text-amber-500 dark:bg-amber-500/20 dark:text-amber-300",
        critical:
          "border-transparent bg-rose-600/15 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
