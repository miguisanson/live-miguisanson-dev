import * as React from "react";
import { cn } from "../../lib/utils";

interface TabsContextShape {
  value: string;
  setValue: (next: string) => void;
}

const TabsContext = React.createContext<TabsContextShape | null>(null);

interface TabsProps {
  value: string;
  onValueChange: (next: string) => void;
  children: React.ReactNode;
}

export function Tabs({
  value,
  onValueChange,
  children,
}: TabsProps): React.ReactElement {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white p-1",
        className,
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps): React.ReactElement {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used inside Tabs");
  }

  const active = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.setValue(value)}
      className={cn(
        "inline-flex items-center justify-center rounded px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-[#003DA5] text-white"
          : "text-slate-600 hover:bg-[#E8F0FC] hover:text-slate-900",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  className,
  value,
  ...props
}: TabsContentProps): React.ReactElement | null {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used inside Tabs");
  }
  if (context.value !== value) {
    return null;
  }
  return <div className={cn("mt-4", className)} {...props} />;
}
