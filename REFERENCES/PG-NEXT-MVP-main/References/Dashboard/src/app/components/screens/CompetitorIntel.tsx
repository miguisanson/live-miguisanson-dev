import { Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const chartData = [
  { week: "W1", Ariel: 4.94, Tide: 4.91, Downy: 4.94, Breeze: 4.95, Surf: 4.94, "Mighty Clean": 4.89, Champion: 4.93 },
  { week: "W2", Ariel: 4.95, Tide: 4.90, Downy: 4.96, Breeze: 4.96, Surf: 4.95, "Mighty Clean": 4.91, Champion: 4.94 },
  { week: "W3", Ariel: 4.97, Tide: 4.93, Downy: 4.95, Breeze: 4.98, Surf: 4.96, "Mighty Clean": 4.92, Champion: 4.95 },
  { week: "W4", Ariel: 4.93, Tide: 4.92, Downy: 4.94, Breeze: 4.97, Surf: 4.94, "Mighty Clean": 4.90, Champion: 4.93 },
  { week: "W5", Ariel: 4.96, Tide: 4.94, Downy: 4.97, Breeze: 4.96, Surf: 4.97, "Mighty Clean": 4.93, Champion: 4.96 },
  { week: "W6", Ariel: 4.95, Tide: 4.93, Downy: 4.95, Breeze: 4.96, Surf: 4.96, "Mighty Clean": 4.91, Champion: 4.95 },
  { week: "W7", Ariel: 4.97, Tide: 4.92, Downy: 4.94, Breeze: 4.97, Surf: 4.95, "Mighty Clean": 4.92, Champion: 4.94 },
  { week: "W8", Ariel: 4.95, Tide: 4.93, Downy: 4.96, Breeze: 4.97, Surf: 4.96, "Mighty Clean": 4.93, Champion: 4.96 },
  { week: "W9", Ariel: 4.94, Tide: 4.92, Downy: 4.95, Breeze: 4.96, Surf: 4.97, "Mighty Clean": 4.92, Champion: 4.95 },
  { week: "W10", Ariel: 4.95, Tide: 4.93, Downy: 4.94, Breeze: 4.97, Surf: 4.96, "Mighty Clean": 4.91, Champion: 4.94 },
  { week: "W11", Ariel: 4.96, Tide: 4.91, Downy: 4.96, Breeze: 4.96, Surf: 4.95, "Mighty Clean": 4.92, Champion: 4.95 },
  { week: "W12", Ariel: 4.95, Tide: 4.92, Downy: 4.95, Breeze: 4.97, Surf: 4.96, "Mighty Clean": 4.93, Champion: 4.96 },
  { week: "W13", Ariel: 4.94, Tide: 4.93, Downy: 4.94, Breeze: 4.96, Surf: 4.97, "Mighty Clean": 4.92, Champion: 4.95 },
  { week: "W14", Ariel: 4.95, Tide: 4.92, Downy: 4.95, Breeze: 4.97, Surf: 4.96, "Mighty Clean": 4.93, Champion: 4.96 },
  { week: "W15", Ariel: 4.96, Tide: 4.93, Downy: 4.96, Breeze: 4.96, Surf: 4.98, "Mighty Clean": 4.94, Champion: 4.95 },
  { week: "W16", Ariel: 4.95, Tide: 4.93, Downy: 4.94, Breeze: 4.97, Surf: 4.96, "Mighty Clean": 4.93, Champion: 4.96 },
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

export function CompetitorIntel() {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Competitor Intelligence</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Market share signals · Fabric Care · Lazada PH
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#003DA5] text-white rounded-lg text-sm font-medium hover:bg-[#0057C8] transition-colors">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            Share Shift Leaders (This Month)
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Surf:</span>
              <span className="text-sm font-bold text-[#DA291C]">+0.24 pts ↑</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Mighty Clean:</span>
              <span className="text-sm font-bold text-[#F59E0B]">+0.18 pts ↑</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Champion:</span>
              <span className="text-sm font-bold text-[#F59E0B]">+0.12 pts ↑</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            P&G vs Market Avg Rating
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">4.95 ★</div>
          <div className="text-sm text-[#64748B] mb-2">P&G Portfolio</div>
          <div className="text-sm text-[#64748B]">
            Market Average: <span className="font-medium text-[#1A1A2E]">4.93 ★</span>
          </div>
          <div className="text-sm text-[#16A34A] font-semibold mt-1">P&G premium: +0.02 pts</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            New Entrants Detected
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">2</div>
          <div className="text-sm text-[#64748B] mb-2">new SKUs detected</div>
          <div className="text-xs text-[#64748B]">&lt; 60 days on catalog, 20+ reviews</div>
          <button className="text-xs font-medium text-[#003DA5] hover:underline mt-2">
            [See new entrant cards ↓]
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            Listing Velocity Gap
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-[#64748B]">P&G avg:</span>{" "}
              <span className="font-medium text-[#1A1A2E]">23 days</span>
            </div>
            <div className="text-sm">
              <span className="text-[#64748B]">Surf avg:</span>{" "}
              <span className="font-medium text-[#1A1A2E]">18 days</span>
            </div>
            <div className="text-sm text-[#DA291C] font-semibold">Gap: P&G slower by 5 days</div>
          </div>
        </div>
      </div>

      {/* Row 2 - Brand Rating Trend Chart + Share Shift Delta */}
      <div className="grid grid-cols-[70%_30%] gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">Brand Rating Trend — 16 Weeks</h3>
          <p className="text-sm text-[#64748B] mb-4">All brands · Fabric Care</p>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 11 }} />
              <YAxis domain={[4.85, 5.0]} tick={{ fill: "#64748B", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <ReferenceLine x="W12" stroke="#F59E0B" strokeDasharray="3 3" label={{ value: "Surf Promo Event", position: "top", fill: "#F59E0B", fontSize: 10 }} />
              {Object.keys(brandStyles).map((brand) => (
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
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1 uppercase tracking-wider">Share Shift Delta</h3>
          <p className="text-xs text-[#64748B] mb-4">4-wk avg current vs prior 4-wk avg</p>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-2 text-[#64748B] font-medium text-[10px]">Brand</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-[10px]">Current</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-[10px]">Prior</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-[10px]">Δ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Surf</td>
                <td className="text-right">4.96</td>
                <td className="text-right">4.72</td>
                <td className="text-right text-[#DA291C] font-bold">+0.24 ↑⚠️</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Mighty Clean</td>
                <td className="text-right">4.93</td>
                <td className="text-right">4.75</td>
                <td className="text-right text-[#F59E0B] font-medium">+0.18 ↑</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Champion</td>
                <td className="text-right">4.95</td>
                <td className="text-right">4.83</td>
                <td className="text-right text-[#F59E0B] font-medium">+0.12 ↑</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Ariel</td>
                <td className="text-right">4.95</td>
                <td className="text-right">4.93</td>
                <td className="text-right text-[#64748B]">+0.02 →</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Breeze</td>
                <td className="text-right">4.97</td>
                <td className="text-right">4.95</td>
                <td className="text-right text-[#64748B]">+0.02 →</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Downy</td>
                <td className="text-right">4.94</td>
                <td className="text-right">4.97</td>
                <td className="text-right text-[#0057C8]">-0.03 ↓</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Tide</td>
                <td className="text-right">4.93</td>
                <td className="text-right">4.94</td>
                <td className="text-right text-[#64748B]">-0.01 →</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3 - Company-Brand-Product Mapping + Competitor Gap Analysis */}
      <div className="grid grid-cols-[55%_45%] gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Company-Brand-Product Mapping</h3>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-2 text-[#64748B] font-medium text-[10px] uppercase tracking-wider">Company</th>
                <th className="text-left py-2 text-[#64748B] font-medium text-[10px] uppercase tracking-wider">Brand</th>
                <th className="text-left py-2 text-[#64748B] font-medium text-[10px] uppercase tracking-wider">Subcategory</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-[10px] uppercase tracking-wider">SKUs</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-[10px] uppercase tracking-wider">Avg ★</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-[10px] uppercase tracking-wider">Reviews</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#E8F0FC] border-b border-[#C7D9F8]">
                <td className="py-2 font-medium">P&G</td>
                <td>Ariel</td>
                <td>Laundry Detergent</td>
                <td className="text-right">12</td>
                <td className="text-right">4.95</td>
                <td className="text-right">6,272</td>
              </tr>
              <tr className="bg-[#E8F0FC] border-b border-[#C7D9F8]">
                <td className="py-2 font-medium">P&G</td>
                <td>Tide</td>
                <td>Laundry Detergent</td>
                <td className="text-right">8</td>
                <td className="text-right">4.93</td>
                <td className="text-right">1,407</td>
              </tr>
              <tr className="bg-[#E8F0FC] border-b border-[#C7D9F8]">
                <td className="py-2 font-medium">P&G</td>
                <td>Downy</td>
                <td>Fabric Enhancer</td>
                <td className="text-right">9</td>
                <td className="text-right">4.94</td>
                <td className="text-right">2,023</td>
              </tr>
              <tr className="bg-[#E8F0FC] border-b-2 border-[#003DA5]">
                <td className="py-2 font-medium">P&G</td>
                <td>Breeze</td>
                <td>Laundry Detergent</td>
                <td className="text-right">11</td>
                <td className="text-right">4.96</td>
                <td className="text-right">5,106</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Unilever</td>
                <td>Surf</td>
                <td>Laundry Detergent</td>
                <td className="text-right">15</td>
                <td className="text-right">4.96</td>
                <td className="text-right">5,888</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Unknown</td>
                <td>Mighty Clean</td>
                <td>Laundry Detergent</td>
                <td className="text-right">10</td>
                <td className="text-right">4.92</td>
                <td className="text-right">3,948</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Unknown</td>
                <td>Champion</td>
                <td>Fabric Enhancer</td>
                <td className="text-right">7</td>
                <td className="text-right">4.96</td>
                <td className="text-right">1,639</td>
              </tr>
              <tr className="border-b-2 border-[#E2E8F0]">
                <td className="py-2 font-medium">Unknown</td>
                <td>Del</td>
                <td>Laundry Detergent</td>
                <td className="text-right">6</td>
                <td className="text-right">4.96</td>
                <td className="text-right">1,656</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="py-2 font-medium">Unclassified</td>
                <td>[22 brands]</td>
                <td>Various</td>
                <td className="text-right">104</td>
                <td className="text-right">4.88</td>
                <td className="text-right">25,483</td>
              </tr>
            </tbody>
          </table>
          <button className="text-xs font-medium text-[#003DA5] hover:underline mt-3">
            [Classify Manually →]
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1 uppercase tracking-wider">Competitor Gap Analysis</h3>
          <p className="text-xs text-[#64748B] mb-4">Themes in competitor 4★+ reviews absent in P&G equivalents</p>

          <div className="mb-4">
            <div className="text-xs font-bold text-[#1A1A2E] mb-3 uppercase tracking-wider">
              Top Positive Themes Competitors Have That P&G Is Missing:
            </div>
            <table className="w-full text-xs mb-3">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left py-2 text-[#64748B] font-medium text-[10px]">Theme</th>
                  <th className="text-right py-2 text-[#64748B] font-medium text-[10px]">Comp %</th>
                  <th className="text-right py-2 text-[#64748B] font-medium text-[10px]">P&G %</th>
                  <th className="text-right py-2 text-[#64748B] font-medium text-[10px]">Gap</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="py-2">"Affordable / sulit"</td>
                  <td className="text-right">34%</td>
                  <td className="text-right">18%</td>
                  <td className="text-right font-bold text-[#DA291C]">-16% 🔴</td>
                </tr>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="py-2">"Long-lasting scent"</td>
                  <td className="text-right">41%</td>
                  <td className="text-right">29%</td>
                  <td className="text-right font-bold text-[#F59E0B]">-12% 🟡</td>
                </tr>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="py-2">"Easy dissolve"</td>
                  <td className="text-right">28%</td>
                  <td className="text-right">18%</td>
                  <td className="text-right font-bold text-[#F59E0B]">-10% 🟡</td>
                </tr>
                <tr className="border-b border-[#E2E8F0]">
                  <td className="py-2">"Gentle on skin"</td>
                  <td className="text-right">22%</td>
                  <td className="text-right">15%</td>
                  <td className="text-right font-bold text-[#0057C8]">-7% 🔵</td>
                </tr>
                <tr>
                  <td className="py-2">"Good packaging"</td>
                  <td className="text-right">31%</td>
                  <td className="text-right">25%</td>
                  <td className="text-right font-bold text-[#0057C8]">-6% 🔵</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="text-xs font-bold text-[#16A34A] mb-2 uppercase tracking-wider">
              P&G Strengths (gaps in competitor reviews):
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>✓ "Effective / works"</span>
                <span className="font-semibold">P&G: 52% vs Comp: 38% <span className="text-[#16A34A]">+14%</span></span>
              </div>
              <div className="flex justify-between">
                <span>✓ "Trusted brand"</span>
                <span className="font-semibold">P&G: 29% vs Comp: 11% <span className="text-[#16A34A]">+18%</span></span>
              </div>
              <div className="flex justify-between">
                <span>✓ "Quality product"</span>
                <span className="font-semibold">P&G: 44% vs Comp: 30% <span className="text-[#16A34A]">+14%</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 - New Entrant Cards */}
      <div>
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
          New Entrant Detection — Listed &lt; 60 days, ≥20 reviews
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border-2 border-[#F59E0B] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-[#F59E0B] text-white text-[10px] font-bold rounded uppercase">
                🆕 New Entrant
              </span>
            </div>
            <h4 className="text-lg font-bold text-[#1A1A2E] mb-2">BritePH Fabric Softener</h4>
            <div className="space-y-1 mb-4">
              <div className="text-sm">★ 4.82 avg</div>
              <div className="text-sm text-[#64748B]">829 reviews · 38 days</div>
              <div className="text-xs text-[#64748B]">Listed: Apr 25, 2024</div>
              <div className="text-xs text-[#64748B]">Category: Fabric Enhancer</div>
            </div>
            <div className="mb-4">
              <div className="text-xs font-medium text-[#64748B] mb-2">Early signals:</div>
              <div className="flex flex-wrap gap-2">
                {["bango", "sulit", "mura"].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[#E8F0FC] text-[#003DA5] rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-sm font-medium text-[#003DA5] hover:underline">
              [Monitor Brand →]
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-[#F59E0B] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-[#F59E0B] text-white text-[10px] font-bold rounded uppercase">
                🆕 New Entrant
              </span>
            </div>
            <h4 className="text-lg font-bold text-[#1A1A2E] mb-2">OxyWash Laundry Powder</h4>
            <div className="space-y-1 mb-4">
              <div className="text-sm">★ 4.71 avg</div>
              <div className="text-sm text-[#64748B]">689 reviews · 45 days</div>
              <div className="text-xs text-[#64748B]">Listed: Apr 18, 2024</div>
              <div className="text-xs text-[#64748B]">Category: Laundry Detergent</div>
            </div>
            <div className="mb-4">
              <div className="text-xs font-medium text-[#64748B] mb-2">Early signals:</div>
              <div className="flex flex-wrap gap-2">
                {["malakas", "white", "puti"].map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[#E8F0FC] text-[#003DA5] rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-sm font-medium text-[#003DA5] hover:underline">
              [Monitor Brand →]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
