import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { HelpTip } from "../help/help-tip";

const sectors = ["Fabric Care", "Home Care", "Baby Care"];
const categories = ["Laundry Detergents", "Fabric Enhancer", "Bleach"];
const dateRanges = ["Last 30 Days", "Last 90 Days", "YTD"];

export function FilterBar(): React.ReactElement {
  const [sector, setSector] = React.useState<string>(sectors[0]);
  const [dateRange, setDateRange] = React.useState<string>(dateRanges[0]);
  const [categorySelection, setCategorySelection] = React.useState<string[]>(categories);

  const cycleSector = () => {
    const current = sectors.indexOf(sector);
    const next = (current + 1) % sectors.length;
    setSector(sectors[next]);
  };

  const cycleDate = () => {
    const current = dateRanges.indexOf(dateRange);
    const next = (current + 1) % dateRanges.length;
    setDateRange(dateRanges[next]);
  };

  const toggleCategory = (category: string) => {
    setCategorySelection((previous) => {
      if (previous.includes(category)) {
        const next = previous.filter((item) => item !== category);
        return next.length === 0 ? previous : next;
      }
      return [...previous, category];
    });
  };

  return (
    <div className="sticky top-[60px] z-20 border-b border-[#E2E8F0] bg-white px-3 py-2.5 md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Sector:</span>
          <button
            type="button"
            onClick={cycleSector}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#003DA5] bg-[#003DA5] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#0057C8]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {sector}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Category:
          </span>
          {categories.map((category) => {
            const selected = categorySelection.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-xs font-semibold transition-colors ${
                  selected
                    ? "border-[#C7D9F8] bg-[#E8F0FC] text-[#003DA5] hover:bg-[#dce8fd]"
                    : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F4F6FA]"
                }`}
              >
                {category}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Date:</span>
          <button
            type="button"
            onClick={cycleDate}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#C7D9F8] bg-[#E8F0FC] px-4 text-xs font-semibold text-[#003DA5] transition-colors hover:bg-[#dce8fd]"
          >
            {dateRange}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Badge variant="outline" className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#94A3B8]">
            [Mar 2022 - Jun 2024]
          </Badge>
          <HelpTip
            title="Global filter bar"
            content="Filters are interactive in this prototype. Sector/date cycle on click, and category chips toggle selection."
          />
        </div>
      </div>
    </div>
  );
}
