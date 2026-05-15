import * as React from "react";
import { CircleHelp } from "lucide-react";
import { cn } from "../../lib/utils";

interface HelpTipProps {
  title: string;
  content: string;
  className?: string;
}

export function HelpTip({ title, content, className }: HelpTipProps): React.ReactElement {
  const [open, setOpen] = React.useState<boolean>(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onOutside = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <span
      ref={ref}
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`Help: ${title}`}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#C7D9F8] bg-white text-[#003DA5] transition-colors hover:bg-[#E8F0FC]"
      >
        <CircleHelp className="h-3.5 w-3.5" />
      </button>

      {open ? (
        <div className="dashboard-elevated absolute left-6 top-6 z-50 w-72 rounded-lg border border-[#E2E8F0] bg-white p-3 text-left">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            {title}
          </p>
          <p className="text-xs leading-relaxed text-[#334155]">{content}</p>
        </div>
      ) : null}
    </span>
  );
}
