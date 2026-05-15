import * as React from "react";
import {
  alertRules,
  businessModuleImpact,
  commandCenterCards,
  competitorMappingRows,
  incidentDetails,
  owners,
  selfHealingActions,
  thresholds,
} from "../data/mock-data";
import type {
  AlertRule,
  BusinessModuleImpact,
  IncidentDetail,
  IncidentTimelineEvent,
  IncidentStatus,
  MonitoringThreshold,
  Owner,
  SelfHealingAction,
} from "../types/models";

const DEMO_DATA_STORAGE_KEY = "consumer_iq_demo_state_v2";

export type RecommendationDecision = "pending" | "approved" | "modified" | "dismissed";
export type TicketStatus = "new" | "assigned" | "in-progress" | "waiting" | "resolved";
export type PipelineStepStatus = "success" | "failed" | "running" | "blocked";

export interface AlertRuleRecord extends AlertRule {
  acknowledged: boolean;
  acknowledgedAt: string | null;
}

export interface IncidentRecord extends IncidentDetail {
  ticketRef: string;
  retryCount: number;
  retryLimit: number;
  repeatCount: number;
  staleMinutes: number;
  fallbackMinutes: number;
  responseTargetMinutes: number;
  responseBy: string;
  requiresHumanIntervention: boolean;
  automationLocked: boolean;
  handoffTicketId: string | null;
  acknowledgedAt: string | null;
  respondedAt: string | null;
  resolvedAt: string | null;
}

export interface HandoffTicket {
  id: string;
  incidentId: string;
  relatedIncidentRef: string;
  createdAt: string;
  status: TicketStatus;
  assignedOwnerId: string;
  reason: string;
  responseTargetMinutes: number;
  respondBy: string;
  respondedAt: string | null;
  notes: string;
}

export interface CommandRecommendation {
  id: string;
  title: string;
  detail: string;
  action: string;
  decision: RecommendationDecision;
  decisionNote: string;
  updatedAt: string;
}

export interface CompetitorMappingRowRecord {
  id: string;
  company: string;
  brand: string;
  product: string;
  mappedSku: string;
  state: "healthy" | "stale";
  coverageNote: string;
}

export interface BottleneckSignal {
  id: string;
  title: string;
  category: "bottleneck" | "anomaly";
  severity: "P1" | "P2" | "P3";
  stage: string;
  signal: string;
  impact: string;
  status: "open" | "investigating" | "mitigated";
  suggestedAction: string;
  relatedIncidentId: string;
}

export interface PipelineRun {
  id: string;
  branch: string;
  environment: "Dev" | "Staging" | "Demo";
  triggeredBy: string;
  triggeredAt: string;
  buildStatus: PipelineStepStatus;
  testStatus: PipelineStepStatus;
  deployStatus: PipelineStepStatus;
  failedStep: string | null;
  releaseTag: string;
}

export interface QuickInsightRecord {
  id: string;
  pageKey: string;
  subject: string;
  summary: string;
  confidence: number;
  basis: string[];
  generatedAt: string;
}

interface DemoDataState {
  incidents: IncidentRecord[];
  alerts: AlertRuleRecord[];
  thresholds: MonitoringThreshold[];
  runbookNotes: Record<string, string>;
  commandRecommendations: CommandRecommendation[];
  selfHealingLog: SelfHealingAction[];
  tickets: HandoffTicket[];
  competitorMappings: CompetitorMappingRowRecord[];
  bottlenecks: BottleneckSignal[];
  pipelineRuns: PipelineRun[];
  insights: QuickInsightRecord[];
  moduleImpact: BusinessModuleImpact[];
}

interface QuickInsightInput {
  pageKey: string;
  subject: string;
  contextLines: string[];
}

interface QuickInsightOutput {
  record: QuickInsightRecord;
}

interface SelfHealingResult {
  outcome: "success" | "partial" | "failed";
  message: string;
  ticketId?: string;
}

interface DemoDataContextShape {
  incidents: IncidentRecord[];
  alerts: AlertRuleRecord[];
  thresholds: MonitoringThreshold[];
  runbookNotes: Record<string, string>;
  commandRecommendations: CommandRecommendation[];
  selfHealingLog: SelfHealingAction[];
  tickets: HandoffTicket[];
  competitorMappings: CompetitorMappingRowRecord[];
  bottlenecks: BottleneckSignal[];
  pipelineRuns: PipelineRun[];
  moduleImpact: BusinessModuleImpact[];
  getIncidentById: (incidentId: string) => IncidentRecord | undefined;
  getInsightsForPage: (pageKey: string) => QuickInsightRecord[];
  generateQuickInsight: (input: QuickInsightInput) => QuickInsightOutput;
  acknowledgeIncident: (incidentId: string) => void;
  assignIncidentOwner: (incidentId: string, ownerId: string) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  runSelfHealingWorkflow: (incidentId: string) => SelfHealingResult;
  createManualHandoffTicket: (incidentId: string, reason: string) => string;
  saveRunbookNote: (runbookId: string, note: string) => void;
  updateThreshold: (thresholdId: string, value: number) => void;
  addAlertRule: (rule: Omit<AlertRuleRecord, "acknowledged" | "acknowledgedAt">) => void;
  updateAlertRule: (id: string, updates: Partial<AlertRuleRecord>) => void;
  acknowledgeAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  updateRecommendation: (
    id: string,
    decision: RecommendationDecision,
    decisionNote: string,
  ) => void;
  updateCompetitorMapping: (
    id: string,
    updates: Partial<CompetitorMappingRowRecord>,
  ) => void;
  setBottleneckStatus: (id: string, status: BottleneckSignal["status"]) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  rerunPipeline: (runId: string) => PipelineRun;
}

const DemoDataContext = React.createContext<DemoDataContextShape | null>(null);

function safeParseNumber(text: string): number {
  const parsed = Number(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseDurationToMinutes(duration: string): number {
  if (duration.includes("hour")) {
    const hours = safeParseNumber(duration);
    return hours * 60;
  }
  return safeParseNumber(duration);
}

function parseIncidentAgeToMinutes(age: string): number {
  const hoursMatch = age.match(/(\d+)h/);
  const minutesMatch = age.match(/(\d+)m/);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  return hours * 60 + minutes;
}

function parseTimestamp(input: string): Date {
  if (input.includes("T")) {
    return new Date(input);
  }
  const normalized = input.replace(" ", "T");
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

function formatTimestamp(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function nowTimestamp(): string {
  return formatTimestamp(new Date());
}

function addMinutes(timestamp: string, minutes: number): string {
  const date = parseTimestamp(timestamp);
  date.setMinutes(date.getMinutes() + minutes);
  return formatTimestamp(date);
}

function buildTimelineEvent(
  timestamp: string,
  event: string,
  actor: string,
  state: IncidentTimelineEvent["state"],
): IncidentTimelineEvent {
  return { timestamp, event, actor, state };
}

function buildModuleImpact(incidents: IncidentRecord[]): BusinessModuleImpact[] {
  const activeIncidents = incidents.filter((incident) => {
    return incident.status !== "resolved" && incident.status !== "auto-recovered";
  });

  return businessModuleImpact.map((module) => {
    const blocking = activeIncidents.find(
      (incident) => incident.affectedBusinessModule === module.module,
    );

    if (!blocking) {
      return module;
    }

    if (blocking.status === "manual handoff required") {
      return {
        ...module,
        state: "degraded",
        issue: `Manual intervention ticket ${blocking.ticketRef} is active`,
        causedBy: blocking.title,
        actionGuidance: "Do not act",
      };
    }

    return {
      ...module,
      state: blocking.fallbackMinutes > 90 ? "stale" : "limited confidence",
      issue: blocking.currentWorkaround,
      causedBy: blocking.detectionRule,
      actionGuidance: "Use caution",
    };
  });
}

function buildInitialState(): DemoDataState {
  const seededIncidents: IncidentRecord[] = incidentDetails.map((incident, index) => {
    const ticketRef = `INC-${String(index + 1).padStart(4, "0")}`;
    const responseTargetMinutes = parseDurationToMinutes(incident.targetRecoveryTime);
    const incidentAgeMinutes = parseIncidentAgeToMinutes(incident.incidentAge);
    const requiresHumanIntervention = incident.status === "manual handoff required";

    return {
      ...incident,
      ticketRef,
      retryCount: requiresHumanIntervention ? 3 : index === 0 ? 2 : 1,
      retryLimit: 3,
      repeatCount: index === 0 ? 4 : index === 1 ? 3 : 2,
      staleMinutes: index === 0 ? 132 : index === 1 ? 104 : 58 + index * 13,
      fallbackMinutes: index === 0 ? 144 : index === 1 ? 96 : 48 + index * 15,
      responseTargetMinutes,
      responseBy: addMinutes(incident.detectedTime, responseTargetMinutes),
      requiresHumanIntervention,
      automationLocked: requiresHumanIntervention,
      handoffTicketId: requiresHumanIntervention ? ticketRef : null,
      acknowledgedAt: incident.status === "investigating" || incident.status === "acknowledged" || incident.status === "mitigated" || incident.status === "manual handoff required"
        ? incident.lastUpdate
        : null,
      respondedAt: incident.status === "investigating" || incident.status === "acknowledged" || incident.status === "mitigated" || incident.status === "manual handoff required"
        ? addMinutes(incident.detectedTime, Math.min(incidentAgeMinutes, 18))
        : null,
      resolvedAt:
        incident.status === "resolved" || incident.status === "auto-recovered"
          ? incident.lastUpdate
          : null,
    };
  });

  const seededTickets: HandoffTicket[] = seededIncidents
    .filter((incident) => incident.requiresHumanIntervention)
    .map((incident) => ({
      id: incident.ticketRef,
      incidentId: incident.id,
      relatedIncidentRef: incident.ticketRef,
      createdAt: incident.lastUpdate,
      status: "assigned",
      assignedOwnerId: incident.ownerId,
      reason: incident.manualHandoffCondition,
      responseTargetMinutes: incident.responseTargetMinutes,
      respondBy: incident.responseBy,
      respondedAt: incident.respondedAt,
      notes: "Awaiting source provider validation and manual credential checks.",
    }));

  const seededAlerts: AlertRuleRecord[] = alertRules.map((rule) => ({
    ...rule,
    acknowledged: false,
    acknowledgedAt: null,
  }));

  const seededRecommendations: CommandRecommendation[] = commandCenterCards.map((card) => ({
    ...card,
    decision: "pending",
    decisionNote: "",
    updatedAt: nowTimestamp(),
  }));

  const seededMappings: CompetitorMappingRowRecord[] = competitorMappingRows.map((row, index) => ({
    id: `map-${index + 1}`,
    company: row.company,
    brand: row.brand,
    product: row.product,
    mappedSku: row.mappedSku,
    state: row.state as CompetitorMappingRowRecord["state"],
    coverageNote:
      row.state === "healthy"
        ? "Coverage validated in latest taxonomy sync."
        : "Awaiting schema-compatible refresh after ETL quarantine release.",
  }));

  const seededBottlenecks: BottleneckSignal[] = [
    {
      id: "bn-001",
      title: "ETL retry volume spike",
      category: "bottleneck",
      severity: "P1",
      stage: "ETL / Validation",
      signal: "Retry volume climbed to 31/day against <=20/day threshold.",
      impact: "Competitor mapping freshness lagged by over 2 hours.",
      status: "open",
      suggestedAction: "Trigger safe-path ETL run and quarantine malformed records.",
      relatedIncidentId: seededIncidents[0]?.id ?? "",
    },
    {
      id: "bn-002",
      title: "Fallback-rate anomaly",
      category: "anomaly",
      severity: "P2",
      stage: "AI Inference",
      signal: "Fallback parser stayed above 10% for three windows.",
      impact: "Command recommendations marked limited confidence.",
      status: "investigating",
      suggestedAction: "Suppress low-confidence outputs and pin last stable prompt version.",
      relatedIncidentId: seededIncidents[1]?.id ?? "",
    },
    {
      id: "bn-003",
      title: "Source latency cluster",
      category: "bottleneck",
      severity: "P2",
      stage: "Source/API ingestion",
      signal: "Regional source latency exceeded 20 seconds with repeated timeouts.",
      impact: "Partial data completeness impacted R&D ticket generation.",
      status: "open",
      suggestedAction: "Retry connector and route unresolved cases to manual handoff.",
      relatedIncidentId: seededIncidents[3]?.id ?? seededIncidents[0]?.id ?? "",
    },
    {
      id: "bn-004",
      title: "Validation pass-rate anomaly",
      category: "anomaly",
      severity: "P3",
      stage: "Data Quality",
      signal: "Validation pass rate dropped below 98% for two runs.",
      impact: "Increased publish hold events in competitor views.",
      status: "investigating",
      suggestedAction: "Run validation diff and update schema contract checks.",
      relatedIncidentId: seededIncidents[0]?.id ?? "",
    },
  ];

  const seededPipelineRuns: PipelineRun[] = [
    {
      id: "RUN-1842",
      branch: "main",
      environment: "Demo",
      triggeredBy: "github-actions",
      triggeredAt: "2026-03-16 13:58",
      buildStatus: "success",
      testStatus: "failed",
      deployStatus: "blocked",
      failedStep: "integration-tests",
      releaseTag: "v0.9.4",
    },
    {
      id: "RUN-1841",
      branch: "release/0.9",
      environment: "Staging",
      triggeredBy: "merge-queue",
      triggeredAt: "2026-03-16 11:34",
      buildStatus: "success",
      testStatus: "success",
      deployStatus: "success",
      failedStep: null,
      releaseTag: "v0.9.3",
    },
    {
      id: "RUN-1840",
      branch: "hotfix/latency-cache",
      environment: "Dev",
      triggeredBy: "manual",
      triggeredAt: "2026-03-16 09:21",
      buildStatus: "success",
      testStatus: "success",
      deployStatus: "success",
      failedStep: null,
      releaseTag: "v0.9.2",
    },
  ];

  const runbookNotes = {
    "RB-SOURCE": "Verify provider authentication keys before final closure.",
    "RB-LAKE": "Keep checksum parity logs attached to incident evidence.",
    "RB-ETL": "Always hold publish when duplicate guardrail fails.",
    "RB-AI": "Require human validation for low-confidence sentiment spikes.",
    "RB-DASH": "Prefer cache-first path before broad rollback.",
  };

  return {
    incidents: seededIncidents,
    alerts: seededAlerts,
    thresholds,
    runbookNotes,
    commandRecommendations: seededRecommendations,
    selfHealingLog: selfHealingActions,
    tickets: seededTickets,
    competitorMappings: seededMappings,
    bottlenecks: seededBottlenecks,
    pipelineRuns: seededPipelineRuns,
    insights: [],
    moduleImpact: buildModuleImpact(seededIncidents),
  };
}

function readStoredState(): DemoDataState | null {
  try {
    const raw = localStorage.getItem(DEMO_DATA_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as DemoDataState;
    if (!parsed.incidents || !parsed.alerts || !parsed.thresholds) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function incidentActionLabel(incident: IncidentRecord): string {
  if (incident.source === "ETL") {
    return "Rerun ETL job through safe path";
  }
  if (incident.source === "AI") {
    return "Suppress low-confidence AI output";
  }
  if (incident.source === "Source/API") {
    return "Retry failed connector";
  }
  return "Restart stateless worker";
}

export function DemoDataProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [state, setState] = React.useState<DemoDataState>(() => readStoredState() ?? buildInitialState());

  React.useEffect(() => {
    localStorage.setItem(DEMO_DATA_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getIncidentById = React.useCallback(
    (incidentId: string) => state.incidents.find((incident) => incident.id === incidentId),
    [state.incidents],
  );

  const getInsightsForPage = React.useCallback(
    (pageKey: string) => {
      return state.insights
        .filter((item) => item.pageKey === pageKey)
        .slice(0, 6);
    },
    [state.insights],
  );

  const generateQuickInsight = React.useCallback((input: QuickInsightInput): QuickInsightOutput => {
    const now = nowTimestamp();
    const contextSummary = input.contextLines[0] ?? "Signals remained stable within expected range.";
    const followup =
      input.pageKey === "incident-detail"
        ? "Prioritize runbook checkpoints and manual handoff readiness if thresholds stay breached."
        : "Monitor next update window and validate if threshold pressure persists.";

    const confidenceBase =
      input.pageKey === "incident-detail"
        ? 0.78
        : input.pageKey === "operations"
          ? 0.82
          : 0.86;

    const record: QuickInsightRecord = {
      id: `${Date.now()}-${Math.random()}`,
      pageKey: input.pageKey,
      subject: input.subject,
      summary: `${input.subject}: ${contextSummary} ${followup}`,
      confidence: confidenceBase,
      basis: input.contextLines.slice(0, 3),
      generatedAt: now,
    };

    setState((previous) => ({
      ...previous,
      insights: [record, ...previous.insights].slice(0, 80),
    }));

    return { record };
  }, []);

  const acknowledgeIncident = React.useCallback((incidentId: string) => {
    const timestamp = nowTimestamp();
    setState((previous) => {
      const incidents = previous.incidents.map((incident) => {
        if (incident.id !== incidentId) {
          return incident;
        }
        return {
          ...incident,
          status: "acknowledged" as IncidentStatus,
          acknowledgedAt: timestamp,
          respondedAt: incident.respondedAt ?? timestamp,
          lastUpdate: timestamp,
          timeline: [
            ...incident.timeline,
            buildTimelineEvent(
              timestamp,
              `Incident ${incident.ticketRef} acknowledged by command owner.`,
              "Operations Manager",
              "acknowledged",
            ),
          ],
        };
      });

      return {
        ...previous,
        incidents,
        moduleImpact: buildModuleImpact(incidents),
      };
    });
  }, []);

  const assignIncidentOwner = React.useCallback((incidentId: string, ownerId: string) => {
    const timestamp = nowTimestamp();
    setState((previous) => {
      const incidents = previous.incidents.map((incident) => {
        if (incident.id !== incidentId) {
          return incident;
        }
        const owner = owners.find((candidate) => candidate.id === ownerId);
        return {
          ...incident,
          ownerId,
          lastUpdate: timestamp,
          timeline: [
            ...incident.timeline,
            buildTimelineEvent(
              timestamp,
              `Ownership reassigned to ${owner?.name ?? ownerId}.`,
              "Incident Commander",
              "handoff",
            ),
          ],
        };
      });

      const tickets = previous.tickets.map((ticket) => {
        if (ticket.incidentId !== incidentId) {
          return ticket;
        }
        return {
          ...ticket,
          assignedOwnerId: ownerId,
        };
      });

      return {
        ...previous,
        incidents,
        tickets,
        moduleImpact: buildModuleImpact(incidents),
      };
    });
  }, []);

  const updateIncidentStatus = React.useCallback((incidentId: string, status: IncidentStatus) => {
    const timestamp = nowTimestamp();
    setState((previous) => {
      const incidents = previous.incidents.map((incident) => {
        if (incident.id !== incidentId) {
          return incident;
        }

        const timelineState: IncidentTimelineEvent["state"] =
          status === "resolved"
            ? "mitigation"
            : status === "manual handoff required"
              ? "handoff"
              : "acknowledged";

        return {
          ...incident,
          status,
          lastUpdate: timestamp,
          resolvedAt:
            status === "resolved" || status === "auto-recovered"
              ? timestamp
              : incident.resolvedAt,
          timeline: [
            ...incident.timeline,
            buildTimelineEvent(
              timestamp,
              `Incident status changed to ${status}.`,
              "Command Operator",
              timelineState,
            ),
          ],
        };
      });

      return {
        ...previous,
        incidents,
        moduleImpact: buildModuleImpact(incidents),
      };
    });
  }, []);

  const createManualHandoffTicket = React.useCallback((incidentId: string, reason: string): string => {
    const timestamp = nowTimestamp();
    let ticketId = "";

    setState((previous) => {
      const incident = previous.incidents.find((entry) => entry.id === incidentId);
      if (!incident) {
        return previous;
      }

      if (incident.handoffTicketId) {
        ticketId = incident.handoffTicketId;
        return previous;
      }

      ticketId = incident.ticketRef;
      const ticket: HandoffTicket = {
        id: ticketId,
        incidentId,
        relatedIncidentRef: incident.ticketRef,
        createdAt: timestamp,
        status: "new",
        assignedOwnerId: incident.ownerId,
        reason,
        responseTargetMinutes: incident.responseTargetMinutes,
        respondBy: addMinutes(timestamp, incident.responseTargetMinutes),
        respondedAt: null,
        notes: "Manual intervention required after automation threshold breach.",
      };

      const incidents = previous.incidents.map((entry) => {
        if (entry.id !== incidentId) {
          return entry;
        }
        return {
          ...entry,
          status: "manual handoff required" as IncidentStatus,
          requiresHumanIntervention: true,
          automationLocked: true,
          handoffTicketId: ticket.id,
          lastUpdate: timestamp,
          timeline: [
            ...entry.timeline,
            buildTimelineEvent(
              timestamp,
              `Manual handoff ticket ${ticket.id} created.`,
              "Workflow AI",
              "handoff",
            ),
          ],
        };
      });

      return {
        ...previous,
        incidents,
        tickets: [ticket, ...previous.tickets],
        moduleImpact: buildModuleImpact(incidents),
      };
    });

    return ticketId;
  }, []);

  const runSelfHealingWorkflow = React.useCallback((incidentId: string): SelfHealingResult => {
    const timestamp = nowTimestamp();
    const freshnessThreshold = state.thresholds.find((item) => item.id === "th-freshness")?.currentValue ?? 90;

    let result: SelfHealingResult = {
      outcome: "partial",
      message: "Self-healing action queued.",
    };

    setState((previous) => {
      const target = previous.incidents.find((incident) => incident.id === incidentId);
      if (!target) {
        result = {
          outcome: "failed",
          message: "Incident was not found.",
        };
        return previous;
      }

      if (target.automationLocked) {
        result = {
          outcome: "failed",
          message: "Automation is locked. Manual intervention is already required.",
          ticketId: target.handoffTicketId ?? undefined,
        };
        return previous;
      }

      const nextRetryCount = target.retryCount + 1;
      const retryExceeded = nextRetryCount > target.retryLimit;
      const ageExceeded = parseIncidentAgeToMinutes(target.incidentAge) > target.responseTargetMinutes;
      const repeatExceeded = target.repeatCount >= 3;
      const staleExceeded = target.staleMinutes > freshnessThreshold;
      const fallbackExceeded = target.fallbackMinutes > 120;

      const needsHandoff =
        retryExceeded || ageExceeded || repeatExceeded || staleExceeded || fallbackExceeded;

      const actionTaken = incidentActionLabel(target);
      const actionLog: SelfHealingAction = {
        timestamp,
        triggerCondition: target.detectionRule,
        actionTaken: `${actionTaken} (attempt ${Math.min(nextRetryCount, target.retryLimit)}/${target.retryLimit})`,
        serviceAffected: target.affectedComponent,
        result: needsHandoff
          ? "failed"
          : target.severity === "P1" && nextRetryCount < 2
            ? "partial"
            : "success",
      };

      let tickets = previous.tickets;
      let handoffTicketId = target.handoffTicketId;

      if (needsHandoff) {
        handoffTicketId = target.handoffTicketId ?? target.ticketRef;

        if (!target.handoffTicketId) {
          const ticket: HandoffTicket = {
            id: handoffTicketId,
            incidentId: target.id,
            relatedIncidentRef: target.ticketRef,
            createdAt: timestamp,
            status: "assigned",
            assignedOwnerId: target.ownerId,
            reason:
              "Workflow AI stopped after threshold breach: retries/age/repeat/staleness conditions exceeded.",
            responseTargetMinutes: target.responseTargetMinutes,
            respondBy: addMinutes(timestamp, target.responseTargetMinutes),
            respondedAt: null,
            notes: "Escalated automatically after safe scripted actions were exhausted.",
          };
          tickets = [ticket, ...tickets];
        }
      }

      const incidents = previous.incidents.map((incident) => {
        if (incident.id !== incidentId) {
          return incident;
        }

        if (needsHandoff) {
          return {
            ...incident,
            retryCount: nextRetryCount,
            status: "manual handoff required" as IncidentStatus,
            requiresHumanIntervention: true,
            automationLocked: true,
            handoffTicketId,
            lastUpdate: timestamp,
            timeline: [
              ...incident.timeline,
              buildTimelineEvent(
                timestamp,
                `Workflow AI stopped automation and created manual handoff ticket ${handoffTicketId}.`,
                "Workflow AI",
                "handoff",
              ),
            ],
          };
        }

        const autoRecovered =
          (incident.severity === "P3" || incident.severity === "P4" || incident.severity === "P5") ||
          nextRetryCount >= 2;

        if (autoRecovered) {
          return {
            ...incident,
            retryCount: nextRetryCount,
            status: "auto-recovered" as IncidentStatus,
            automationLocked: true,
            resolvedAt: timestamp,
            lastUpdate: timestamp,
            timeline: [
              ...incident.timeline,
              buildTimelineEvent(
                timestamp,
                `Workflow AI recovered the incident through scripted action: ${actionTaken}.`,
                "Workflow AI",
                "mitigation",
              ),
            ],
          };
        }

        return {
          ...incident,
          retryCount: nextRetryCount,
          status: "investigating" as IncidentStatus,
          lastUpdate: timestamp,
          timeline: [
            ...incident.timeline,
            buildTimelineEvent(
              timestamp,
              `Workflow AI attempted ${actionTaken}; monitoring for stabilization.`,
              "Workflow AI",
              "auto-action",
            ),
          ],
        };
      });

      const updatedIncident = incidents.find((incident) => incident.id === incidentId);
      if (!updatedIncident) {
        result = {
          outcome: "failed",
          message: "Incident state update failed.",
        };
      } else if (updatedIncident.status === "manual handoff required") {
        result = {
          outcome: "failed",
          message: `Threshold breached. Manual ticket ${updatedIncident.handoffTicketId ?? updatedIncident.ticketRef} created.`,
          ticketId: updatedIncident.handoffTicketId ?? updatedIncident.ticketRef,
        };
      } else if (updatedIncident.status === "auto-recovered") {
        result = {
          outcome: "success",
          message: `Incident ${updatedIncident.ticketRef} auto-recovered by workflow scripts.`,
        };
      } else {
        result = {
          outcome: "partial",
          message: `Attempt ${nextRetryCount}/${updatedIncident.retryLimit} completed. Monitoring continues.`,
        };
      }

      return {
        ...previous,
        incidents,
        tickets,
        selfHealingLog: [actionLog, ...previous.selfHealingLog],
        moduleImpact: buildModuleImpact(incidents),
      };
    });

    return result;
  }, [state.thresholds]);

  const saveRunbookNote = React.useCallback((runbookId: string, note: string) => {
    setState((previous) => ({
      ...previous,
      runbookNotes: {
        ...previous.runbookNotes,
        [runbookId]: note,
      },
    }));
  }, []);

  const updateThreshold = React.useCallback((thresholdId: string, value: number) => {
    setState((previous) => ({
      ...previous,
      thresholds: previous.thresholds.map((threshold) => {
        if (threshold.id !== thresholdId) {
          return threshold;
        }
        return {
          ...threshold,
          currentValue: value,
        };
      }),
    }));
  }, []);

  const addAlertRule = React.useCallback((rule: Omit<AlertRuleRecord, "acknowledged" | "acknowledgedAt">) => {
    setState((previous) => ({
      ...previous,
      alerts: [
        {
          ...rule,
          acknowledged: false,
          acknowledgedAt: null,
        },
        ...previous.alerts,
      ],
    }));
  }, []);

  const updateAlertRule = React.useCallback((id: string, updates: Partial<AlertRuleRecord>) => {
    setState((previous) => ({
      ...previous,
      alerts: previous.alerts.map((alert) => {
        if (alert.id !== id) {
          return alert;
        }
        return {
          ...alert,
          ...updates,
        };
      }),
    }));
  }, []);

  const acknowledgeAlert = React.useCallback((id: string) => {
    const timestamp = nowTimestamp();
    setState((previous) => ({
      ...previous,
      alerts: previous.alerts.map((alert) => {
        if (alert.id !== id) {
          return alert;
        }
        return {
          ...alert,
          acknowledged: true,
          acknowledgedAt: timestamp,
        };
      }),
    }));
  }, []);

  const deleteAlert = React.useCallback((id: string) => {
    setState((previous) => ({
      ...previous,
      alerts: previous.alerts.filter((alert) => alert.id !== id),
    }));
  }, []);

  const updateRecommendation = React.useCallback(
    (id: string, decision: RecommendationDecision, decisionNote: string) => {
      const timestamp = nowTimestamp();
      setState((previous) => ({
        ...previous,
        commandRecommendations: previous.commandRecommendations.map((recommendation) => {
          if (recommendation.id !== id) {
            return recommendation;
          }
          return {
            ...recommendation,
            decision,
            decisionNote,
            updatedAt: timestamp,
          };
        }),
      }));
    },
    [],
  );

  const updateCompetitorMapping = React.useCallback(
    (id: string, updates: Partial<CompetitorMappingRowRecord>) => {
      setState((previous) => ({
        ...previous,
        competitorMappings: previous.competitorMappings.map((row) => {
          if (row.id !== id) {
            return row;
          }
          return {
            ...row,
            ...updates,
          };
        }),
      }));
    },
    [],
  );

  const setBottleneckStatus = React.useCallback((id: string, status: BottleneckSignal["status"]) => {
    setState((previous) => ({
      ...previous,
      bottlenecks: previous.bottlenecks.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return {
          ...item,
          status,
        };
      }),
    }));
  }, []);

  const updateTicketStatus = React.useCallback((ticketId: string, status: TicketStatus) => {
    const timestamp = nowTimestamp();
    setState((previous) => ({
      ...previous,
      tickets: previous.tickets.map((ticket) => {
        if (ticket.id !== ticketId) {
          return ticket;
        }
        return {
          ...ticket,
          status,
          respondedAt:
            status === "assigned" || status === "in-progress" || status === "resolved"
              ? ticket.respondedAt ?? timestamp
              : ticket.respondedAt,
        };
      }),
    }));
  }, []);

  const rerunPipeline = React.useCallback((runId: string): PipelineRun => {
    const timestamp = nowTimestamp();
    let newRun: PipelineRun = {
      id: `RUN-${Math.floor(Math.random() * 9000) + 1000}`,
      branch: "main",
      environment: "Demo",
      triggeredBy: "rerun",
      triggeredAt: timestamp,
      buildStatus: "running",
      testStatus: "blocked",
      deployStatus: "blocked",
      failedStep: null,
      releaseTag: "pending",
    };

    setState((previous) => {
      const source = previous.pipelineRuns.find((run) => run.id === runId) ?? previous.pipelineRuns[0];
      const success = previous.pipelineRuns.length % 2 === 0;

      newRun = {
        id: `RUN-${Math.floor(Math.random() * 9000) + 1000}`,
        branch: source?.branch ?? "main",
        environment: source?.environment ?? "Demo",
        triggeredBy: "rerun",
        triggeredAt: timestamp,
        buildStatus: "success",
        testStatus: success ? "success" : "failed",
        deployStatus: success ? "success" : "blocked",
        failedStep: success ? null : "integration-tests",
        releaseTag: success ? `v0.9.${previous.pipelineRuns.length + 2}` : "not-released",
      };

      return {
        ...previous,
        pipelineRuns: [newRun, ...previous.pipelineRuns].slice(0, 12),
      };
    });

    return newRun;
  }, []);

  return (
    <DemoDataContext.Provider
      value={{
        incidents: state.incidents,
        alerts: state.alerts,
        thresholds: state.thresholds,
        runbookNotes: state.runbookNotes,
        commandRecommendations: state.commandRecommendations,
        selfHealingLog: state.selfHealingLog,
        tickets: state.tickets,
        competitorMappings: state.competitorMappings,
        bottlenecks: state.bottlenecks,
        pipelineRuns: state.pipelineRuns,
        moduleImpact: state.moduleImpact,
        getIncidentById,
        getInsightsForPage,
        generateQuickInsight,
        acknowledgeIncident,
        assignIncidentOwner,
        updateIncidentStatus,
        runSelfHealingWorkflow,
        createManualHandoffTicket,
        saveRunbookNote,
        updateThreshold,
        addAlertRule,
        updateAlertRule,
        acknowledgeAlert,
        deleteAlert,
        updateRecommendation,
        updateCompetitorMapping,
        setBottleneckStatus,
        updateTicketStatus,
        rerunPipeline,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData(): DemoDataContextShape {
  const context = React.useContext(DemoDataContext);
  if (!context) {
    throw new Error("useDemoData must be used inside DemoDataProvider");
  }
  return context;
}

export function useOwners(): Owner[] {
  return owners;
}
