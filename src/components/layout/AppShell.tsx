"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const isAdmin = Boolean((session?.user as { isAdmin?: boolean } | undefined)?.isAdmin);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className={`app-shell${drawerOpen ? " is-drawer-open" : ""}`}>
      <Sidebar isAdmin={isAdmin} pathname={pathname} onClose={() => setDrawerOpen(false)} />
      <button
        type="button"
        className="app-scrim"
        aria-label="Close menu"
        tabIndex={drawerOpen ? 0 : -1}
        onClick={() => setDrawerOpen(false)}
      />
      <div className="app-main">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        <main id="main" className="main">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
