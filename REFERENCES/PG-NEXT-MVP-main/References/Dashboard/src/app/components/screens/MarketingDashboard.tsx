import { TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const campaignPerformance = [
  { month: "Jan", awareness: 62, consideration: 48, conversion: 12, spend: 450 },
  { month: "Feb", awareness: 68, consideration: 52, conversion: 15, spend: 480 },
  { month: "Mar", awareness: 72, consideration: 58, conversion: 18, spend: 520 },
  { month: "Apr", awareness: 78, consideration: 64, conversion: 22, spend: 550 },
  { month: "May", awareness: 82, consideration: 68, conversion: 25, spend: 580 },
  { month: "Jun", awareness: 85, consideration: 72, conversion: 28, spend: 600 },
];

const channelROI = [
  { channel: "TV", roi: 4.2, spend: 2500, reach: 8500 },
  { channel: "Digital", roi: 5.8, spend: 1800, reach: 12000 },
  { channel: "Social", roi: 6.5, spend: 1200, reach: 15000 },
  { channel: "OOH", roi: 3.1, spend: 800, reach: 5000 },
  { channel: "Print", roi: 2.4, spend: 600, reach: 3000 },
];

const activeCampaigns = [
  { name: "Ariel Summer Clean", status: "Active", budget: 2.5, spent: 1.8, performance: 112, trend: "up" },
  { name: "Downy Fresh Launch", status: "Active", budget: 1.8, spent: 1.2, performance: 98, trend: "down" },
  { name: "Tide Pods Promo", status: "Planning", budget: 3.2, spent: 0, performance: 0, trend: "neutral" },
  { name: "Safeguard Back-to-School", status: "Active", budget: 1.5, spent: 1.1, performance: 105, trend: "up" },
];

export function MarketingDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Campaign Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">Marketing performance and campaign metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1A1A2E] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
            Download Report
          </button>
          <button className="px-4 py-2 bg-[#003DA5] text-white rounded-lg hover:bg-[#0057C8] transition-colors text-sm font-medium">
            New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#E8F0FC] rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#003DA5]" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#10B981]">
              <ArrowUp className="w-3 h-3" />
              <span>12%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">₱8.2M</div>
          <div className="text-xs text-[#64748B] font-medium">Total Ad Spend</div>
          <div className="text-xs text-[#94A3B8] mt-1">This quarter</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#10B981]">
              <ArrowUp className="w-3 h-3" />
              <span>8%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">4.8x</div>
          <div className="text-xs text-[#64748B] font-medium">Average ROI</div>
          <div className="text-xs text-[#94A3B8] mt-1">Across all channels</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#10B981]">
              <ArrowUp className="w-3 h-3" />
              <span>15%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">12.5M</div>
          <div className="text-xs text-[#64748B] font-medium">Total Reach</div>
          <div className="text-xs text-[#94A3B8] mt-1">Unique users</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#EF4444]">
              <ArrowDown className="w-3 h-3" />
              <span>3%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">28%</div>
          <div className="text-xs text-[#64748B] font-medium">Conversion Rate</div>
          <div className="text-xs text-[#94A3B8] mt-1">Awareness to purchase</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Campaign Funnel Performance */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-[#1A1A2E]">Campaign Funnel Performance</h3>
            <p className="text-xs text-[#64748B] mt-1">Consumer journey metrics over time</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="awareness" stroke="#003DA5" strokeWidth={2} name="Awareness %" />
              <Line type="monotone" dataKey="consideration" stroke="#10B981" strokeWidth={2} name="Consideration %" />
              <Line type="monotone" dataKey="conversion" stroke="#F59E0B" strokeWidth={2} name="Conversion %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channel ROI */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-[#1A1A2E]">Channel ROI Analysis</h3>
            <p className="text-xs text-[#64748B] mt-1">Return on investment by media channel</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={channelROI} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis dataKey="channel" type="category" tick={{ fontSize: 12, fill: '#64748B' }} width={60} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
              />
              <Bar dataKey="roi" fill="#003DA5" radius={[0, 4, 4, 0]} name="ROI (x)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0]">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h3 className="text-base font-bold text-[#1A1A2E]">Active Campaigns</h3>
          <p className="text-xs text-[#64748B] mt-1">Current campaign performance and budget tracking</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Campaign</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Budget</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Spent</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Performance</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {activeCampaigns.map((campaign, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#1A1A2E]">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'Active' 
                        ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]' 
                        : 'bg-[#FEF3C7] text-[#F59E0B] border border-[#FDE68A]'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-[#1A1A2E]">₱{campaign.budget}M</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-[#1A1A2E]">₱{campaign.spent}M</div>
                    <div className="text-xs text-[#64748B]">{Math.round((campaign.spent / campaign.budget) * 100)}% used</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`text-sm font-bold ${
                      campaign.performance >= 100 ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}>
                      {campaign.performance}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {campaign.trend === 'up' && (
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-[#ECFDF5] rounded-lg">
                        <ArrowUp className="w-4 h-4 text-[#10B981]" />
                      </div>
                    )}
                    {campaign.trend === 'down' && (
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-[#FEE2E2] rounded-lg">
                        <ArrowDown className="w-4 h-4 text-[#EF4444]" />
                      </div>
                    )}
                    {campaign.trend === 'neutral' && (
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-[#F1F5F9] rounded-lg">
                        <div className="w-3 h-0.5 bg-[#94A3B8]"></div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
