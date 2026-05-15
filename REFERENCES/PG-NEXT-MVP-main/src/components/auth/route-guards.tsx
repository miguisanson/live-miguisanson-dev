import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RouteKey } from "../../types/auth";
import { canAccessRoute } from "../../data/mock-users";
import { useAuth } from "../../context/auth-context";

export function RequireAuth(): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RequireRoleAccess({
  routeKey,
  children,
}: {
  routeKey: RouteKey;
  children: React.ReactElement;
}): React.ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessRoute(user.role, routeKey)) {
    return <Navigate to={user.defaultRoute} replace />;
  }

  return children;
}
