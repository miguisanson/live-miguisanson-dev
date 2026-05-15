import { Bell, LogOut, Menu, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "../../context/auth-context";
import { useDemoFeedback } from "../../context/demo-feedback";
import { HelpTip } from "../help/help-tip";
import { Switch } from "../ui/switch";
import { useOpportunityMode } from "../../context/opportunity-mode";

interface TopBarProps {
  onOpenOpportunity: () => void;
  onOpenMobileNav: () => void;
}

function userInitials(name: string | undefined): string {
  if (!name) {
    return "U";
  }
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopBar({
  onOpenOpportunity,
  onOpenMobileNav,
}: TopBarProps): React.ReactElement {
  const { user, logout } = useAuth();
  const { notify } = useDemoFeedback();
  const { enabled, setEnabled } = useOpportunityMode();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-[60px] border-b border-[#002875] bg-[#003DA5] px-3 md:px-6">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="border-[#2f5cae] bg-[#003DA5] text-white hover:bg-[#0057C8] lg:hidden"
            onClick={onOpenMobileNav}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded bg-white text-sm font-bold text-[#003DA5]">
              P&G
            </div>
            <p className="hidden text-[2rem] font-bold leading-none text-white md:block">
              P&G Consumer IQ
            </p>
            <p className="text-base font-bold text-white md:hidden">P&G IQ</p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 items-center md:flex">
          <div className="mx-6 w-full max-w-[680px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a9bdea]" />
              <Input
                placeholder="Search brands, products, reviews..."
                className="h-11 border border-[#2f5cae] bg-[#1A56B5] pl-10 text-base text-white placeholder:text-[#c9d8f5] focus-visible:ring-[#7ea6ef]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-[#114AA7] px-3 py-1.5 lg:flex">
            <Sparkles className="h-4 w-4 text-[#9fc1ff]" />
            <span className="text-xs font-semibold text-white">Opportunity</span>
            <Switch
              checked={enabled}
              onCheckedChange={(next) => {
                setEnabled(next);
                notify(
                  next ? "Opportunity Mode enabled" : "Opportunity Mode disabled",
                  "Future feature visibility updated for this session.",
                );
              }}
            />
          </div>

          <HelpTip
            title="Global search"
            content="Search in this prototype helps you quickly navigate concepts and labels. It is simulated for demo behavior."
          />

          <button
            type="button"
            onClick={() =>
              notify("Notification center", "Three active reliability notifications in queue.")
            }
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DA291C] px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          <Button
            variant="outline"
            size="icon"
            className="hidden border-[#2f5cae] bg-[#114AA7] text-white hover:bg-[#1c58b8] md:inline-flex"
            onClick={() => {
              onOpenOpportunity();
              notify("Opportunity drawer opened");
            }}
            aria-label="Open opportunity drawer"
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <div className="hidden items-center gap-3 border-l border-white/20 pl-3 md:flex">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-sm font-semibold text-white">
              {userInitials(user?.name)}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">{user?.name ?? "User"}</p>
              <p className="text-xs text-[#d4e0f7]">{user?.role ?? "Role"}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-[#2f5cae] bg-[#003DA5] text-white hover:bg-[#0057C8]"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
