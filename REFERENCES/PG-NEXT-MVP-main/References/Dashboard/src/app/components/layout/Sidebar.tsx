import { NavLink } from "react-router";
import { LayoutGrid, Brain, Target, Beaker, TrendingUp, Package, Users, Database, BookOpen, HelpCircle } from "lucide-react";
import { useState } from "react";

const roleNavItems = {
  brand: [
    { icon: LayoutGrid, label: "Brand Overview", path: "/" },
    { icon: Brain, label: "Intelligence Command", path: "/intelligence" },
    { icon: Target, label: "Competitor Intel", path: "/competitor" },
    { icon: Beaker, label: "R&D Deep Dive", path: "/rnd" },
    { icon: Package, label: "Operations", path: "/operations" },
  ],
  marketing: [
    { icon: TrendingUp, label: "Campaign Dashboard", path: "/marketing" },
    { icon: Users, label: "Consumer Insights", path: "/marketing/insights" },
    { icon: Target, label: "Media Performance", path: "/marketing/media" },
    { icon: Brain, label: "Brand Health", path: "/marketing/health" },
  ],
  rnd: [
    { icon: Beaker, label: "Innovation Pipeline", path: "/rnd" },
    { icon: Brain, label: "Consumer Testing", path: "/rnd/testing" },
    { icon: Database, label: "Formula Library", path: "/rnd/formulas" },
    { icon: Target, label: "Market Gaps", path: "/rnd/gaps" },
  ],
  supply: [
    { icon: Package, label: "Supply Chain", path: "/supply" },
    { icon: TrendingUp, label: "Production Metrics", path: "/supply/production" },
    { icon: Database, label: "Inventory", path: "/supply/inventory" },
    { icon: LayoutGrid, label: "Logistics", path: "/supply/logistics" },
  ],
};

const workspaceItems = [
  { icon: Database, label: "Data Sources", path: "/data" },
  { icon: BookOpen, label: "Documentation", path: "/docs" },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<keyof typeof roleNavItems>("brand");

  const currentNavItems = roleNavItems[selectedRole];

  return (
    <aside 
      className={`bg-[#0A1628] fixed top-[60px] bottom-0 left-0 flex flex-col transition-all duration-300 z-40 ${
        isExpanded ? "w-[240px]" : "w-[64px]"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Role Selector */}
      <div className="p-3 border-b border-white/10">
        <div className="flex flex-col gap-2">
          {isExpanded && (
            <div className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-1 mb-1">
              Role View
            </div>
          )}
          <div className={`flex ${isExpanded ? "flex-col gap-1" : "flex-col gap-2"}`}>
            <button
              onClick={() => setSelectedRole("brand")}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                selectedRole === "brand"
                  ? "bg-[#003DA5] text-white"
                  : "text-[#94A3B8] hover:bg-white/5"
              } ${!isExpanded && "justify-center"}`}
              title={!isExpanded ? "Brand Manager" : ""}
            >
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              {isExpanded && <span className="text-xs font-medium">Brand Manager</span>}
            </button>
            <button
              onClick={() => setSelectedRole("marketing")}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                selectedRole === "marketing"
                  ? "bg-[#003DA5] text-white"
                  : "text-[#94A3B8] hover:bg-white/5"
              } ${!isExpanded && "justify-center"}`}
              title={!isExpanded ? "Marketing" : ""}
            >
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              {isExpanded && <span className="text-xs font-medium">Marketing</span>}
            </button>
            <button
              onClick={() => setSelectedRole("rnd")}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                selectedRole === "rnd"
                  ? "bg-[#003DA5] text-white"
                  : "text-[#94A3B8] hover:bg-white/5"
              } ${!isExpanded && "justify-center"}`}
              title={!isExpanded ? "R&D" : ""}
            >
              <Beaker className="w-4 h-4 flex-shrink-0" />
              {isExpanded && <span className="text-xs font-medium">R&D</span>}
            </button>
            <button
              onClick={() => setSelectedRole("supply")}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                selectedRole === "supply"
                  ? "bg-[#003DA5] text-white"
                  : "text-[#94A3B8] hover:bg-white/5"
              } ${!isExpanded && "justify-center"}`}
              title={!isExpanded ? "Product Supply" : ""}
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              {isExpanded && <span className="text-xs font-medium">Product Supply</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {isExpanded && (
          <div className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider px-4 mb-2">
            Dashboard
          </div>
        )}
        {currentNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-4 transition-colors group relative ${
                isActive
                  ? "bg-[#003DA5] border-l-[3px] border-[#4A9EFF] text-white"
                  : "text-[#94A3B8] hover:bg-white/5"
              } ${!isExpanded && "justify-center"}`
            }
            title={!isExpanded ? item.label : ""}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-white" : "text-[#94A3B8]"}`} />
                {isExpanded && (
                  <span className={`text-[13px] font-medium whitespace-nowrap ${isActive ? "text-white" : "text-[#94A3B8]"}`}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Divider */}
        <div className={`my-3 border-t border-white/10 ${isExpanded ? "mx-4" : "mx-3"}`}></div>
        
        {/* Workspace Section */}
        {isExpanded && (
          <div className="px-4 mb-2">
            <div className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">Workspace</div>
          </div>
        )}
        
        {workspaceItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 h-11 px-4 transition-colors text-[#94A3B8] hover:bg-white/5 ${
              !isExpanded && "justify-center"
            }`}
            title={!isExpanded ? item.label : ""}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0 text-[#94A3B8]" />
            {isExpanded && <span className="text-[13px] font-medium whitespace-nowrap text-[#94A3B8]">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t border-white/10 ${!isExpanded && "flex flex-col items-center"}`}>
        <button 
          className={`flex items-center gap-3 h-10 px-3 w-full text-[#94A3B8] hover:bg-white/5 rounded transition-colors ${
            !isExpanded && "justify-center"
          }`}
          title={!isExpanded ? "Help & Support" : ""}
        >
          <HelpCircle className="w-[18px] h-[18px] flex-shrink-0" />
          {isExpanded && <span className="text-[13px] font-medium">Help & Support</span>}
        </button>
        {isExpanded && (
          <div className="mt-3 text-[11px] text-[#64748B] px-3">
            Last sync: 2 min ago
          </div>
        )}
      </div>
    </aside>
  );
}
