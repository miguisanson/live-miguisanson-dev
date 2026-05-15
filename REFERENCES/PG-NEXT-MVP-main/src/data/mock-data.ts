import type {
  AIReliabilityRow,
  AlertRule,
  BusinessModuleImpact,
  DeliveryMetricRow,
  IncidentDetail,
  IncidentSummary,
  KpiStat,
  MonitoringThreshold,
  OpportunityCard,
  Owner,
  PipelineMetricRow,
  RaciTask,
  Runbook,
  SelfHealingAction,
  ServiceHealth,
  TrendPoint,
} from "../types/models";

export const owners: Owner[] = [
  {
    id: "ops-maria",
    name: "Maria Santos",
    role: "Operations Manager",
    channel: "Teams #consumer-iq-bridge",
  },
  {
    id: "de-ken",
    name: "Ken Ramirez",
    role: "Data Engineer",
    channel: "Teams #data-pipeline-warroom",
  },
  {
    id: "ai-jules",
    name: "Jules Navarro",
    role: "AI Engineer",
    channel: "Teams #ai-observability",
  },
  {
    id: "pm-ava",
    name: "Ava Lim",
    role: "Project Manager",
    channel: "Email + Teams status channel",
  },
];

export const serviceHealthSummary: ServiceHealth[] = [
  {
    id: "source-ingestion",
    label: "Source/API ingestion",
    state: "degraded",
    detail: "Lazada feed latency elevated with intermittent 429 responses.",
  },
  {
    id: "lake-landing",
    label: "Data Lake Landing",
    state: "healthy",
    detail: "Landing jobs complete, checksum parity within threshold.",
  },
  {
    id: "etl-validation",
    label: "ETL / Validation",
    state: "degraded",
    detail: "Schema drift on competitor attributes; quarantine active.",
  },
  {
    id: "ai-inference",
    label: "AI Inference",
    state: "degraded",
    detail: "Malformed JSON above control threshold; fallback parser enabled.",
  },
  {
    id: "api-service",
    label: "API Service",
    state: "healthy",
    detail: "p95 under critical threshold with isolated spikes.",
  },
  {
    id: "dashboard-delivery",
    label: "Dashboard Delivery",
    state: "degraded",
    detail: "Competitor Intelligence served from last known good dataset.",
  },
];

export const businessModuleImpact: BusinessModuleImpact[] = [
  {
    module: "Brand Overview",
    state: "healthy",
    issue: "Running on validated dataset T-45m",
    causedBy: "No direct impact from ETL quarantine",
    actionGuidance: "Safe to act",
  },
  {
    module: "Competitor Intelligence",
    state: "stale",
    issue: "Competitor mapping updates delayed 2.1 hours",
    causedBy: "ETL schema drift in Lazada source feed",
    actionGuidance: "Use caution",
  },
  {
    module: "Intelligence Command Center",
    state: "limited confidence",
    issue: "AI fallback parser active for new ad-term payloads",
    causedBy: "Malformed JSON spike in AI extraction output",
    actionGuidance: "Use caution",
  },
  {
    module: "R&D Ticket Generator",
    state: "degraded",
    issue: "Auto-ticket generation delayed for competitor complaint clusters",
    causedBy: "Competitor taxonomy job in mitigation",
    actionGuidance: "Do not act",
  },
];

export const topKpis: KpiStat[] = [
  {
    id: "api-latency",
    title: "API Latency Tracker",
    value: "p50 460ms | p95 2.7s | p99 5.9s",
    subValue: "Warning: p95 > 2s. Critical window breached once in last hour.",
    state: "degraded",
  },
  {
    id: "error-rate",
    title: "Error Rate Monitor",
    value: "2.4% (5xx 1.1%)",
    subValue: "Failed requests: 1,124 / 46,890",
    state: "degraded",
  },
  {
    id: "pipeline-success",
    title: "Pipeline Success Rate",
    value: "93.8% today",
    subValue: "75 successful / 80 scheduled runs",
    state: "degraded",
  },
  {
    id: "freshness",
    title: "Data Freshness Monitor",
    value: "Lag 2h 12m",
    subValue: "Freshness SLA: 90 minutes",
    state: "stale",
  },
  {
    id: "delivery",
    title: "Dashboard Availability Monitor",
    value: "99.38%",
    subValue: "Target 99.5%, impacted by one partial outage",
    state: "degraded",
  },
  {
    id: "active-incidents",
    title: "Active Incidents",
    value: "4 open (1 P1, 1 P2, 2 P3)",
    subValue: "1 acknowledged, 2 investigating, 1 mitigated",
    state: "degraded",
  },
  {
    id: "self-healing",
    title: "Self-Healing Actions Today",
    value: "31 actions",
    subValue: "Retries 14 | Quarantines 4 | Restarts 8 | Fallback switches 5",
    state: "healthy",
  },
  {
    id: "ai-quality",
    title: "AI Quality Health",
    value: "Fallback 11.6% | Malformed JSON 3.9%",
    subValue: "Confidence trend down 4.8 points vs yesterday",
    state: "limited confidence",
  },
];

export const latencyTrend: TrendPoint[] = [
  { time: "09:00", value: 1640, secondary: 450, tertiary: 3420 },
  { time: "09:30", value: 1820, secondary: 470, tertiary: 3610 },
  { time: "10:00", value: 2050, secondary: 490, tertiary: 3900 },
  { time: "10:30", value: 2380, secondary: 500, tertiary: 4200 },
  { time: "11:00", value: 2710, secondary: 530, tertiary: 5900 },
  { time: "11:30", value: 2890, secondary: 550, tertiary: 6100 },
  { time: "12:00", value: 2440, secondary: 510, tertiary: 5400 },
  { time: "12:30", value: 2210, secondary: 490, tertiary: 5200 },
  { time: "13:00", value: 1980, secondary: 475, tertiary: 4600 },
  { time: "13:30", value: 1930, secondary: 468, tertiary: 4550 },
  { time: "14:00", value: 2020, secondary: 472, tertiary: 4680 },
  { time: "14:30", value: 2140, secondary: 481, tertiary: 4890 },
];

export const incidentSeverityBreakdown: TrendPoint[] = [
  { time: "P1", value: 1, secondary: 0, tertiary: 0 },
  { time: "P2", value: 1, secondary: 1, tertiary: 0 },
  { time: "P3", value: 2, secondary: 3, tertiary: 1 },
  { time: "P4", value: 0, secondary: 2, tertiary: 4 },
  { time: "P5", value: 0, secondary: 1, tertiary: 3 },
];

export const pipelineSuccessTrend: TrendPoint[] = [
  { time: "Mon", value: 98.4, secondary: 11 },
  { time: "Tue", value: 99.1, secondary: 8 },
  { time: "Wed", value: 97.8, secondary: 15 },
  { time: "Thu", value: 96.9, secondary: 19 },
  { time: "Fri", value: 95.2, secondary: 24 },
  { time: "Sat", value: 94.6, secondary: 28 },
  { time: "Sun", value: 93.8, secondary: 31 },
];

export const freshnessLagTrend: TrendPoint[] = [
  { time: "08:00", value: 38 },
  { time: "09:00", value: 46 },
  { time: "10:00", value: 64 },
  { time: "11:00", value: 79 },
  { time: "12:00", value: 96 },
  { time: "13:00", value: 112 },
  { time: "14:00", value: 132 },
];

export const pipelineReliabilityRows: PipelineMetricRow[] = [
  {
    metric: "Retry volume tracker",
    value: "31 retries / day",
    threshold: "<= 20 / day",
    trend: "up",
    state: "degraded",
  },
  {
    metric: "Processing delay monitor",
    value: "Average delay 42 min",
    threshold: "<= 20 min",
    trend: "up",
    state: "degraded",
  },
  {
    metric: "Source completeness monitor",
    value: "93.4%",
    threshold: ">= 95%",
    trend: "down",
    state: "degraded",
  },
  {
    metric: "Validation pass rate",
    value: "96.1%",
    threshold: ">= 98%",
    trend: "down",
    state: "degraded",
  },
  {
    metric: "Null rate",
    value: "5.6%",
    threshold: "<= 5%",
    trend: "up",
    state: "degraded",
  },
  {
    metric: "Duplicate rate",
    value: "1.3%",
    threshold: "<= 1%",
    trend: "up",
    state: "degraded",
  },
  {
    metric: "Schema drift checker",
    value: "2 breaking drifts detected",
    threshold: "0 breaking drifts",
    trend: "up",
    state: "degraded",
  },
];

export const aiReliabilityRows: AIReliabilityRow[] = [
  {
    metric: "Malformed JSON rate",
    value: "3.9%",
    threshold: "<= 3%",
    state: "degraded",
    note: "Spike linked to new marketplace attributes.",
  },
  {
    metric: "Fallback rate",
    value: "11.6%",
    threshold: "<= 10%",
    state: "limited confidence",
    note: "Parser fallback active on competitor term payloads.",
  },
  {
    metric: "Token usage anomaly",
    value: "+18% vs baseline",
    threshold: "<= +10%",
    state: "degraded",
    note: "Prompt expansion due to unseen ad descriptors.",
  },
  {
    metric: "Uncategorized volume",
    value: "8.4%",
    threshold: "<= 6%",
    state: "degraded",
    note: "Needs taxonomy refresh.",
  },
  {
    metric: "Confidence score average",
    value: "0.78",
    threshold: ">= 0.82",
    state: "limited confidence",
    note: "Low-confidence suppression rule triggered 9 times.",
  },
  {
    metric: "Prompt quality tracker",
    value: "87/100",
    threshold: ">= 90/100",
    state: "degraded",
    note: "Prompt drift due to multilingual slang.",
  },
  {
    metric: "Language detection failure monitor",
    value: "1.9%",
    threshold: "<= 1%",
    state: "degraded",
    note: "Taglish edge-cases increased over weekend.",
  },
  {
    metric: "AI classification health",
    value: "Amber",
    threshold: "Green",
    state: "limited confidence",
    note: "Human review required for high-risk recommendations.",
  },
];

export const deliveryReliabilityRows: DeliveryMetricRow[] = [
  {
    metric: "Dashboard availability",
    value: "99.38%",
    threshold: ">= 99.5%",
    state: "degraded",
    affectedTeams: "Market Operations, Product Supply",
  },
  {
    metric: "Widget failure rate",
    value: "1.8%",
    threshold: "<= 1.2%",
    state: "degraded",
    affectedTeams: "Competitor Intelligence users",
  },
  {
    metric: "Page response time",
    value: "p95 2.7s",
    threshold: "<= 2.0s",
    state: "degraded",
    affectedTeams: "All dashboard users",
  },
  {
    metric: "Stale-data indicator breaches",
    value: "3 active banners",
    threshold: "0",
    state: "stale",
    affectedTeams: "Competitor Intelligence, R&D",
  },
];

export const incidentSummaries: IncidentSummary[] = [
  {
    id: "INC-2841",
    title: "ETL validation breach caused by schema drift in Lazada source feed",
    severity: "P1",
    status: "investigating",
    ownerId: "de-ken",
    source: "ETL",
    affectedComponent: "Competitor mapping transformer",
    detectedTime: "2026-03-16 10:12",
    lastUpdate: "2026-03-16 14:31",
    recoveryTarget: "2026-03-16 15:00",
    affectedBusinessModule: "Competitor Intelligence",
    currentWorkaround: "Last known good dataset is active for competitor mappings.",
    targetRecoveryTime: "45 minutes",
    incidentAge: "4h 19m",
    detectionRule:
      "Schema drift detected on required fields + source completeness < 95%",
    fallbackState: "Fallback dataset active; publish held for fresh batch.",
    manualHandoffCondition:
      "Escalate after 3 safe reruns if schema mismatch persists.",
    stakeholderImpact:
      "Competitor trends partially stale; brand-level decisions still available.",
  },
  {
    id: "INC-2838",
    title: "AI malformed JSON spike in classification output",
    severity: "P2",
    status: "acknowledged",
    ownerId: "ai-jules",
    source: "AI",
    affectedComponent: "AI extraction service",
    detectedTime: "2026-03-16 09:41",
    lastUpdate: "2026-03-16 14:15",
    recoveryTarget: "2026-03-16 15:20",
    affectedBusinessModule: "Intelligence Command Center",
    currentWorkaround: "Suppress low-confidence AI output and route for review.",
    targetRecoveryTime: "65 minutes",
    incidentAge: "4h 50m",
    detectionRule: "Malformed JSON > 3% and fallback rate > 10%",
    fallbackState: "Rule-based fallback parser active on high-risk outputs.",
    manualHandoffCondition:
      "Escalate to Ops Manager if confidence < 0.75 for 3 windows.",
    stakeholderImpact:
      "Agentic recommendations visible but marked limited confidence.",
  },
  {
    id: "INC-2834",
    title: "Dashboard API p95 latency above warning threshold",
    severity: "P3",
    status: "mitigated",
    ownerId: "ops-maria",
    source: "Dashboard/API",
    affectedComponent: "Analytics API gateway",
    detectedTime: "2026-03-16 11:22",
    lastUpdate: "2026-03-16 14:26",
    recoveryTarget: "2026-03-16 15:05",
    affectedBusinessModule: "Brand Overview",
    currentWorkaround: "Rate-limiting policy tuned for non-critical widgets.",
    targetRecoveryTime: "30 minutes",
    incidentAge: "3h 9m",
    detectionRule: "p95 latency exceeds 2 seconds",
    fallbackState: "Cache-first route enabled for trend widgets.",
    manualHandoffCondition: "Escalate if p95 > 5s for 2 consecutive windows.",
    stakeholderImpact:
      "Short UI delays in brand screen, no data quality compromise.",
  },
  {
    id: "INC-2829",
    title: "Source/API connector timeout for regional feed",
    severity: "P3",
    status: "manual handoff required",
    ownerId: "de-ken",
    source: "Source/API",
    affectedComponent: "Regional connector worker",
    detectedTime: "2026-03-16 08:57",
    lastUpdate: "2026-03-16 13:58",
    recoveryTarget: "2026-03-16 16:00",
    affectedBusinessModule: "R&D Ticket Generator",
    currentWorkaround: "Retry exhausted; batch held in quarantine.",
    targetRecoveryTime: "90 minutes",
    incidentAge: "5h 34m",
    detectionRule: "Connector retries exceeded 3 attempts",
    fallbackState: "Downstream ETL runs with reduced source completeness.",
    manualHandoffCondition:
      "Manual credential check and source endpoint validation required.",
    stakeholderImpact: "R&D ticket generation delayed for one region.",
  },
];

export const incidentDetails: IncidentDetail[] = incidentSummaries.map(
  (incident: IncidentSummary): IncidentDetail => {
    if (incident.id === "INC-2841") {
      return {
        ...incident,
        timeline: [
          {
            timestamp: "2026-03-16 10:12",
            event: "Schema drift detected in Lazada feed (new attr: adTagType).",
            actor: "Rule Engine",
            state: "detected",
          },
          {
            timestamp: "2026-03-16 10:13",
            event: "Incident declared P1 and bridge opened.",
            actor: "Operations Manager",
            state: "acknowledged",
          },
          {
            timestamp: "2026-03-16 10:15",
            event: "Batch quarantined; publish gate set to HOLD.",
            actor: "Automation Script",
            state: "auto-action",
          },
          {
            timestamp: "2026-03-16 10:20",
            event: "Fallback switched to last known good dataset for competitor views.",
            actor: "Automation Script",
            state: "auto-action",
          },
          {
            timestamp: "2026-03-16 10:31",
            event: "Data Engineer assigned; schema patch branch started.",
            actor: "Ops Commander",
            state: "handoff",
          },
          {
            timestamp: "2026-03-16 11:40",
            event: "Safe-path ETL rerun completed; validation still failing on duplicates.",
            actor: "Data Engineer",
            state: "mitigation",
          },
          {
            timestamp: "2026-03-16 13:55",
            event: "RCA opened and CAP tasks drafted.",
            actor: "Project Manager",
            state: "rca",
          },
        ],
        autoActionsAttempted: [
          "Retry job up to 3 times",
          "Quarantine batch with schema mismatch",
          "Switch to last known good dataset",
          "Hold publish until validation passes",
          "Rerun ETL job with safe path",
          "Degrade only impacted modules",
        ],
        currentSystemState:
          "Ingestion live, ETL degraded, publish held for new competitor mapping batch, fallback active on Competitor Intelligence.",
        businessImpactNotes: [
          "Competitor Intelligence is partially stale.",
          "Brand Overview remains available with last known good dataset.",
          "Intelligence Command Center warnings shown for limited confidence.",
          "R&D Ticket Generator delayed for competitor-linked complaints.",
        ],
        rcaItems: [
          {
            id: "RCA-1",
            why: "Upstream Lazada feed introduced `adTagType` and changed `productAttributeMap` structure without notice.",
            correctiveControl:
              "Add schema version contract checks and blocking alerts before transformation.",
            ownerRole: "Data Engineer",
          },
          {
            id: "RCA-2",
            why: "Duplicate guardrail failed to suppress malformed key collisions in safe-path rerun.",
            correctiveControl:
              "Add hash-based dedupe with schema-aware fallback mapping.",
            ownerRole: "Operations Manager",
          },
        ],
        capTasks: [
          {
            id: "CAP-41",
            title: "Implement adaptive schema mapping suggestion pipeline for new marketplace attributes.",
            ownerRole: "Data Engineer",
            dueDate: "2026-03-20",
            status: "in-progress",
          },
          {
            id: "CAP-42",
            title: "Add pre-publish canary validation for competitor taxonomy transforms.",
            ownerRole: "Operations Manager",
            dueDate: "2026-03-19",
            status: "open",
          },
          {
            id: "CAP-43",
            title: "Update runbook with explicit handoff checkpoint after third failed rerun.",
            ownerRole: "Project Manager",
            dueDate: "2026-03-18",
            status: "open",
          },
        ],
        linkedRunbookIds: ["RB-ETL", "RB-SOURCE"],
        linkedAlertIds: ["AL-004", "AL-005", "AL-006", "AL-010"],
        eventLog: [
          {
            timestamp: "2026-03-16 10:12:03",
            stream: "etl.validation",
            message:
              "Schema drift detected: required field `productAttributeMap` type mismatch (string -> object).",
          },
          {
            timestamp: "2026-03-16 10:12:09",
            stream: "alerts.router",
            message:
              "Alert AL-004 fired: source completeness below 95%. Action Group AG-P1-P2 engaged.",
          },
          {
            timestamp: "2026-03-16 10:15:22",
            stream: "selfheal.runner",
            message:
              "Action executed: quarantine batch and hold publish gate for dataset build 2026.03.16.03.",
          },
          {
            timestamp: "2026-03-16 10:20:14",
            stream: "delivery.gateway",
            message:
              "Fallback activated: competitor dashboard now serving dataset build 2026.03.15.22.",
          },
          {
            timestamp: "2026-03-16 13:54:02",
            stream: "incident.command",
            message: "RCA opened by PM. CAP tasks CAP-41..43 created.",
          },
        ],
      };
    }

    return {
      ...incident,
      timeline: [
        {
          timestamp: incident.detectedTime,
          event: "Incident detected through alerting pipeline.",
          actor: "Rule Engine",
          state: "detected",
        },
        {
          timestamp: incident.lastUpdate,
          event: "Status updated and owner confirmed.",
          actor: "Operations Manager",
          state: "acknowledged",
        },
      ],
      autoActionsAttempted: [
        "Retry connector up to 3 times",
        "Restart stateless worker",
      ],
      currentSystemState: incident.currentWorkaround,
      businessImpactNotes: [incident.stakeholderImpact],
      rcaItems: [],
      capTasks: [],
      linkedRunbookIds: [],
      linkedAlertIds: [],
      eventLog: [],
    };
  },
);

export const alertRules: AlertRule[] = [
  {
    id: "AL-001",
    name: "p95 latency exceeds 2s",
    severity: "P3",
    metric: "API p95 latency",
    threshold: "> 2s over 1 window",
    notificationPath: "Ops Manager -> Data Engineer",
    actionGroup: "AG-P3",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 14:20",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-002",
    name: "p95 latency exceeds 5s for 2 consecutive windows",
    severity: "P1",
    metric: "API p95 latency",
    threshold: "> 5s over 2 windows",
    notificationPath: "Ops Manager + Incident Bridge + SMS",
    actionGroup: "AG-P1-P2",
    autoActionEnabled: true,
    lastTriggered: "2026-03-15 21:14",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-003",
    name: "error rate exceeds 2%",
    severity: "P2",
    metric: "5xx error rate",
    threshold: "> 2%",
    notificationPath: "Ops Manager -> Data Engineer -> AI Engineer",
    actionGroup: "AG-P1-P2",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 13:58",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-004",
    name: "source completeness below 95%",
    severity: "P1",
    metric: "Source completeness",
    threshold: "< 95%",
    notificationPath: "Ops Manager + Data Engineer",
    actionGroup: "AG-P1-P2",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 10:12",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-005",
    name: "null rate above 5%",
    severity: "P2",
    metric: "Null rate",
    threshold: "> 5%",
    notificationPath: "Data Engineer + Ops Manager",
    actionGroup: "AG-P1-P2",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 10:28",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-006",
    name: "duplicate rate above 1%",
    severity: "P2",
    metric: "Duplicate rate",
    threshold: "> 1%",
    notificationPath: "Data Engineer",
    actionGroup: "AG-P2",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 11:05",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-007",
    name: "malformed JSON above 3%",
    severity: "P2",
    metric: "Malformed JSON rate",
    threshold: "> 3%",
    notificationPath: "AI Engineer + Ops Manager",
    actionGroup: "AG-P2-AI",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 09:41",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-008",
    name: "fallback rate above 10%",
    severity: "P2",
    metric: "AI fallback rate",
    threshold: "> 10%",
    notificationPath: "AI Engineer -> Ops Manager",
    actionGroup: "AG-P2-AI",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 09:44",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-009",
    name: "dashboard availability below 99.5%",
    severity: "P2",
    metric: "Dashboard availability",
    threshold: "< 99.5%",
    notificationPath: "Ops Manager + Project Manager",
    actionGroup: "AG-P2-Delivery",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 13:10",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-010",
    name: "freshness breach beyond SLA",
    severity: "P1",
    metric: "Freshness SLA lag",
    threshold: "> 90 min",
    notificationPath: "Ops Manager + Data Engineer + PM",
    actionGroup: "AG-P1-P2",
    autoActionEnabled: true,
    lastTriggered: "2026-03-16 10:16",
    enabled: true,
    controlTier: "Current core control",
  },
  {
    id: "AL-011",
    name: "adaptive threshold tuning suggestion",
    severity: "P4",
    metric: "Threshold drift predictor",
    threshold: "advisory only",
    notificationPath: "Ops Manager review queue",
    actionGroup: "AG-ADVISORY",
    autoActionEnabled: false,
    lastTriggered: "2026-03-14 12:20",
    enabled: false,
    controlTier: "Future enhanced control",
  },
  {
    id: "AL-012",
    name: "business impact confidence downgrade predictor",
    severity: "P4",
    metric: "Trust-impact model",
    threshold: "advisory only",
    notificationPath: "Project Manager + Ops Manager",
    actionGroup: "AG-ADVISORY",
    autoActionEnabled: false,
    lastTriggered: "Never",
    enabled: false,
    controlTier: "Future enhanced control",
  },
];

export const selfHealingActions: SelfHealingAction[] = [
  {
    timestamp: "2026-03-16 14:12",
    triggerCondition: "Source/API timeout > 20s",
    actionTaken: "Retry failed connector (attempt 2/3)",
    serviceAffected: "Source/API ingestion",
    result: "success",
  },
  {
    timestamp: "2026-03-16 13:55",
    triggerCondition: "Malformed JSON > 3%",
    actionTaken: "Suppress low-confidence AI output",
    serviceAffected: "AI Inference",
    result: "partial",
  },
  {
    timestamp: "2026-03-16 13:44",
    triggerCondition: "Stateless worker memory spike",
    actionTaken: "Restart stateless worker",
    serviceAffected: "ETL / Validation",
    result: "success",
  },
  {
    timestamp: "2026-03-16 13:20",
    triggerCondition: "Schema drift rule violation",
    actionTaken: "Quarantine batch and hold publish",
    serviceAffected: "ETL / Validation",
    result: "success",
  },
  {
    timestamp: "2026-03-16 13:16",
    triggerCondition: "Freshness SLA breach > 90m",
    actionTaken: "Switch to last known good dataset",
    serviceAffected: "Dashboard Delivery",
    result: "success",
  },
  {
    timestamp: "2026-03-16 12:58",
    triggerCondition: "Dashboard widget failure > 1%",
    actionTaken: "Degrade affected module only (Competitor Intelligence)",
    serviceAffected: "Dashboard Delivery",
    result: "success",
  },
];

export const runbooks: Runbook[] = [
  {
    id: "RB-SOURCE",
    domain: "Source/API incident runbook",
    triggerCondition: "Source/API feed down, timeout spikes, completeness < 95%",
    firstResponse: "Confirm feed heartbeat and authentication status.",
    automatedAction: "Retry connector up to 3 times with backoff.",
    manualEscalationCondition:
      "Escalate if retries exhausted or provider rejects credentials.",
    ownerRole: "Data Engineer",
    validationBeforeClosure:
      "Two successful source pulls and no retry alerts for 30 minutes.",
    severityMapping: "P1 when all feeds affected; P2 for major source; P3 partial.",
    responseTarget: "15 min ack, 45 min mitigation",
    escalationOwner: "Operations Manager",
    notificationMethod: "Email + SMS + Teams webhook",
    autoActionAllowed: true,
  },
  {
    id: "RB-LAKE",
    domain: "Data lake landing runbook",
    triggerCondition: "Landing checksum failure or delayed write confirmation",
    firstResponse: "Validate object arrival and storage path policy.",
    automatedAction: "Rerun ingest mover with safe path and checksum recheck.",
    manualEscalationCondition: "Escalate if checksum still mismatched after rerun.",
    ownerRole: "Data Engineer",
    validationBeforeClosure:
      "Landing partition checks pass and batch available to ETL.",
    severityMapping: "P1 if all partitions blocked; P2 if partial.",
    responseTarget: "15 min ack, 60 min recovery",
    escalationOwner: "Operations Manager",
    notificationMethod: "Teams + email",
    autoActionAllowed: true,
  },
  {
    id: "RB-ETL",
    domain: "ETL / validation runbook",
    triggerCondition:
      "Schema drift, null/duplicate spikes, validation pass-rate failure",
    firstResponse: "Freeze publish and inspect drift diff report.",
    automatedAction: "Quarantine batch, hold publish, rerun ETL safe path.",
    manualEscalationCondition:
      "Escalate after 3 failed reruns or when business-critical fields drift.",
    ownerRole: "Data Engineer",
    validationBeforeClosure:
      "Validation > 98%, duplicates < 1%, nulls <= 5% on rerun.",
    severityMapping: "P1 if trust-critical dashboard affected; else P2/P3.",
    responseTarget: "10 min ack, 45 min containment",
    escalationOwner: "Operations Manager",
    notificationMethod: "Teams bridge + SMS for P1/P2",
    autoActionAllowed: true,
  },
  {
    id: "RB-AI",
    domain: "AI inference runbook",
    triggerCondition:
      "Malformed JSON, fallback spike, low confidence, language failure spike",
    firstResponse: "Pin last known good prompt version and inspect payload sample.",
    automatedAction: "Suppress low-confidence output and enable fallback parser.",
    manualEscalationCondition:
      "Escalate when confidence < 0.75 for 3 windows or critical outputs affected.",
    ownerRole: "AI Engineer",
    validationBeforeClosure:
      "Malformed JSON <= 3%, fallback <= 10%, confidence >= 0.82.",
    severityMapping: "P2 for broad impact, P3 for isolated category degradation.",
    responseTarget: "15 min ack, 60 min stabilization",
    escalationOwner: "Operations Manager",
    notificationMethod: "Teams + webhook",
    autoActionAllowed: true,
  },
  {
    id: "RB-DASH",
    domain: "Dashboard / API runbook",
    triggerCondition: "Availability < 99.5%, latency > threshold, stale banner breach",
    firstResponse: "Verify API health and cache layer behavior.",
    automatedAction: "Switch read path to cache and degrade impacted module only.",
    manualEscalationCondition:
      "Escalate if p95 > 5s for 2 windows or full page outage occurs.",
    ownerRole: "Operations Manager",
    validationBeforeClosure:
      "Availability and freshness restored; all critical widgets load normally.",
    severityMapping: "P1 for full outage, P2 for major view degradation, P3 minor.",
    responseTarget: "5 min ack, 30 min mitigation",
    escalationOwner: "Project Manager",
    notificationMethod: "Action Group + Teams status updates",
    autoActionAllowed: true,
  },
];

export const thresholds: MonitoringThreshold[] = [
  {
    id: "th-latency-warning",
    label: "p95 latency warning threshold",
    unit: "seconds",
    currentValue: 2,
    recommendedRange: "1.5 - 2.5",
  },
  {
    id: "th-latency-critical",
    label: "p95 latency critical threshold",
    unit: "seconds",
    currentValue: 5,
    recommendedRange: "4.5 - 6",
  },
  {
    id: "th-error-rate",
    label: "Error rate threshold",
    unit: "%",
    currentValue: 2,
    recommendedRange: "1 - 2.5",
  },
  {
    id: "th-freshness",
    label: "Freshness SLA threshold",
    unit: "minutes",
    currentValue: 90,
    recommendedRange: "60 - 120",
  },
  {
    id: "th-null-rate",
    label: "Null rate threshold",
    unit: "%",
    currentValue: 5,
    recommendedRange: "2 - 5",
  },
  {
    id: "th-duplicate-rate",
    label: "Duplicate rate threshold",
    unit: "%",
    currentValue: 1,
    recommendedRange: "0.5 - 1",
  },
  {
    id: "th-malformed-json",
    label: "Malformed JSON threshold",
    unit: "%",
    currentValue: 3,
    recommendedRange: "1.5 - 3",
  },
  {
    id: "th-fallback-rate",
    label: "Fallback threshold",
    unit: "%",
    currentValue: 10,
    recommendedRange: "6 - 10",
  },
  {
    id: "th-dashboard-availability",
    label: "Dashboard availability threshold",
    unit: "%",
    currentValue: 99.5,
    recommendedRange: "99.3 - 99.9",
  },
];

export const raciTasks: RaciTask[] = [
  {
    task: "Detect alert and declare severity",
    operationsManager: "A/R",
    dataEngineer: "C",
    aiEngineer: "C",
    projectManager: "I",
  },
  {
    task: "Open incident bridge and assign owner",
    operationsManager: "A/R",
    dataEngineer: "C",
    aiEngineer: "C",
    projectManager: "I",
  },
  {
    task: "Pause publish and enable fallback dataset",
    operationsManager: "A",
    dataEngineer: "R",
    aiEngineer: "C",
    projectManager: "I",
  },
  {
    task: "Restore ingestion or source connection",
    operationsManager: "A",
    dataEngineer: "R",
    aiEngineer: "I",
    projectManager: "I",
  },
  {
    task: "Restore ETL or validation job",
    operationsManager: "A",
    dataEngineer: "R",
    aiEngineer: "I",
    projectManager: "I",
  },
  {
    task: "Restore AI extraction, prompt, or output logic",
    operationsManager: "A",
    dataEngineer: "I",
    aiEngineer: "R",
    projectManager: "I",
  },
  {
    task: "Validate dashboard freshness and usability",
    operationsManager: "A",
    dataEngineer: "R",
    aiEngineer: "C",
    projectManager: "I",
  },
  {
    task: "Send incident status updates",
    operationsManager: "R",
    dataEngineer: "I",
    aiEngineer: "I",
    projectManager: "A",
  },
  {
    task: "Approve incident closure",
    operationsManager: "A/R",
    dataEngineer: "C",
    aiEngineer: "C",
    projectManager: "I",
  },
  {
    task: "Complete RCA and CAP",
    operationsManager: "A",
    dataEngineer: "R",
    aiEngineer: "R",
    projectManager: "C",
  },
];

export const opportunityCards: OpportunityCard[] = [
  {
    id: "OP-001",
    title: "AI-assisted incident summarization",
    summary: "Summarize timelines and business impact into briefing-ready updates.",
    stage: "Available Next",
  },
  {
    id: "OP-002",
    title: "Root-cause suggestion panel",
    summary: "Suggest probable fault domains from correlated metrics and logs.",
    stage: "Available Next",
  },
  {
    id: "OP-003",
    title: "Runbook recommendation engine",
    summary: "Rank likely runbooks based on alert signatures and current state.",
    stage: "Available Next",
  },
  {
    id: "OP-004",
    title: "RCA draft generation",
    summary: "Auto-populate first RCA draft with timeline evidence and controls.",
    stage: "Available Next",
  },
  {
    id: "OP-005",
    title: "Alert grouping and deduplication",
    summary: "Cluster noisy alerts into incident-centric bundles for fast triage.",
    stage: "Available Next",
  },
  {
    id: "OP-006",
    title: "Smart schema mapping suggestion",
    summary:
      "Suggest schema mapping updates for new ad terms and attributes without ETL disruption.",
    stage: "Available Next",
  },
  {
    id: "OP-007",
    title: "Guided manual handoff recommendations",
    summary:
      "Suggest next manual response steps when scripted recovery is exhausted.",
    stage: "Available Next",
  },
  {
    id: "OP-008",
    title: "Insight Trust Score",
    summary: "Compute trust posture per module based on freshness, quality, and fallback.",
    stage: "Future Enhancements",
  },
  {
    id: "OP-009",
    title: "Decision Safety Mode",
    summary: "Gate sensitive agent recommendations when trust posture is weak.",
    stage: "Future Enhancements",
  },
  {
    id: "OP-010",
    title: "Downstream Impact Map",
    summary: "Graph technical incidents against affected decisions and stakeholders.",
    stage: "Future Enhancements",
  },
  {
    id: "OP-011",
    title: "Selective fallback by module",
    summary:
      "Fine-grained fallback so unaffected dashboards stay live with full confidence.",
    stage: "Future Enhancements",
  },
  {
    id: "OP-012",
    title: "Policy-aware action gating",
    summary:
      "Enforce approvals before agent suggestions are promoted to production actions.",
    stage: "Future Enhancements",
  },
];

export const overviewArchitectureLayers: string[] = [
  "Source feeds: Lazada, e-commerce reviews, surveys, service channels",
  "Pipeline: Ingestion -> Data Lake Landing -> ETL / Validation -> AI Inference",
  "Serving: Dashboard/API + module-level fallback controls",
  "Observability backbone: Azure Monitor, Application Insights, Log Analytics, Azure Alerts / Action Groups",
];

export const brandOverviewCards = [
  {
    title: "Market Operations",
    metric: "Real-time review velocity",
    value: "14,820 reviews / 24h",
    note: "Data confidence: high. Last publish 34 minutes ago.",
  },
  {
    title: "R&D",
    metric: "Formulation complaint clusters",
    value: "27 active clusters",
    note: "Competitor-linked clusters delayed by stale mapping.",
  },
  {
    title: "Product Supply",
    metric: "Urgent supply-impact issues",
    value: "6 high-priority SKUs",
    note: "Demand signals healthy; competitor attribution caution applies.",
  },
];

export const competitorTrend: TrendPoint[] = [
  { time: "W1", value: 4.1, secondary: 4.3, tertiary: 4.0 },
  { time: "W2", value: 4.2, secondary: 4.4, tertiary: 3.9 },
  { time: "W3", value: 4.0, secondary: 4.2, tertiary: 3.8 },
  { time: "W4", value: 4.1, secondary: 4.1, tertiary: 3.9 },
];

export const competitorMappingRows = [
  {
    company: "Unilever",
    brand: "Surf",
    product: "Surf Excel Liquid",
    mappedSku: "COMP-SURF-0041",
    state: "healthy",
  },
  {
    company: "Unilever",
    brand: "Breeze",
    product: "Breeze Color Care",
    mappedSku: "COMP-BREEZE-0082",
    state: "healthy",
  },
  {
    company: "Lion",
    brand: "Attack",
    product: "Attack Plus Aroma",
    mappedSku: "Pending refresh",
    state: "stale",
  },
];

export const commandCenterCards = [
  {
    id: "cc-1",
    title: "Brand switching early warning",
    detail: "Switch-risk index up 9% in Metro clusters.",
    action: "Investigate switching drivers in competitor promo windows.",
  },
  {
    id: "cc-2",
    title: "Promo opportunity signal",
    detail: "Laundry pods campaign could recover 2.1pp share.",
    action: "Adjust promo mix and prioritize high-intent channels.",
  },
  {
    id: "cc-3",
    title: "Revenue at risk",
    detail: "Estimated at-risk monthly revenue: $420K if competitor drift persists.",
    action: "Trigger targeted retention offer test.",
  },
];

export const autonomousDecisionLog = [
  {
    timestamp: "2026-03-16 13:48",
    action: "Suggested promo uplift for Tide Ultra Care",
    state: "Awaiting approval",
  },
  {
    timestamp: "2026-03-16 12:55",
    action: "Generated R&D complaint brief for scent durability",
    state: "Approved",
  },
  {
    timestamp: "2026-03-16 11:40",
    action: "Held competitor campaign recommendation due to limited confidence",
    state: "Guardrail applied",
  },
];

export const ownerById = Object.fromEntries(
  owners.map((owner: Owner): [string, Owner] => [owner.id, owner]),
);

