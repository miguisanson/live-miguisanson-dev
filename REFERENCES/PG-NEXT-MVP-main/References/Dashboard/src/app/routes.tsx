import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { BrandOverview } from "./components/screens/BrandOverview";
import { IntelligenceCommand } from "./components/screens/IntelligenceCommand";
import { CompetitorIntel } from "./components/screens/CompetitorIntel";
import { RnDDeepDive } from "./components/screens/RnDDeepDive";
import { OperationsDashboard } from "./components/screens/OperationsDashboard";
import { MarketingDashboard } from "./components/screens/MarketingDashboard";
import { RnDDashboard } from "./components/screens/RnDDashboard";
import { SupplyDashboard } from "./components/screens/SupplyDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      // Brand Manager Routes
      { index: true, Component: BrandOverview },
      { path: "intelligence", Component: IntelligenceCommand },
      { path: "competitor", Component: CompetitorIntel },
      { path: "rnd", Component: RnDDeepDive },
      { path: "operations", Component: OperationsDashboard },
      
      // Marketing Routes
      { path: "marketing", Component: MarketingDashboard },
      { path: "marketing/insights", Component: MarketingDashboard },
      { path: "marketing/media", Component: MarketingDashboard },
      { path: "marketing/health", Component: MarketingDashboard },
      
      // R&D Routes (Innovation focused)
      { path: "rnd/testing", Component: RnDDashboard },
      { path: "rnd/formulas", Component: RnDDashboard },
      { path: "rnd/gaps", Component: RnDDashboard },
      
      // Product Supply Routes
      { path: "supply", Component: SupplyDashboard },
      { path: "supply/production", Component: SupplyDashboard },
      { path: "supply/inventory", Component: SupplyDashboard },
      { path: "supply/logistics", Component: SupplyDashboard },
    ],
  },
]);