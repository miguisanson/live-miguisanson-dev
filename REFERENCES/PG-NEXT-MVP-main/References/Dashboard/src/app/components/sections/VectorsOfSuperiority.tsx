import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

const vectors = [
  {
    name: "PRODUCT",
    rating: "4.92/5",
    percentage: 92,
    delta: "+0.04",
    direction: "up",
    trend: "vs prior month",
    topKeyword: '"works/epekto"',
    hasWarning: false,
  },
  {
    name: "PACKAGING",
    rating: "4.71/5",
    percentage: 84,
    delta: "-0.08",
    direction: "down",
    trend: "vs prior month",
    topKeyword: '"butas/leak"',
    hasWarning: true,
  },
  {
    name: "COMMUNICATION",
    rating: "4.65/5",
    percentage: 79,
    delta: "Stable",
    direction: "stable",
    trend: "vs prior month",
    topKeyword: '"label claims"',
    hasWarning: false,
  },
  {
    name: "RETAIL EXEC",
    rating: "4.44/5",
    percentage: 71,
    delta: "-0.12",
    direction: "down",
    trend: "vs prior month",
    topKeyword: '"out of stock"',
    hasWarning: true,
  },
  {
    name: "VALUE",
    rating: "4.38/5",
    percentage: 67,
    delta: "-0.11",
    direction: "down",
    trend: "vs prior month",
    topKeyword: '"mahal/sulit"',
    hasWarning: true,
  },
];

export function VectorsOfSuperiority() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
        5 Vectors of Superiority Scores — P&G Portfolio
      </h3>

      {/* Vectors Grid */}
      <div className="grid grid-cols-5 gap-4">
        {vectors.map((vector, idx) => (
          <div
            key={idx}
            className={`bg-white border rounded-lg p-4 ${
              vector.hasWarning ? "border-[#F59E0B] border-t-4" : "border-[#003DA5] border-t-4"
            }`}
          >
            {/* Name */}
            <div className="text-xs font-semibold text-[#1A1A2E] mb-3 uppercase tracking-wider">
              {vector.name}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-[#1A1A2E]">{vector.rating}</span>
            </div>

            {/* Radial Progress */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={vector.hasWarning ? "#F59E0B" : "#003DA5"}
                    strokeWidth="4"
                    strokeDasharray={`${vector.percentage * 1.76} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#1A1A2E]">{vector.percentage}%</span>
                </div>
              </div>
            </div>

            {/* Delta */}
            <div className="flex items-center gap-1 mb-1">
              {vector.direction === "up" ? (
                <TrendingUp className="w-3 h-3 text-[#16A34A]" />
              ) : vector.direction === "down" ? (
                <>
                  <TrendingDown className="w-3 h-3 text-[#DA291C]" />
                  {vector.hasWarning && <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />}
                </>
              ) : (
                <Minus className="w-3 h-3 text-[#64748B]" />
              )}
              <span
                className={`text-xs font-semibold ${
                  vector.direction === "up"
                    ? "text-[#16A34A]"
                    : vector.direction === "down"
                    ? "text-[#DA291C]"
                    : "text-[#64748B]"
                }`}
              >
                {vector.delta}
              </span>
            </div>
            <div className="text-[10px] text-[#64748B] mb-3">{vector.trend}</div>

            {/* Top Keyword */}
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Top keyword:</div>
            <div className="text-xs text-[#1A1A2E] font-medium">{vector.topKeyword}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
