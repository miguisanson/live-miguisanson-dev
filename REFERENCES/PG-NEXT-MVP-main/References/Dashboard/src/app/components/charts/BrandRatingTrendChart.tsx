import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

const chartData = [
  { week: "W1", Ariel: 4.94, Tide: 4.91, Downy: 4.94, Breeze: 4.95, Surf: 4.94, "Mighty Clean": 4.89, Champion: 4.93 },
  { week: "W2", Ariel: 4.95, Tide: 4.90, Downy: 4.96, Breeze: 4.96, Surf: 4.95, "Mighty Clean": 4.91, Champion: 4.94 },
  { week: "W3", Ariel: 4.97, Tide: 4.93, Downy: 4.95, Breeze: 4.98, Surf: 4.96, "Mighty Clean": 4.92, Champion: 4.95 },
  { week: "W4", Ariel: 4.93, Tide: 4.92, Downy: 4.94, Breeze: 4.97, Surf: 4.94, "Mighty Clean": 4.90, Champion: 4.93 },
  { week: "W5", Ariel: 4.96, Tide: 4.94, Downy: 4.97, Breeze: 4.96, Surf: 4.97, "Mighty Clean": 4.93, Champion: 4.96 },
  { week: "W6", Ariel: 4.95, Tide: 4.93, Downy: 4.95, Breeze: 4.96, Surf: 4.96, "Mighty Clean": 4.91, Champion: 4.95 },
  { week: "W7", Ariel: 4.97, Tide: 4.92, Downy: 4.94, Breeze: 4.97, Surf: 4.95, "Mighty Clean": 4.92, Champion: 4.94 },
  { week: "W8", Ariel: 4.95, Tide: 4.93, Downy: 4.96, Breeze: 4.97, Surf: 4.96, "Mighty Clean": 4.93, Champion: 4.96 },
];

const brandStyles = {
  Ariel: { color: "#003DA5", strokeWidth: 2.5, strokeDasharray: "0" },
  Tide: { color: "#0057C8", strokeWidth: 2, strokeDasharray: "0" },
  Downy: { color: "#4A9EFF", strokeWidth: 2, strokeDasharray: "0" },
  Breeze: { color: "#7FBFFF", strokeWidth: 2, strokeDasharray: "0" },
  Surf: { color: "#F59E0B", strokeWidth: 1.5, strokeDasharray: "5 5" },
  "Mighty Clean": { color: "#94A3B8", strokeWidth: 1.5, strokeDasharray: "5 5" },
  Champion: { color: "#CBD5E1", strokeWidth: 1.5, strokeDasharray: "5 5" },
};

type FilterType = "all" | "pg" | "competitors";

export function BrandRatingTrendChart() {
  const [filter, setFilter] = useState<FilterType>("all");

  const pgBrands = ["Ariel", "Tide", "Downy", "Breeze"];
  const competitorBrands = ["Surf", "Mighty Clean", "Champion"];

  const visibleBrands =
    filter === "pg" ? pgBrands : filter === "competitors" ? competitorBrands : [...pgBrands, ...competitorBrands];

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1A2E]">Brand Rating Trend — 4-Week Rolling Average</h3>
          <p className="text-sm text-[#64748B] mt-1">P&G vs Competitor Brands · Fabric Care</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("pg")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "pg"
                ? "bg-[#003DA5] text-white"
                : "bg-[#F4F6FA] text-[#1A1A2E] hover:bg-[#E2E8F0]"
            }`}
          >
            P&G Only
          </button>
          <button
            onClick={() => setFilter("competitors")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "competitors"
                ? "bg-[#003DA5] text-white"
                : "bg-[#F4F6FA] text-[#1A1A2E] hover:bg-[#E2E8F0]"
            }`}
          >
            Competitors Only
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-[#003DA5] text-white"
                : "bg-[#F4F6FA] text-[#1A1A2E] hover:bg-[#E2E8F0]"
            }`}
          >
            All Brands
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 12 }} />
          <YAxis domain={[4.85, 5.0]} tick={{ fill: "#64748B", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            iconType="line"
          />
          {visibleBrands.map((brand) => (
            <Line
              key={brand}
              type="monotone"
              dataKey={brand}
              stroke={brandStyles[brand as keyof typeof brandStyles].color}
              strokeWidth={brandStyles[brand as keyof typeof brandStyles].strokeWidth}
              strokeDasharray={brandStyles[brand as keyof typeof brandStyles].strokeDasharray}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">P&G Brands:</span>
          {pgBrands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <div
                className="w-6 h-0.5"
                style={{ backgroundColor: brandStyles[brand as keyof typeof brandStyles].color }}
              ></div>
              <span className="text-xs text-[#1A1A2E]">{brand}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Competitors:</span>
          {competitorBrands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <div
                className="w-6 h-0.5"
                style={{
                  backgroundColor: brandStyles[brand as keyof typeof brandStyles].color,
                  backgroundImage: "repeating-linear-gradient(to right, currentColor 0, currentColor 3px, transparent 3px, transparent 6px)",
                }}
              ></div>
              <span className="text-xs text-[#1A1A2E]">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
