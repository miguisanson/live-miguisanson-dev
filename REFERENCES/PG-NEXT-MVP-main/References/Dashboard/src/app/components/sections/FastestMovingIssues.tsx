import { TrendingUp, TrendingDown } from "lucide-react";

const issues = [
  {
    title: "Scent complaint (Downy)",
    change: "+127%",
    mentions: 238,
    direction: "up",
    barWidth: 100,
  },
  {
    title: "Dispenser/pump issues",
    change: "+89%",
    mentions: 156,
    direction: "up",
    barWidth: 75,
  },
  {
    title: "Reorder/out-of-stock",
    change: "+64%",
    mentions: 98,
    direction: "up",
    barWidth: 50,
  },
  {
    title: "Packaging damage",
    change: "-31%",
    mentions: 72,
    direction: "down",
    barWidth: 25,
  },
  {
    title: "Price complaints",
    change: "-18%",
    mentions: 64,
    direction: "down",
    barWidth: 19,
  },
];

export function FastestMovingIssues() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">Fastest-Moving Issues</h3>
      <p className="text-sm text-[#64748B] mb-4">New themes gaining volume this week vs last</p>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.map((issue, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-2 mb-2">
              {issue.direction === "up" ? (
                <TrendingUp className="w-4 h-4 text-[#DA291C]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#16A34A]" />
              )}
              <span className="text-sm font-medium text-[#1A1A2E]">{issue.title}</span>
            </div>
            <div className="mb-1">
              <div
                className={`h-6 rounded ${issue.direction === "up" ? "bg-[#DA291C]" : "bg-[#16A34A]"}`}
                style={{ width: `${issue.barWidth}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-semibold ${issue.direction === "up" ? "text-[#DA291C]" : "text-[#16A34A]"}`}
              >
                {issue.change} WoW
              </span>
              <span className="text-[#64748B]">[{issue.mentions} mentions]</span>
            </div>
            {issue.direction === "down" && (
              <p className="text-xs text-[#16A34A] mt-1">(improving)</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
