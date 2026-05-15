import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FilterBar() {
  const [selectedSector, setSelectedSector] = useState("Fabric Care");
  const [selectedCategories, setSelectedCategories] = useState(["Laundry Detergents", "Fabric Enhancer", "Bleach"]);
  const [selectedDate, setSelectedDate] = useState("Last 30 Days");

  return (
    <div className="h-14 bg-white border-b border-[#E2E8F0] sticky top-[60px] z-40 flex items-center gap-4 px-6">
      {/* Sector */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Sector:</span>
        <button className="flex items-center gap-2 h-8 px-4 bg-[#003DA5] text-white rounded-lg text-xs font-medium border border-[#003DA5] hover:bg-[#0057C8] transition-colors">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          {selectedSector}
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category:</span>
        {selectedCategories.map((category) => (
          <button
            key={category}
            className="flex items-center gap-2 h-8 px-4 bg-[#E8F0FC] text-[#003DA5] rounded-lg text-xs font-medium border border-[#C7D9F8] hover:bg-[#003DA5] hover:text-white transition-colors"
          >
            {category}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2.5 ml-auto">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Date:</span>
        <button className="flex items-center gap-2 h-8 px-4 bg-[#E8F0FC] text-[#003DA5] rounded-lg text-xs font-medium border border-[#C7D9F8] hover:bg-[#003DA5] hover:text-white transition-colors">
          {selectedDate}
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs text-[#94A3B8]">
          [Mar 2022 – Jun 2024]
        </span>
      </div>
    </div>
  );
}