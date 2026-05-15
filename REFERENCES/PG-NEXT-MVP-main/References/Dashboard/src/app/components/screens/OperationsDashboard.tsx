import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

export function OperationsDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Operations Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">
            SRE Monitoring · PG Next Platform Health
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-700">All Systems ● Operational</span>
        </div>
      </div>

      {/* Row 1 - System Health KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            API Latency (p95)
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
            <span className="text-2xl font-bold text-[#1A1A2E]">1.24s</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">● Healthy</div>
          <div className="text-xs text-[#94A3B8]">p50: 0.34s</div>
          <div className="text-xs text-[#94A3B8]">p99: 3.12s</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            Pipeline Success
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
            <span className="text-2xl font-bold text-[#1A1A2E]">98.7%</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">● Healthy</div>
          <div className="text-xs text-[#94A3B8]">Target: ≥95%</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            Error Rate
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
            <span className="text-2xl font-bold text-[#1A1A2E]">0.14%</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">● Healthy</div>
          <div className="text-xs text-[#94A3B8]">Target: &lt;2%</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            Data Freshness
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
            <span className="text-2xl font-bold text-[#1A1A2E]">18 min</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">● Fresh (&lt; 1hr)</div>
          <div className="text-xs text-[#94A3B8]">SLA: 1hr</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
            AI Classification
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
            <span className="text-2xl font-bold text-[#1A1A2E]">0.91</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">● Healthy</div>
          <div className="text-xs text-[#94A3B8]">Confidence</div>
          <div className="text-xs text-[#94A3B8]">Uncateg: 3.2%</div>
        </div>
      </div>

      {/* Row 2 - Monitoring Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-2">Record Count Variance</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            <span className="text-lg font-bold text-[#1A1A2E]">+8.3%</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">vs 7-day avg</div>
          <div className="text-xs text-[#16A34A]">● Normal (±20% thresh)</div>
          <div className="text-xs text-[#94A3B8] mt-2">Last check: 12:00 PM</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-2">Null Rate Monitor</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            <span className="text-lg font-bold text-[#1A1A2E]">0.23%</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">null values detected</div>
          <div className="text-xs text-[#16A34A]">● Healthy (&lt;5% flag)</div>
          <div className="text-xs text-[#94A3B8] mt-2">Last check: 12:00 PM</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-2">Duplicate Rate</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            <span className="text-lg font-bold text-[#1A1A2E]">0.04%</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">duplicate records</div>
          <div className="text-xs text-[#16A34A]">● Healthy (&lt;1% flag)</div>
          <div className="text-xs text-[#94A3B8] mt-2">Last check: 12:00 PM</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-2">Schema Drift</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            <span className="text-lg font-bold text-[#1A1A2E]">No drift</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">detected</div>
          <div className="text-xs text-[#16A34A]">● Healthy</div>
          <div className="text-xs text-[#94A3B8] mt-2">Last check: 08:00 AM</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-2">Token Usage</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            <span className="text-lg font-bold text-[#1A1A2E]">142K</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">tokens/100 req</div>
          <div className="text-xs text-[#16A34A]">● Normal (25% thresh)</div>
          <div className="text-xs text-[#94A3B8] mt-2">↑+11% vs 14-day avg</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="text-sm font-semibold text-[#1A1A2E] mb-2">Dashboard Availability</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
            <span className="text-lg font-bold text-[#1A1A2E]">99.87%</span>
          </div>
          <div className="text-xs text-[#64748B] mb-1">uptime</div>
          <div className="text-xs text-[#16A34A]">● Healthy (&gt;99.5% SLA)</div>
          <div className="text-xs text-[#94A3B8] mt-2">30-day window</div>
        </div>
      </div>

      {/* Row 3 - Incident Command + Self-Healing Log */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Incident Command Panel</h3>

          <div className="mb-4">
            <div className="text-sm font-medium text-[#64748B] mb-3">OPEN INCIDENTS (1)</div>

            <div className="border-2 border-[#DA291C] rounded-lg p-4 bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-[#DA291C] text-white text-xs font-bold rounded">🔴 P1</span>
                <span className="font-semibold text-[#1A1A2E]">Downy sentiment spike alert</span>
              </div>
              <div className="space-y-1 text-xs text-[#64748B] mb-3">
                <div><span className="font-medium">Service:</span> Sentiment classifier</div>
                <div><span className="font-medium">Start:</span> Today 07:22 AM</div>
                <div><span className="font-medium">Owner:</span> @data-eng-team</div>
                <div><span className="font-medium">Status:</span> <span className="text-[#DA291C] font-semibold">Investigating</span></div>
                <div><span className="font-medium">Workaround:</span> Last stable model serving</div>
                <div><span className="font-medium">Target recovery:</span> 30 min</div>
              </div>
              <button className="text-sm font-medium text-[#003DA5] hover:underline">
                [View Runbook →]
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Self-Healing Action Log</h3>

          <div className="text-sm font-medium text-[#64748B] mb-3">LAST 24H</div>

          <div className="space-y-3">
            <div className="border-l-4 border-[#16A34A] pl-3">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="w-3 h-3 text-[#64748B]" />
                <span className="text-xs text-[#64748B]">09:14</span>
                <span className="text-xs font-semibold text-[#1A1A2E]">Retry triggered</span>
              </div>
              <p className="text-xs text-[#64748B] mb-1">Lazada API timeout</p>
              <p className="text-xs text-[#1A1A2E]">Action: Auto-retry (attempt 2/3). Success.</p>
            </div>

            <div className="border-l-4 border-[#16A34A] pl-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-3 h-3 text-[#16A34A]" />
                <span className="text-xs text-[#64748B]">08:47</span>
                <span className="text-xs font-semibold text-[#1A1A2E]">Worker restart</span>
              </div>
              <p className="text-xs text-[#64748B] mb-1">Classifier job hung</p>
              <p className="text-xs text-[#1A1A2E]">Action: Auto-restart. 0 data loss.</p>
            </div>

            <div className="border-l-4 border-[#16A34A] pl-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-3 h-3 text-[#16A34A]" />
                <span className="text-xs text-[#64748B]">06:15</span>
                <span className="text-xs font-semibold text-[#1A1A2E]">Fallback activated</span>
              </div>
              <p className="text-xs text-[#64748B] mb-1">Source file delay</p>
              <p className="text-xs text-[#1A1A2E]">Action: Prior-day dataset served.</p>
              <p className="text-xs text-[#64748B]">Trigger: Freshness SLA breach warning.</p>
            </div>

            <div className="border-l-4 border-[#F59E0B] pl-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                <span className="text-xs text-[#64748B]">Yesterday 22:10</span>
                <span className="text-xs font-semibold text-[#1A1A2E]">Quarantine routing</span>
              </div>
              <p className="text-xs text-[#1A1A2E]">Action: 1 duplicate record quarantined.</p>
              <p className="text-xs text-[#64748B]">Primary key hash collision detected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
