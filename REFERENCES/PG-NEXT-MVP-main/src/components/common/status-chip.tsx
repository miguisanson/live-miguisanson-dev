import { Badge } from "../ui/badge";
import type { HealthState, InsightState, IncidentStatus, Severity } from "../../types/models";

type ChipState = HealthState | InsightState | IncidentStatus | Severity;

const variantMap: Record<ChipState, "default" | "success" | "warning" | "danger" | "info"> = {
  healthy: "success",
  degraded: "warning",
  down: "danger",
  stale: "warning",
  "limited confidence": "info",
  acknowledged: "info",
  investigating: "warning",
  mitigated: "info",
  resolved: "success",
  "auto-recovered": "success",
  "manual handoff required": "danger",
  P1: "danger",
  P2: "warning",
  P3: "info",
  P4: "default",
  P5: "default",
};

export function StatusChip({ state }: { state: ChipState }): React.ReactElement {
  return (
    <Badge variant={variantMap[state]} className="capitalize">
      {state}
    </Badge>
  );
}
