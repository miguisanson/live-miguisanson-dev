import * as React from "react";
import { cn } from "../../lib/utils";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>): React.ReactElement {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.ReactElement {
  return (
    <thead className={cn("[&_tr]:border-b [&_tr]:border-[#E2E8F0] [&_th]:bg-[#F8FAFD]", className)} {...props} />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.ReactElement {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0 [&_tr]:border-b [&_tr]:border-[#E2E8F0]", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>): React.ReactElement {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-[#F8FAFD] data-[state=selected]:bg-[#E8F0FC]",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>): React.ReactElement {
  return (
    <th
      className={cn(
        "h-10 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-[#94A3B8]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>): React.ReactElement {
  return <td className={cn("p-3 align-middle text-sm text-[#1A1A2E]", className)} {...props} />;
}
