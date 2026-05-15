import { AlertTriangle, CheckCircle } from "lucide-react";

const signals = [
  {
    type: "warning",
    icon: "⚠️",
    bgColor: "bg-red-50",
    borderColor: "border-[#DA291C]",
    title: "COMPETITOR PROMO DETECTED",
    brand: "Surf — Fabric Enhancer subcategory",
    details: "Review volume +58% WoW (847 vs 535 avg)",
    context: "Likely: Campaign or flash sale event",
    date: "Week of May 20–26, 2024",
    action: "Investigate",
  },
  {
    type: "caution",
    icon: "⚠️",
    bgColor: "bg-amber-50",
    borderColor: "border-[#F59E0B]",
    title: "VALUE PERCEPTION GAP",
    brand: "Ariel Laundry — Promo-tagged reviews",
    details: "Promo reviews avg: 4.71 ★",
    context: "Non-promo reviews avg: 4.97 ★",
    date: "Gap: -0.26 pts — Investigate messaging",
    action: "View breakdown",
  },
  {
    type: "success",
    icon: "✓",
    bgColor: "bg-green-50",
    borderColor: "border-[#16A34A]",
    title: "REVIEW VELOCITY NORMAL",
    brand: "Downy Fabric Enhancer",
    details: "Current: 824 reviews/month",
    context: "vs 3-month avg: 801 reviews/month",
    date: "No unusual spike or drop detected",
    action: "View trend",
  },
];

export function MarketOperationsSignals() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Market Operations Signals</h3>

      {/* Signals Grid */}
      <div className="grid grid-cols-3 gap-4">
        {signals.map((signal, idx) => (
          <div
            key={idx}
            className={`${signal.bgColor} border-2 ${signal.borderColor} rounded-xl p-4`}
          >
            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{signal.icon}</span>
              <span className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">
                {signal.title}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4">
              <p className="text-sm font-semibold text-[#1A1A2E]">{signal.brand}</p>
              <p className="text-sm text-[#64748B]">{signal.details}</p>
              <p className="text-sm text-[#64748B]">{signal.context}</p>
              <p className="text-xs text-[#94A3B8]">{signal.date}</p>
            </div>

            {/* Action Button */}
            <button className="text-xs font-medium text-[#003DA5] hover:underline">
              [{signal.action} →]
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
