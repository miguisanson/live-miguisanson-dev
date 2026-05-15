import { NavLink } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  Settings2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { RouteKey } from "../../types/auth";
import { canAccessRoute } from "../../data/mock-users";
import { useAuth } from "../../context/auth-context";

interface NavItem {
  to: string;
  label: string;
  routeKey: RouteKey;
  icon: React.ComponentType<{ className?: string }>;
}

const primaryNavItems: NavItem[] = [
  { to: "/overview", label: "Overview", routeKey: "overview", icon: LayoutDashboard },
  {
    to: "/brand-overview",
    label: "Brand Overview",
    routeKey: "brand-overview",
    icon: BriefcaseBusiness,
  },
  {
    to: "/competitor-intelligence",
    label: "Competitor Intelligence",
    routeKey: "competitor-intelligence",
    icon: TrendingUp,
  },
  {
    to: "/intelligence-command-center",
    label: "Intelligence Command Center",
    routeKey: "intelligence-command-center",
    icon: Bot,
  },
  {
    to: "/operations",
    label: "Operations Dashboard",
    routeKey: "operations",
    icon: Gauge,
  },
  { to: "/incidents", label: "Incidents", routeKey: "incidents", icon: ShieldAlert },
  { to: "/alerts", label: "Alerts", routeKey: "alerts", icon: Bell },
];

const workspaceNavItems: NavItem[] = [
  { to: "/runbooks", label: "Runbooks", routeKey: "runbooks", icon: BookOpen },
  {
    to: "/settings/monitoring",
    label: "Monitoring Settings",
    routeKey: "settings-monitoring",
    icon: Settings2,
  },
  {
    to: "/opportunities",
    label: "Future Features",
    routeKey: "opportunities",
    icon: Sparkles,
  },
  { to: "/help", label: "Help", routeKey: "help", icon: HelpCircle },
];

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

function navClass(isActive: boolean): string {
  return cn(
    "grid h-11 w-11 place-items-center rounded-md border border-transparent transition-colors",
    isActive
      ? "bg-[#003DA5] text-white"
      : "text-[#94A3B8] hover:border-[#203b63] hover:bg-white/5 hover:text-white",
  );
}

function MobileSidebar({ onNavigate }: { onNavigate?: () => void }): React.ReactElement {
  const { user } = useAuth();
  const visiblePrimary = primaryNavItems.filter((item) =>
    user ? canAccessRoute(user.role, item.routeKey) : false,
  );
  const visibleWorkspace = workspaceNavItems.filter((item) =>
    user ? canAccessRoute(user.role, item.routeKey) : false,
  );

  return (
    <aside className="h-full w-72 border-r border-[#162b4a] bg-[#0A1628] p-4">
      <div className="mb-5 rounded-md border border-[#1e3763] bg-[#112746] p-3">
        <p className="text-sm font-semibold text-white">Consumer IQ</p>
        <p className="text-xs text-[#9bb2d9]">Role-aware command workspace</p>
      </div>

      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
        Dashboards
      </p>
      <nav className="space-y-1">
        {visiblePrimary.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-[#003DA5] text-white"
                  : "text-[#94A3B8] hover:bg-white/5 hover:text-white",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="my-3 border-t border-white/10" />

      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
        Workspace
      </p>
      <nav className="space-y-1">
        {visibleWorkspace.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-[#003DA5] text-white"
                  : "text-[#94A3B8] hover:bg-white/5 hover:text-white",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function AppSidebar({ mobile = false, onNavigate }: SidebarProps): React.ReactElement {
  const { user } = useAuth();
  const visiblePrimary = primaryNavItems.filter((item) =>
    user ? canAccessRoute(user.role, item.routeKey) : false,
  );
  const visibleWorkspace = workspaceNavItems.filter((item) =>
    user ? canAccessRoute(user.role, item.routeKey) : false,
  );

  if (mobile) {
    return <MobileSidebar onNavigate={onNavigate} />;
  }

  return (
    <aside className="fixed bottom-0 left-0 top-[60px] z-20 hidden w-16 border-r border-[#162b4a] bg-[#0A1628] lg:flex lg:flex-col lg:items-center">
      <div className="mb-3 mt-3 grid h-11 w-11 place-items-center rounded-md bg-[#003DA5]">
        <LayoutDashboard className="h-[18px] w-[18px] text-white" />
      </div>
      <div className="h-px w-10 bg-white/10" />

      <nav className="mt-3 flex flex-1 flex-col items-center gap-2 overflow-y-auto py-2">
        {visiblePrimary.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            onClick={onNavigate}
            aria-label={item.label}
            className={({ isActive }) => navClass(isActive)}
          >
            <item.icon className="h-5 w-5" />
          </NavLink>
        ))}
        <div className="my-2 h-px w-10 bg-white/10" />
        {visibleWorkspace.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            onClick={onNavigate}
            aria-label={item.label}
            className={({ isActive }) => navClass(isActive)}
          >
            <item.icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>
      <div className="mb-3 text-[10px] text-[#64748B]">v0.9</div>
    </aside>
  );
}
