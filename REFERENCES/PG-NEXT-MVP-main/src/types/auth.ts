export type UserRole =
  | "Operations Manager"
  | "Data Engineer"
  | "AI Engineer"
  | "Project Manager"
  | "Market Operations"
  | "R&D"
  | "Product Supply";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  defaultRoute: string;
}

export type RouteKey =
  | "overview"
  | "brand-overview"
  | "competitor-intelligence"
  | "intelligence-command-center"
  | "operations"
  | "incidents"
  | "incident-detail"
  | "runbooks"
  | "alerts"
  | "settings-monitoring"
  | "opportunities"
  | "help";
