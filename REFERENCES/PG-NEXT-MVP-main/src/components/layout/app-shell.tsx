import { Outlet } from "react-router-dom";
import * as React from "react";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";
import { FilterBar } from "./filter-bar";
import { OpportunityDrawer } from "../common/opportunity-drawer";
import { Button } from "../ui/button";

export function AppShell(): React.ReactElement {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <AppSidebar />
      <div className="min-w-0 flex min-h-screen flex-1 flex-col lg:pl-16">
        <TopBar
          onOpenOpportunity={() => setDrawerOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <FilterBar />
        <main className="flex-1 p-4 md:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
      <OpportunityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(10,22,40,0.55)] backdrop-blur-[1px]"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full max-w-[20rem]">
            <AppSidebar mobile onNavigate={() => setMobileNavOpen(false)} />
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setMobileNavOpen(false)}
              >
                Close Menu
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
