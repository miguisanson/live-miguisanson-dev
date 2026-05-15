import * as React from "react";
import { cn } from "../../lib/utils";

function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        "dashboard-elevated rounded-xl border border-[#E2E8F0] bg-white",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-5 pb-2", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return (
    <h3 className={cn("text-lg font-semibold text-[#1A1A2E]", className)} {...props} />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
  return (
    <p className={cn("text-sm text-[#64748B]", className)} {...props} />
  );
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("p-5 pt-3", className)} {...props} />;
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn("flex items-center border-t border-[#E2E8F0] p-4", className)}
      {...props}
    />
  );
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
