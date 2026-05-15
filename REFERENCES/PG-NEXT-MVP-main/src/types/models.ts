export type HealthState = "healthy" | "degraded" | "down";
export type InsightState =
  | "healthy"
  | "degraded"
  | "stale"
  | "limited confidence";
export type Severity = "P1" | "P2" | "P3" | "P4" | "P5";
export type IncidentStatus =
  | "acknowledged"
  | "investigating"
  | "mitigated"
  | "resolved"
  | "auto-recovered"
  | "manual handoff required";
export type AlertControlTier = "Current core control" | "Future enhanced control";

export interface Owner {
  id: string;
  name: string;
  role:
    | "Operations Manager"
    | "Data Engineer"
    | "AI Engineer"
    | "Project Manager";
  channel: string;
}

export interface ServiceHealth {
  id: string;
  label:
    | "Source/API ingestion"
    | "Data Lake Landing"
    | "ETL / Validation"
    | "AI Inference"
    | "API Service"
    | "Dashboard Delivery";
  state: HealthState;
  detail: string;
}

export interface BusinessModuleImpact {
  module:
    | "Brand Overview"
    | "Competitor Intelligence"
    | "Intelligence Command Center"
    | "R&D Ticket Generator";
  state: InsightState;
  issue: string;
  causedBy: string;
  actionGuidance: "Safe to act" | "Use caution" | "Do not act";
}

export interface KpiStat {
  id: string;
  title: string;
  value: string;
  subValue: string;
  state: HealthState | "stale" | "limited confidence";
}

export interface TrendPoint {
  time: string;
  value: number;
  secondary?: number;
  tertiary?: number;
}

export interface PipelineMetricRow {
  metric: string;
  value: string;
  threshold: string;
  trend: "up" | "down" | "flat";
  state: HealthState | "stale";
}

export interface AIReliabilityRow {
  metric: string;
  value: string;
  threshold: string;
  state: HealthState | "stale" | "limited confidence";
  note: string;
}

export interface DeliveryMetricRow {
  metric: string;
  value: string;
  threshold: string;
  state: HealthState | "stale";
  affectedTeams: string;
}

export interface IncidentSummary {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  ownerId: string;
  source: "Source/API" | "Data Lake" | "ETL" | "AI" | "Dashboard/API";
  affectedComponent: string;
  detectedTime: string;
  lastUpdate: string;
  recoveryTarget: string;
  affectedBusinessModule:
    | "Brand Overview"
    | "Competitor Intelligence"
    | "Intelligence Command Center"
    | "R&D Ticket Generator";
  currentWorkaround: string;
  targetRecoveryTime: string;
  incidentAge: string;
  detectionRule: string;
  fallbackState: string;
  manualHandoffCondition: string;
  stakeholderImpact: string;
}

export interface IncidentTimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
  state:
    | "detected"
    | "acknowledged"
    | "auto-action"
    | "handoff"
    | "mitigation"
    | "rca";
}

export interface CAPTask {
  id: string;
  title: string;
  ownerRole: Owner["role"];
  dueDate: string;
  status: "open" | "in-progress" | "done";
}

export interface RCAItem {
  id: string;
  why: string;
  correctiveControl: string;
  ownerRole: Owner["role"];
}

export interface IncidentDetail extends IncidentSummary {
  timeline: IncidentTimelineEvent[];
  autoActionsAttempted: string[];
  currentSystemState: string;
  businessImpactNotes: string[];
  rcaItems: RCAItem[];
  capTasks: CAPTask[];
  linkedRunbookIds: string[];
  linkedAlertIds: string[];
  eventLog: Array<{
    timestamp: string;
    stream: string;
    message: string;
  }>;
}

export interface AlertRule {
  id: string;
  name: string;
  severity: Severity;
  metric: string;
  threshold: string;
  notificationPath: string;
  actionGroup: string;
  autoActionEnabled: boolean;
  lastTriggered: string;
  enabled: boolean;
  controlTier: AlertControlTier;
}

export interface SelfHealingAction {
  timestamp: string;
  triggerCondition: string;
  actionTaken: string;
  serviceAffected: string;
  result: "success" | "partial" | "failed";
}

export interface Runbook {
  id: string;
  domain:
    | "Source/API incident runbook"
    | "Data lake landing runbook"
    | "ETL / validation runbook"
    | "AI inference runbook"
    | "Dashboard / API runbook";
  triggerCondition: string;
  firstResponse: string;
  automatedAction: string;
  manualEscalationCondition: string;
  ownerRole: Owner["role"];
  validationBeforeClosure: string;
  severityMapping: string;
  responseTarget: string;
  escalationOwner: string;
  notificationMethod: string;
  autoActionAllowed: boolean;
}

export interface MonitoringThreshold {
  id: string;
  label: string;
  unit: string;
  currentValue: number;
  recommendedRange: string;
}

export interface RaciTask {
  task: string;
  operationsManager: "A/R" | "A" | "R" | "C" | "I";
  dataEngineer: "A/R" | "A" | "R" | "C" | "I";
  aiEngineer: "A/R" | "A" | "R" | "C" | "I";
  projectManager: "A/R" | "A" | "R" | "C" | "I";
}

export interface OpportunityCard {
  id: string;
  title: string;
  summary: string;
  stage: "Available Next" | "Future Enhancements";
}
