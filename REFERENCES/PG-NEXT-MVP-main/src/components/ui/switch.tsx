import * as React from "react";
import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  className,
}: SwitchProps): React.ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-[#003DA5]" : "bg-slate-300",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-slate-100 transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}
