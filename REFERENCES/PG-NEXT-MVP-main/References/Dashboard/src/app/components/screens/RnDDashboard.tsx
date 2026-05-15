import { Beaker, Users, CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from "recharts";

const innovationPipeline = [
  { stage: "Ideation", count: 24, avgDays: 15 },
  { stage: "Concept", count: 12, avgDays: 30 },
  { stage: "Formulation", count: 8, avgDays: 60 },
  { stage: "Testing", count: 5, avgDays: 45 },
  { stage: "Validation", count: 3, avgDays: 30 },
  { stage: "Launch Ready", count: 2, avgDays: 20 },
];

const consumerTesting = [
  { month: "Jan", satisfaction: 72, performance: 68, value: 65 },
  { month: "Feb", satisfaction: 75, performance: 71, value: 68 },
  { month: "Mar", satisfaction: 78, performance: 74, value: 72 },
  { month: "Apr", satisfaction: 82, performance: 78, value: 75 },
  { month: "May", satisfaction: 85, performance: 82, value: 79 },
  { month: "Jun", satisfaction: 88, performance: 85, value: 82 },
];

const formulaPerformance = [
  { name: "Ultra Clean F-2401", efficacy: 92, cost: 45, stability: 88, z: 850 },
  { name: "Gentle Care F-2402", efficacy: 85, cost: 38, stability: 95, z: 720 },
  { name: "Power Fresh F-2403", efficacy: 95, cost: 52, stability: 82, z: 920 },
  { name: "Eco-Safe F-2404", efficacy: 78, cost: 32, stability: 90, z: 650 },
  { name: "Premium Plus F-2405", efficacy: 98, cost: 68, stability: 85, z: 980 },
];

const activeProjects = [
  { name: "Next-Gen Enzyme Technology", lead: "Dr. Santos", phase: "Testing", completion: 75, priority: "high" },
  { name: "Sustainable Packaging Initiative", lead: "Eng. Cruz", phase: "Formulation", completion: 45, priority: "medium" },
  { name: "Allergen-Free Formula Line", lead: "Dr. Reyes", phase: "Validation", completion: 85, priority: "high" },
  { name: "Cold Water Detergent Enhancement", lead: "Dr. Lim", phase: "Concept", completion: 30, priority: "medium" },
  { name: "Fragrance Innovation Program", lead: "Chem. Garcia", phase: "Testing", completion: 60, priority: "low" },
];

export function RnDDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Innovation Pipeline</h1>
          <p className="text-sm text-[#64748B] mt-1">R&D projects and product development tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1A1A2E] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
            Export Data
          </button>
          <button className="px-4 py-2 bg-[#003DA5] text-white rounded-lg hover:bg-[#0057C8] transition-colors text-sm font-medium">
            New Project
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#EDE9FE] rounded-lg flex items-center justify-center">
              <Beaker className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div className="text-xs font-medium text-[#64748B]">Active</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">54</div>
          <div className="text-xs text-[#64748B] font-medium">Total Projects</div>
          <div className="text-xs text-[#94A3B8] mt-1">Across all stages</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-xs font-medium text-[#10B981]">+2 this month</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">8</div>
          <div className="text-xs text-[#64748B] font-medium">Launch Ready</div>
          <div className="text-xs text-[#94A3B8] mt-1">Completed testing</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-xs font-medium text-[#64748B]">Avg cycle</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">180</div>
          <div className="text-xs text-[#64748B] font-medium">Days to Market</div>
          <div className="text-xs text-[#94A3B8] mt-1">From concept to launch</div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div className="text-xs font-medium text-[#10B981]">+5% vs target</div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A2E] mb-1">88%</div>
          <div className="text-xs text-[#64748B] font-medium">Success Rate</div>
          <div className="text-xs text-[#94A3B8] mt-1">Testing validation</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Innovation Pipeline Stage */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-[#1A1A2E]">Pipeline by Stage</h3>
            <p className="text-xs text-[#64748B] mt-1">Project distribution across development phases</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={innovationPipeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748B' }} angle={-15} textAnchor="end" height={60} />
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
              <Bar dataKey="count" fill="#003DA5" radius={[4, 4, 0, 0]} name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Consumer Testing Scores */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-[#1A1A2E]">Consumer Testing Scores</h3>
            <p className="text-xs text-[#64748B] mt-1">Product performance metrics from consumer panels</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={consumerTesting}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} domain={[60, 90]} />
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
              <Line type="monotone" dataKey="satisfaction" stroke="#10B981" strokeWidth={2} name="Satisfaction" />
              <Line type="monotone" dataKey="performance" stroke="#003DA5" strokeWidth={2} name="Performance" />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} name="Value Perception" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Formula Performance Matrix */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
        <div className="mb-5">
          <h3 className="text-base font-bold text-[#1A1A2E]">Formula Performance Matrix</h3>
          <p className="text-xs text-[#64748B] mt-1">Efficacy vs Cost analysis (bubble size = market potential)</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="cost" 
              name="Cost Index" 
              tick={{ fontSize: 12, fill: '#64748B' }}
              label={{ value: 'Cost Index', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#64748B' }}
            />
            <YAxis 
              dataKey="efficacy" 
              name="Efficacy %" 
              tick={{ fontSize: 12, fill: '#64748B' }}
              label={{ value: 'Efficacy %', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748B' }}
            />
            <ZAxis dataKey="z" range={[100, 1000]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '12px',
                padding: '8px 12px'
              }}
            />
            <Scatter name="Formulas" data={formulaPerformance} fill="#003DA5" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Active Projects Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0]">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h3 className="text-base font-bold text-[#1A1A2E]">Active R&D Projects</h3>
          <p className="text-xs text-[#64748B] mt-1">Current development projects and progress tracking</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Project Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Lead Scientist</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Phase</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Completion</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {activeProjects.map((project, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#1A1A2E]">{project.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#003DA5] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{project.lead.split(' ')[1][0]}{project.lead.split(' ')[0][0]}</span>
                      </div>
                      <span className="text-sm text-[#1A1A2E]">{project.lead}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8F0FC] text-[#003DA5] border border-[#C7D9F8]">
                      {project.phase}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#64748B]">{project.completion}%</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            project.completion >= 75 ? 'bg-[#10B981]' : 
                            project.completion >= 50 ? 'bg-[#F59E0B]' : 
                            'bg-[#3B82F6]'
                          }`}
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {project.priority === 'high' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA]">
                        <AlertCircle className="w-3 h-3" />
                        High
                      </span>
                    )}
                    {project.priority === 'medium' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#F59E0B] border border-[#FDE68A]">
                        Medium
                      </span>
                    )}
                    {project.priority === 'low' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E2E8F0] text-[#64748B] border border-[#CBD5E1]">
                        Low
                      </span>
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
