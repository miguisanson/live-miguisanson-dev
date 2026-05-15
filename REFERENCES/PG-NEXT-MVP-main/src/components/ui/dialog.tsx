import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  className,
}: DialogProps): React.ReactElement | null {
  React.useEffect(() => {
    if (!open) {
      return;
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(10,22,40,0.48)] p-2 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "dashboard-elevated flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-[#E2E8F0] p-4">
          <div>
            <h2 className="text-base font-semibold text-[#1A1A2E]">{title}</h2>
            {description ? <p className="mt-1 text-sm text-[#64748B]">{description}</p> : null}
          </div>
          <Button variant="outline" size="icon" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        {footer ? (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFD] p-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
