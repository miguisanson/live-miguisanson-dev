import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const complaintData = [
  { category: "Scent", reviews: 312, avgRating: 3.41, color: "#DA291C", severity: "🔴" },
  { category: "Texture/Consistency", reviews: 178, avgRating: 3.68, color: "#F59E0B", severity: "🟡" },
  { category: "Performance", reviews: 156, avgRating: 3.54, color: "#F59E0B", severity: "🟡" },
  { category: "Packaging/Usability", reviews: 98, avgRating: 3.72, color: "#F59E0B", severity: "🟡" },
  { category: "Formulation", reviews: 87, avgRating: 3.21, color: "#DA291C", severity: "🔴" },
  { category: "Durability/Longevity", reviews: 64, avgRating: 3.89, color: "#0057C8", severity: "🔵" },
];

export function RnDDeepDive() {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">R&D Deep Dive</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Product-specific insights · P&G Fabric Care Portfolio
        </p>
      </div>

      {/* Row 1 - Product Complaint Taxonomy */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">
          Product Complaint Taxonomy — P&G Fabric Care
        </h3>
        <p className="text-sm text-[#64748B] mb-4">Keyword-classified review issues</p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={complaintData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis dataKey="category" type="category" tick={{ fill: "#1A1A2E", fontSize: 12 }} width={140} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: any, name: string, props: any) => {
                if (name === "reviews") {
                  return [`${value} reviews (Avg: ${props.payload.avgRating}★)`, "Volume"];
                }
                return [value, name];
              }}
            />
            <Bar dataKey="reviews" radius={[0, 8, 8, 0]}>
              {complaintData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center gap-2 p-3 bg-[#F4F6FA] rounded-lg">
          <span className="text-lg">🔇</span>
          <span className="text-xs text-[#64748B]">
            <strong>Noise Separated:</strong> 1,847 courier/seller reviews excluded from this analysis.
          </span>
        </div>
      </div>

      {/* Row 2 - Unmet Needs Detector + Repeat Complaint Tracker */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">Unmet Needs Detector</h3>
          <p className="text-sm text-[#64748B] mb-4">"I wish / Sana / Kung may" patterns</p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-2 text-[#64748B] font-medium text-xs">Rank</th>
                <th className="text-left py-2 text-[#64748B] font-medium text-xs">Theme</th>
                <th className="text-left py-2 text-[#64748B] font-medium text-xs">Products</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-xs">Mentions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-bold text-[#003DA5]">#1</td>
                <td>
                  <div className="font-medium">"Sana may mas mura"</div>
                  <div className="text-xs text-[#64748B] italic">(Wish it were cheaper)</div>
                </td>
                <td className="text-xs">Multiple</td>
                <td className="text-right font-semibold">147</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-bold text-[#003DA5]">#2</td>
                <td>
                  <div className="font-medium">"I wish longer-lasting scent"</div>
                </td>
                <td className="text-xs">Downy</td>
                <td className="text-right font-semibold">89</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-bold text-[#003DA5]">#3</td>
                <td>
                  <div className="font-medium">"Kung may refill pack"</div>
                </td>
                <td className="text-xs">Ariel</td>
                <td className="text-right font-semibold">72</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-bold text-[#003DA5]">#4</td>
                <td>
                  <div className="font-medium">"Sana pH-balanced formula"</div>
                </td>
                <td className="text-xs">Breeze</td>
                <td className="text-right font-semibold">54</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-[#003DA5]">#5</td>
                <td>
                  <div className="font-medium">"I wish Hindi malagkit"</div>
                </td>
                <td className="text-xs">Downy</td>
                <td className="text-right font-semibold">43</td>
              </tr>
            </tbody>
          </table>

          <button className="mt-4 text-sm font-medium text-[#003DA5] hover:underline">
            [Generate Product Brief from #1 →]
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">Repeat Complaint Tracker</h3>
          <p className="text-sm text-[#64748B] mb-4">Issues unresolved across 3+ months</p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-2 text-[#64748B] font-medium text-xs">Theme</th>
                <th className="text-left py-2 text-[#64748B] font-medium text-xs">First Seen</th>
                <th className="text-center py-2 text-[#64748B] font-medium text-xs">Still Active</th>
                <th className="text-right py-2 text-[#64748B] font-medium text-xs">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-medium">Scent (Downy)</td>
                <td className="text-xs">Feb 2023</td>
                <td className="text-center">
                  <span className="px-2 py-1 bg-red-100 text-[#DA291C] rounded text-xs font-bold">✗ YES</span>
                </td>
                <td className="text-right font-semibold text-[#DA291C]">15 mo 🔴</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-medium">Pump issues</td>
                <td className="text-xs">Mar 2023</td>
                <td className="text-center">
                  <span className="px-2 py-1 bg-red-100 text-[#DA291C] rounded text-xs font-bold">✗ YES</span>
                </td>
                <td className="text-right font-semibold text-[#DA291C]">14 mo 🔴</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-medium">Packet leak</td>
                <td className="text-xs">Jun 2023</td>
                <td className="text-center">
                  <span className="px-2 py-1 bg-amber-100 text-[#F59E0B] rounded text-xs font-bold">✗ YES</span>
                </td>
                <td className="text-right font-semibold text-[#F59E0B]">11 mo 🟡</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-3 font-medium">Texture (Tide)</td>
                <td className="text-xs">Aug 2023</td>
                <td className="text-center">
                  <span className="px-2 py-1 bg-amber-100 text-[#F59E0B] rounded text-xs font-bold">✗ YES</span>
                </td>
                <td className="text-right font-semibold text-[#F59E0B]">9 mo 🟡</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Price concern</td>
                <td className="text-xs">Oct 2023</td>
                <td className="text-center">
                  <span className="px-2 py-1 bg-blue-100 text-[#0057C8] rounded text-xs font-bold">✗ YES</span>
                </td>
                <td className="text-right font-semibold text-[#0057C8]">7 mo 🔵</td>
              </tr>
            </tbody>
          </table>

          <button className="mt-4 text-sm font-medium text-[#003DA5] hover:underline">
            [Create R&D Ticket →]
          </button>
        </div>
      </div>
    </div>
  );
}
