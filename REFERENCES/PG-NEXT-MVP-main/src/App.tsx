import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth, RequireRoleAccess } from "./components/auth/route-guards";
import { AppShell } from "./components/layout/app-shell";
import { useAuth } from "./context/auth-context";
import { AlertsPage } from "./pages/alerts-page";
import { BrandOverviewPage } from "./pages/brand-overview-page";
import { CompetitorIntelligencePage } from "./pages/competitor-intelligence-page";
import { HelpPage } from "./pages/help-page";
import { IncidentDetailPage } from "./pages/incident-detail-page";
import { IncidentsPage } from "./pages/incidents-page";
import { IntelligenceCommandCenterPage } from "./pages/intelligence-command-center-page";
import { LoginPage } from "./pages/login-page";
import { NotFoundPage } from "./pages/not-found-page";
import { OperationsPage } from "./pages/operations-page";
import { OpportunitiesPage } from "./pages/opportunities-page";
import { OverviewPage } from "./pages/overview-page";
import { RunbooksPage } from "./pages/runbooks-page";
import { SettingsMonitoringPage } from "./pages/settings-monitoring-page";

function LoginRoute(): React.ReactElement {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    return <Navigate to={user.defaultRoute} replace />;
  }
  return <LoginPage />;
}

function HomeRoute(): React.ReactElement {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={user.defaultRoute} replace />;
}

function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/overview"
            element={
              <RequireRoleAccess routeKey="overview">
                <OverviewPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/brand-overview"
            element={
              <RequireRoleAccess routeKey="brand-overview">
                <BrandOverviewPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/competitor-intelligence"
            element={
              <RequireRoleAccess routeKey="competitor-intelligence">
                <CompetitorIntelligencePage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/intelligence-command-center"
            element={
              <RequireRoleAccess routeKey="intelligence-command-center">
                <IntelligenceCommandCenterPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/operations"
            element={
              <RequireRoleAccess routeKey="operations">
                <OperationsPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/alerts"
            element={
              <RequireRoleAccess routeKey="alerts">
                <AlertsPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/incidents"
            element={
              <RequireRoleAccess routeKey="incidents">
                <IncidentsPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/incidents/:id"
            element={
              <RequireRoleAccess routeKey="incident-detail">
                <IncidentDetailPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/runbooks"
            element={
              <RequireRoleAccess routeKey="runbooks">
                <RunbooksPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/settings/monitoring"
            element={
              <RequireRoleAccess routeKey="settings-monitoring">
                <SettingsMonitoringPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/opportunities"
            element={
              <RequireRoleAccess routeKey="opportunities">
                <OpportunitiesPage />
              </RequireRoleAccess>
            }
          />
          <Route
            path="/help"
            element={
              <RequireRoleAccess routeKey="help">
                <HelpPage />
              </RequireRoleAccess>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
