import { Search, Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-[60px] bg-[#003DA5] border-b border-[#002875] fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded flex items-center justify-center">
          <span className="text-[#003DA5] font-bold text-base">P&G</span>
        </div>
        <span className="text-white font-bold text-lg">P&G Consumer IQ</span>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-[500px] mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search brands, products, reviews..."
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15"
          />
        </div>
      </div>

      {/* Right - Notifications and User */}
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DA291C] rounded-full text-white text-[10px] flex items-center justify-center font-medium">
            3
          </span>
        </div>
        <div className="flex items-center gap-3 pl-3 border-l border-white/20">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">MR</span>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-white">Maria Reyes</div>
            <div className="text-xs text-white/70">Brand Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
}