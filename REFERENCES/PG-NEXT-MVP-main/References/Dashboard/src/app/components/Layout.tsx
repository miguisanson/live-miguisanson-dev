import { Outlet } from "react-router";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { FilterBar } from "./layout/FilterBar";
import { AIAssistant } from "./layout/AIAssistant";

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Header />
      <div className="flex pt-[60px]">
        <Sidebar />
        <main className="flex-1 ml-[64px] transition-all duration-300">
          <FilterBar />
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}