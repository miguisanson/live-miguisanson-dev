import { AlertTriangle } from "lucide-react";

export function IntelligenceCommand() {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Intelligence Command Center</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Agentic AI Layer · Last action: 4 minutes ago
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Agent Status: Active</span>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border-2 border-[#DA291C] rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔴</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-[#DA291C] text-sm uppercase tracking-wider">
                ESCALATION ACTIVE
              </span>
              <span className="text-sm text-[#1A1A2E]">
                — Downy Scent Complaint Cluster: 47 verified buyers flagged.
              </span>
            </div>
            <p className="text-sm text-[#64748B] mb-3">
              Revenue at risk: ₱124,300. Agent awaiting approval on retention action.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#DA291C] text-[#DA291C] rounded-lg text-xs font-medium hover:bg-red-50 transition-colors">
                View Full Signal
              </button>
              <button className="px-4 py-2 bg-[#DA291C] text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors">
                Approve Action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1 - Agentic Signal Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Brand Switching Early Warning */}
        <div className="bg-white rounded-xl p-5 border-2 border-[#DA291C] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔴</span>
            <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider">
              BRAND SWITCHING EARLY WARNING
            </h3>
          </div>
          <div className="border-t-2 border-[#E2E8F0] mb-3"></div>
          <p className="text-xs text-[#64748B] mb-3">Verified buyers with rating drop (1–2★) in last 14 days by brand:</p>
          <table className="w-full text-xs mb-3">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-2 text-[#64748B] font-medium">Brand</th>
                <th className="text-right py-2 text-[#64748B] font-medium">Buyers</th>
                <th className="text-right py-2 text-[#64748B] font-medium">Revenue at Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Downy</td>
                <td className="text-right">47</td>
                <td className="text-right">₱124,300</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Breeze</td>
                <td className="text-right">12</td>
                <td className="text-right">₱28,800</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Ariel</td>
                <td className="text-right">9</td>
                <td className="text-right">₱21,600</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium">Tide</td>
                <td className="text-right">6</td>
                <td className="text-right">₱14,400</td>
              </tr>
              <tr className="border-t-2 border-[#1A1A2E] font-bold">
                <td className="py-2">TOTAL</td>
                <td className="text-right">74</td>
                <td className="text-right">₱189,100</td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-xs text-[#DA291C]">
            <AlertTriangle className="w-4 h-4" />
            <span>Downy threshold exceeded (&gt;40 buyers)</span>
          </div>
        </div>

        {/* Share Shift Predictor */}
        <div className="bg-white rounded-xl p-5 border-2 border-[#F59E0B] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🟡</span>
            <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider">
              SHARE SHIFT PREDICTOR
            </h3>
          </div>
          <div className="border-t-2 border-[#E2E8F0] mb-3"></div>
          <p className="text-xs text-[#64748B] mb-3">4-week rolling avg · 2-week window delta</p>
          <table className="w-full text-xs mb-3">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-2 text-[#64748B] font-medium">Brand</th>
                <th className="text-right py-2 text-[#64748B] font-medium">Avg Rating</th>
                <th className="text-right py-2 text-[#64748B] font-medium">Δ 2-Week</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2 font-medium flex items-center gap-1">🔺 Surf</td>
                <td className="text-right">4.96</td>
                <td className="text-right text-[#DA291C] font-bold">+0.24 ⚠️</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2">Mighty Clean</td>
                <td className="text-right">4.93</td>
                <td className="text-right text-[#F59E0B]">+0.18</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2">Champion</td>
                <td className="text-right">4.95</td>
                <td className="text-right text-[#F59E0B]">+0.12</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2">Ariel</td>
                <td className="text-right">4.95</td>
                <td className="text-right text-[#64748B]">+0.02</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2">Breeze</td>
                <td className="text-right">4.97</td>
                <td className="text-right text-[#64748B]">+0.01</td>
              </tr>
              <tr>
                <td className="py-2">Downy</td>
                <td className="text-right">4.94</td>
                <td className="text-right text-[#64748B]">-0.03</td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded text-xs text-[#F59E0B]">
            <AlertTriangle className="w-4 h-4" />
            <span>Surf gaining &gt;+0.2 — market share risk</span>
          </div>
        </div>

        {/* Promo Opportunity Signal */}
        <div className="bg-white rounded-xl p-5 border-2 border-[#16A34A] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🟢</span>
            <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider">
              PROMO OPPORTUNITY SIGNAL
            </h3>
          </div>
          <div className="border-t-2 border-[#E2E8F0] mb-3"></div>
          <p className="text-xs text-[#64748B] mb-3">ARM co-occurrence mining · top pairs</p>
          <table className="w-full text-xs mb-3">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-2 text-[#64748B] font-medium">Brand + Theme Pair</th>
                <th className="text-right py-2 text-[#64748B] font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2">Ariel + Bundle Deal</td>
                <td className="text-right font-medium text-[#16A34A]">87% ✓</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2">Downy + Loyalty Reward</td>
                <td className="text-right font-medium text-[#16A34A]">84% ✓</td>
              </tr>
              <tr className="border-b border-[#E2E8F0]">
                <td className="py-2">Breeze + Sachet Promo</td>
                <td className="text-right font-medium text-[#16A34A]">81% ✓</td>
              </tr>
              <tr>
                <td className="py-2">Tide + Flash Sale</td>
                <td className="text-right font-medium">76%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-[#64748B] mb-3">Threshold: 80% confidence</p>
          <button className="text-xs font-medium text-[#003DA5] hover:underline">
            [Generate Promo Brief →]
          </button>
        </div>
      </div>

      {/* Row 2 - Autonomous Decision Log */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">Autonomous Decision Log</h3>
        <p className="text-sm text-[#64748B] mb-4">Timestamped agent actions — last 24 hours</p>

        <div className="space-y-3">
          {[
            {
              time: "Today 09:14 AM",
              type: "ESCALATION",
              typeColor: "bg-[#DA291C]",
              action: "Downy scent cluster flagged (47 buyers, ₱124K at risk). Retention promo generated. Awaiting approval.",
              status: "AWAITING APPROVAL",
              statusColor: "text-[#DA291C]",
              hasActions: true,
            },
            {
              time: "Today 08:47 AM",
              type: "MODEL REFRESH",
              typeColor: "bg-[#0057C8]",
              action: "Sentiment model refreshed. 1,247 new reviews classified. Avg confidence: 0.91",
              status: "COMPLETE",
              statusColor: "text-[#16A34A]",
              hasActions: false,
            },
            {
              time: "Today 07:30 AM",
              type: "INGESTION",
              typeColor: "bg-[#16A34A]",
              action: "Batch ingested: 3,412 records from Lazada PH. 0 schema errors.",
              status: "COMPLETE",
              statusColor: "text-[#16A34A]",
              hasActions: false,
            },
            {
              time: "Today 06:15 AM",
              type: "ARM RECOMPUTE",
              typeColor: "bg-[#0057C8]",
              action: "Association rule mining complete. 14 brand-theme pairs updated.",
              status: "COMPLETE",
              statusColor: "text-[#16A34A]",
              hasActions: false,
            },
          ].map((log, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${idx % 2 === 0 ? "bg-[#F4F6FA]" : "bg-white"} border border-[#E2E8F0]`}>
              <div className="grid grid-cols-[180px_120px_1fr_120px] gap-4 items-start">
                <div className="text-xs text-[#64748B]">{log.time}</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${log.typeColor}`}></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">{log.type}</span>
                </div>
                <div className="text-sm text-[#1A1A2E]">
                  {log.action}
                  {log.hasActions && (
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-[#16A34A] text-white rounded text-xs font-medium hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-[#F59E0B] text-white rounded text-xs font-medium hover:bg-amber-600">
                        Modify
                      </button>
                      <button className="px-3 py-1 bg-[#DA291C] text-white rounded text-xs font-medium hover:bg-red-700">
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
                <div className={`text-xs font-bold ${log.statusColor}`}>
                  {log.status === "COMPLETE" ? "✅ " : "🔴 "}
                  {log.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 - Recommended Action Widget */}
      <div className="bg-[#EFF6FF] border-2 border-[#003DA5] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🤖</span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#003DA5] uppercase tracking-wider">RECOMMENDED ACTION</span>
            <span className="text-sm text-[#64748B]">·</span>
            <span className="text-sm text-[#64748B]">Agent Confidence: <span className="font-bold text-[#16A34A]">91%</span></span>
          </div>
        </div>

        <p className="text-sm font-semibold text-[#1A1A2E] mb-2">
          Generate retention promo for Downy verified buyers showing scent complaints
        </p>
        <p className="text-xs text-[#64748B] mb-4">
          Based on: 47 flagged buyers · Scent complaint cluster active · Rejoice bundle signal active
        </p>

        <div className="bg-white border border-[#003DA5] rounded-lg p-4 mb-4">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-3">Action Preview:</div>
          <p className="text-sm text-[#64748B] mb-4">
            "Dear valued Downy customer — enjoy an exclusive ₱50 off your next Downy 900ml purchase. Valid for 7 days. Redemption via Lazada voucher."
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#64748B]">Estimated reach:</span>{" "}
              <span className="font-semibold text-[#1A1A2E]">47 buyers</span>
            </div>
            <div>
              <span className="text-[#64748B]">Estimated recovery:</span>{" "}
              <span className="font-semibold text-[#16A34A]">₱94,300 (76% of at-risk value)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-3 bg-[#16A34A] text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
            ✓ Approve and Generate
          </button>
          <button className="px-6 py-3 bg-white border border-[#003DA5] text-[#003DA5] rounded-lg text-sm font-medium hover:bg-[#E8F0FC] transition-colors flex items-center gap-2">
            ✏️ Modify Parameters
          </button>
          <button className="px-6 py-3 bg-white border border-[#DA291C] text-[#DA291C] rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
            ✗ Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
