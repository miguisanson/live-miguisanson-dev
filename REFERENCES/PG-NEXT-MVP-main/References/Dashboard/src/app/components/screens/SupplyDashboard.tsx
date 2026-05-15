import { Package, TrendingUp, Truck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const productionMetrics = [
  { week: "W1", produced: 12500, target: 12000, efficiency: 95 },
  { week: "W2", produced: 13200, target: 12000, efficiency: 97 },
  { week: "W3", produced: 11800, target: 12000, efficiency: 92 },
  { week: "W4", produced: 13500, target: 12000, efficiency: 98 },
  { week: "W5", produced: 12900, target: 12000, efficiency: 96 },
  { week: "W6", produced: 14200, target: 12000, efficiency: 99 },
];

const inventoryLevels = [
  { product: "Ariel", stock: 85, reorder: 30, status: "good" },
  { product: "Downy", stock: 22, reorder: 30, status: "low" },
  { product: "Tide", stock: 92, reorder: 25, status: "good" },
  { product: "Safeguard", stock: 15, reorder: 20, status: "critical" },
  { product: "Pantene", stock: 78, reorder: 30, status: "good" },
  { product: "Head & Shoulders", stock: 68, reorder: 25, status: "good" },
];

const logisticsData = [
  { month: "Jan", onTime: 92, delayed: 6, cancelled: 2 },
  { month: "Feb", onTime: 94, delayed: 5, cancelled: 1 },
  { month: "Mar", onTime: 89, delayed: 9, cancelled: 2 },
  { month: "Apr", onTime: 96, delayed: 3, cancelled: 1 },
  { month: "May", onTime: 95, delayed: 4, cancelled: 1 },
  { month: "Jun", onTime: 97, delayed: 2, cancelled: 1 },
];

const activeShipments = [
  { id: "SHP-2024-1234", product: "Ariel Powder 1kg", destination: "Manila Central", status: "in-transit", eta: "2 hours", progress: 75 },
  { id: "SHP-2024-1235", product: "Downy Fabric Softener", destination: "Cebu Hub", status: "in-transit", eta: "5 hours", progress: 45 },
  { id: "SHP-2024-1236", product: "Tide Liquid Detergent", destination: "Davao Distribution", status: "delayed", eta: "8 hours", progress: 30 },
  { id: "SHP-2024-1237", product: "Safeguard Bar Soap", destination: "Quezon City", status: "delivered", eta: "Completed", progress: 100 },
  { id: "SHP-2024-1238", product: "Pantene Shampoo", destination: "Makati Warehouse", status: "in-transit", eta: "3 hours", progress: 60 },
];

const supplyAlerts = [
  { type: "critical", product: "Safeguard Bar Soap", message: "Stock level below reorder point", time: "15 min ago" },
  { type: "warning", product: "Downy Fabric Softener", message: "Approaching reorder threshold", time: "1 hour ago" },
  { type: "info", product: "Production Line A", message: "Scheduled maintenance tomorrow 2 PM", time: "3 hours ago" },
];

export function SupplyDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Supply Chain Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">Production, inventory, and logistics monitoring</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1A1A2E] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-[#003DA5] text-white rounded-lg hover:bg-[#0057C8] transition-colors text-sm font-medium">
            Create Order
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {supplyAlerts.filter(a => a.type === 'critical').length > 0 && (
        <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-sm text-[#991B1B]">Critical Supply Alert</div>
            <div className="text-sm text-[#7F1D1D] mt-1">
              {supplyAlerts.filter(a => a.type === 'critical').length} product(s) below critical stock levels. Immediate action required.
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-xs font-medium">
            View Details
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div className="text-xs font-medium text-[#10B981]">+8% vs plan</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">13.5K</div>
          <div className="text-xs text-[#64748B] font-medium">Units Produced</div>
          <div className="text-xs text-[#94A3B8] mt-1">This week</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-xs font-medium text-[#10B981]">+2% vs target</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">97%</div>
          <div className="text-xs text-[#64748B] font-medium">Production Efficiency</div>
          <div className="text-xs text-[#94A3B8] mt-1">Overall performance</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div className="text-xs font-medium text-[#EF4444]">Action needed</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">2</div>
          <div className="text-xs text-[#64748B] font-medium">Low Stock Items</div>
          <div className="text-xs text-[#94A3B8] mt-1">Below reorder point</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-xs font-medium text-[#10B981]">96% on-time</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">24</div>
          <div className="text-xs text-[#64748B] font-medium">Active Shipments</div>
          <div className="text-xs text-[#94A3B8] mt-1">In transit today</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Production Performance */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-[#1A1A2E]">Production Performance</h3>
            <p className="text-xs text-[#64748B] mt-1">Weekly output vs targets and efficiency metrics</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={productionMetrics}>
              <defs>
                <linearGradient id="colorProduced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003DA5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#003DA5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748B' }} />
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
              <Area type="monotone" dataKey="produced" stroke="#003DA5" fillOpacity={1} fill="url(#colorProduced)" name="Produced" />
              <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeDasharray="5 5" strokeWidth={2} name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Logistics Performance */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-[#1A1A2E]">Logistics Performance</h3>
            <p className="text-xs text-[#64748B] mt-1">Delivery performance tracking by month</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={logisticsData}>
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
              <Bar dataKey="onTime" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} name="On Time %" />
              <Bar dataKey="delayed" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} name="Delayed %" />
              <Bar dataKey="cancelled" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="Cancelled %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Levels */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
        <div className="mb-5">
          <h3 className="text-base font-bold text-[#1A1A2E]">Current Inventory Levels</h3>
          <p className="text-xs text-[#64748B] mt-1">Stock levels vs reorder points across product lines</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {inventoryLevels.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${
              item.status === 'critical' ? 'bg-[#FEE2E2] border-[#FECACA]' :
              item.status === 'low' ? 'bg-[#FEF3C7] border-[#FDE68A]' :
              'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm text-[#1A1A2E]">{item.product}</div>
                {item.status === 'critical' && <AlertTriangle className="w-4 h-4 text-[#EF4444]" />}
                {item.status === 'low' && <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />}
                {item.status === 'good' && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-2xl font-bold ${
                  item.status === 'critical' ? 'text-[#EF4444]' :
                  item.status === 'low' ? 'text-[#F59E0B]' :
                  'text-[#1A1A2E]'
                }`}>{item.stock}%</span>
                <span className="text-xs text-[#64748B]">stock level</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.status === 'critical' ? 'bg-[#EF4444]' :
                    item.status === 'low' ? 'bg-[#F59E0B]' :
                    'bg-[#10B981]'
                  }`}
                  style={{ width: `${item.stock}%` }}
                ></div>
              </div>
              <div className="text-xs text-[#64748B]">Reorder at: {item.reorder}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Shipments */}
      <div className="bg-white rounded-lg border border-[#E2E8F0]">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h3 className="text-base font-bold text-[#1A1A2E]">Active Shipments</h3>
          <p className="text-xs text-[#64748B] mt-1">Real-time tracking of in-transit deliveries</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Shipment ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Destination</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">ETA</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {activeShipments.map((shipment, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-[#003DA5]">{shipment.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#1A1A2E]">{shipment.product}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#1A1A2E]">{shipment.destination}</div>
                  </td>
                  <td className="px-6 py-4">
                    {shipment.status === 'delivered' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                        <CheckCircle className="w-3 h-3" />
                        Delivered
                      </span>
                    )}
                    {shipment.status === 'in-transit' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#3B82F6] border border-[#BFDBFE]">
                        <Truck className="w-3 h-3" />
                        In Transit
                      </span>
                    )}
                    {shipment.status === 'delayed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA]">
                        <XCircle className="w-3 h-3" />
                        Delayed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#1A1A2E]">{shipment.eta}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E2E8F0] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            shipment.progress === 100 ? 'bg-[#10B981]' : 'bg-[#003DA5]'
                          }`}
                          style={{ width: `${shipment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-[#64748B] w-10 text-right">{shipment.progress}%</span>
                    </div>
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
