const issues = [
  {
    rank: 1,
    severity: "HIGH",
    color: "#DA291C",
    icon: "🔴",
    brand: "Downy",
    issue: "Scent complaints",
    volume: 47,
    score: 141,
    owner: "R&D",
    reviewText: "masyadong malakas ang amoy, hindi ko type yung bango",
    isNew: false,
  },
  {
    rank: 2,
    severity: "HIGH",
    color: "#DA291C",
    icon: "🔴",
    brand: "Ariel",
    issue: "Packaging leaks",
    volume: 31,
    score: 93,
    owner: "Supply",
    reviewText: "natanggap ko na may leak, butas yung pakete",
    isNew: false,
  },
  {
    rank: 3,
    severity: "MED",
    color: "#F59E0B",
    icon: "🟡",
    brand: "Tide",
    issue: "Texture/consistency",
    volume: 28,
    score: 56,
    owner: "R&D",
    reviewText: "malapot, hindi natutunaw agad sa tubig",
    isNew: false,
  },
  {
    rank: 4,
    severity: "MED",
    color: "#F59E0B",
    icon: "🟡",
    brand: "Breeze",
    issue: "Price/value perception",
    volume: 22,
    score: 44,
    owner: "Marketing",
    reviewText: "mahal na ngayon, hindi na sulit",
    isNew: false,
  },
  {
    rank: 5,
    severity: "LOW",
    color: "#0057C8",
    icon: "🔵",
    brand: "Downy",
    issue: "Stock availability",
    volume: 18,
    score: 18,
    owner: "Supply",
    reviewText: "wala sa tindahan, out of stock palagi",
    isNew: false,
  },
];

export function IssuePriorityQueue() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">Issue Priority Queue</h3>
      <p className="text-sm text-[#64748B] mb-4">Ranked by Urgency Score = Severity × Volume</p>

      {/* Issues List */}
      <div className="space-y-3">
        {issues.map((issue) => (
          <div
            key={issue.rank}
            className="relative bg-white border border-[#E2E8F0] rounded-lg p-4 hover:bg-[#F4F6FA] transition-colors"
          >
            {/* Accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: issue.color }}
            ></div>

            {/* Content */}
            <div className="flex items-start gap-3 ml-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#64748B]">#{issue.rank}</span>
                <span className="text-lg">{issue.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#1A1A2E] text-sm">{issue.brand}</span>
                  <span className="text-sm text-[#64748B]">—</span>
                  <span className="text-sm text-[#1A1A2E]">{issue.issue}</span>
                  {issue.isNew && (
                    <span className="px-2 py-0.5 bg-[#16A34A] text-white text-[10px] font-bold rounded uppercase">
                      New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-[#64748B] mb-2">
                  <span>
                    Severity: <span className="font-medium" style={{ color: issue.color }}>{issue.severity}</span>
                  </span>
                  <span>Vol: {issue.volume}</span>
                  <span>Score: {issue.score}</span>
                  <span>Owner: {issue.owner}</span>
                </div>
                <p className="text-sm text-[#64748B] italic mb-3">"{issue.reviewText}"</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[#F4F6FA] text-[#1A1A2E] rounded-md text-xs font-medium hover:bg-[#E2E8F0] transition-colors">
                    View Reviews
                  </button>
                  <button className="px-3 py-1.5 bg-[#003DA5] text-white rounded-md text-xs font-medium hover:bg-[#0057C8] transition-colors">
                    Generate Brief →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
