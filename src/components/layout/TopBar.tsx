import Link from "next/link";
import { AccountControls } from "@/components/auth/AccountControls";
import { MenuIcon } from "./NavIcons";

type TopBarProps = {
  onMenuClick: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="topbar-menu" onClick={onMenuClick} aria-label="Toggle navigation">
          <MenuIcon />
        </button>
        <Link href="/" className="topbar-brand">
          miguisanson.dev
        </Link>
      </div>
      <div className="topbar-right">
        <AccountControls />
      </div>
    </header>
  );
}
