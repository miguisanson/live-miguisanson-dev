import * as React from "react";
import { cn } from "../../lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  className,
  children,
  ...props
}: SelectProps): React.ReactElement {
  return (
    <select
      className={cn(
        "h-10 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#4A9EFF]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
