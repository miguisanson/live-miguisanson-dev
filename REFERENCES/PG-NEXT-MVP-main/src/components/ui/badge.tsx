import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-[#F4F6FA] text-[#64748B]",
        success: "bg-[#E8F8EF] text-[#15803D]",
        warning: "bg-[#FEF3C7] text-[#B45309]",
        danger: "bg-[#FEE2E2] text-[#B91C1C]",
        info: "bg-[#E8F0FC] text-[#003DA5]",
        outline: "border border-[#C7D9F8] bg-white text-[#1A1A2E]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
