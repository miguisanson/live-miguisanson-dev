import * as React from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BadgeAlert, Bot, GitBranch, PlayCircle, ShieldCheck } from "lucide-react";
import {
  freshnessLagTrend,
  latencyTrend,
  serviceHealthSummary,
} from "../data/mock-data";
import { useDemoData, useOwners, type BottleneckSignal } from "../context/demo-data-context";
import { useDemoFeedback } from "../context/demo-feedback";
import { useOpportunityMode } from "../context/opportunity-mode";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog } from "../components/ui/dialog";
import { Select } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { HealthStrip } from "../components/common/health-strip";
import { KpiCard } from "../components/common/kpi-card";
import { PageHeader } from "../components/common/page-header";
import { StatusChip } from "../components/common/status-chip";
import { HelpTip } from "../components/help/help-tip";
import { QuickInsightAction } from "../components/common/quick-insight-action";
import type { KpiStat } from "../types/models";

function toMinutes(from: string, to: string): number {
  const fromDate = new Date(from.replace(" ", "T"));
  const toDate = new Date(to.replace(" ", "T"));
  const diff = Math.max(0, toDate.getTime() - fromDate.getTime());
  return Math.round(diff / 60000);
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function trendStateColor(status: "success" | "failed" | "running" | "blocked"): "success" | "danger" | "warning" | "default" {
  if (status === "success") {
    return "success";
  }
  if (status === "failed") {
    return "danger";
  }
  if (status === "running") {
    return "warning";
  }
  return "default";
}

const bottleneckLabels: Record<BottleneckSignal["status"], string> = {
  open: "Open",
  investigating: "Investigating",
  mitigated: "Mitigated",
};

export function OperationsPage(): React.ReactElement {
  const {
    incidents,
    selfHealingLog,
    tickets,
    moduleImpact,
    bottlenecks,
    pipelineRuns,
    acknowledgeIncident,
    runSelfHealingWorkflow,
    createManualHandoffTicket,
    setBottleneckStatus,
    rerunPipeline,
  } = useDemoData();
  const owners = useOwners();
  const { notify } = useDemoFeedback();
  const { enabled, setEnabled } = useOpportunityMode();

  const [selectedBottleneck, setSelectedBottleneck] = React.useState<BottleneckSignal | null>(null);
  const [pipelineEnvironment, setPipelineEnvironment] = React.useState<"Dev" | "Staging" | "Demo" | "all">("all");

  const recentRuns = pipelineRuns.filter((run) => {
    if (pipelineEnvironment === "all") {
      return true;
    }
    return run.environment === pipelineEnvironment;
  });
  const latestRun = recentRuns[0];

  const restored = incidents.filter(
    (incident) => incident.resolvedAt || incident.status === "auto-recovered",
  );
  const mttrMinutes =
    restored.length === 0
      ? 0
      : Math.round(
          restored.reduce((sum, incident) => {
            if (!incident.resolvedAt) {
              return sum;
            }
            return sum + toMinutes(incident.detectedTime, incident.resolvedAt);
          }, 0) / restored.length,
        );

  const responded = incidents.filter((incident) => incident.respondedAt);
  const mttrRespondMinutes =
    responded.length === 0
      ? 0
      : Math.round(
          responded.reduce((sum, incident) => {
            if (!incident.respondedAt) {
              return sum;
            }
            return sum + toMinutes(incident.detectedTime, incident.respondedAt);
          }, 0) / responded.length,
        );

  const selfHealingSuccessRate =
    selfHealingLog.length === 0
      ? 0
      : selfHealingLog.filter((item) => item.result === "success").length / selfHealingLog.length;
  const manualHandoffRate = incidents.length === 0 ? 0 : tickets.length / incidents.length;
  const repeatedIncidentRate =
    incidents.length === 0
      ? 0
      : incidents.filter((incident) => incident.repeatCount >= 3).length / incidents.length;

  const kpis: KpiStat[] = [
    {
      id: "kpi-mttr-respond",
      title: "Mean Time to Respond",
      value: `${mttrRespondMinutes || 0} mins`,
      subValue: "Based on acknowledged incidents in current cycle.",
      state: mttrRespondMinutes <= 20 ? "healthy" : "degraded",
    },
    {
      id: "kpi-mttr-recover",
      title: "Mean Time to Recover",
      value: `${mttrMinutes || 0} mins`,
      subValue: "Auto-recovered and resolved incident average.",
      state: mttrMinutes <= 75 ? "healthy" : "degraded",
    },
    {
      id: "kpi-self-heal",
      title: "Self-Healing Success Rate",
      value: percent(selfHealingSuccessRate),
      subValue: "Safe scripted actions that restored service without handoff.",
      state: selfHealingSuccessRate >= 0.65 ? "healthy" : "degraded",
    },
    {
      id: "kpi-handoff",
      title: "Manual Handoff Rate",
      value: percent(manualHandoffRate),
      subValue: "Incidents requiring human intervention ticketing.",
      state: manualHandoffRate <= 0.35 ? "healthy" : "degraded",
    },
    {
      id: "kpi-repeat",
      title: "Repeated Incident Rate",
      value: percent(repeatedIncidentRate),
      subValue: "Incidents repeating in same pipeline stage.",
      state: repeatedIncidentRate <= 0.4 ? "healthy" : "degraded",
    },
  ];

  return (
    <section className="space-y-5">
      <PageHeader
        title="Operations Dashboard"
        subtitle="Reliability command center linking technical health, business trust, and human escalation."
        helpText="Workflow AI runs safe scripted recoveries first. Threshold breaches force manual handoff ticket creation."
        right={
          <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1.5">
            <span className="text-xs font-medium text-slate-700">Opportunity Mode</span>
            <Switch
              checked={enabled}
              onCheckedChange={(next) => {
                setEnabled(next);
                notify(next ? "Opportunity Mode enabled" : "Opportunity Mode disabled");
              }}
            />
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((stat) => (
          <KpiCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              API Latency and Retry Pressure
              <QuickInsightAction
                pageKey="operations"
                buttonLabel="Quick Insight"
                subject="p95 latency and retry pressure"
                contextLines={[
                  "p95 remains above warning threshold and overlaps with retry volume spikes.",
                  "Freshness delay trend indicates impact on competitor-focused outputs.",
                  "Workflow AI should attempt safe reruns before manual intervention.",
                ]}
              />
            </CardTitle>
            <CardDescription>
              Tracks latency thresholds with workflow-aware interpretation.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 min-h-[17rem]" data-testid="latency-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={latencyTrend}
                margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e8f2" />
                <XAxis dataKey="time" stroke="#6d8195" />
                <YAxis stroke="#6d8195" width={42} />
                <Tooltip />
                <Legend verticalAlign="top" height={30} />
                <Line
                  type="monotone"
                  dataKey="secondary"
                  name="p50 (ms)"
                  stroke="#003DA5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="p95 (ms)"
                  stroke="#F59E0B"
                  strokeWidth={2.2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tertiary"
                  name="p99 (ms)"
                  stroke="#8aa0b3"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              Freshness Lag Trend
              <QuickInsightAction
                pageKey="operations"
                buttonLabel="Explain This"
                subject="Freshness lag impact"
                contextLines={[
                  "Freshness lag is above SLA and tied to ETL retry bottlenecks.",
                  "Competitor modules are currently served on last known good data.",
                  "Escalate if lag remains above threshold after retry limit.",
                ]}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 min-h-[17rem]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={freshnessLagTrend} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e8f2" />
                <XAxis dataKey="time" stroke="#6d8195" />
                <YAxis stroke="#6d8195" width={30} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Lag (minutes)"
                  stroke="#003DA5"
                  fill="rgba(0,158,223,0.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health Summary</CardTitle>
          <CardDescription>Live reliability and business trust alignment.</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthStrip items={serviceHealthSummary} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Trust Linkage</CardTitle>
          <CardDescription>Technical incidents mapped to business module action safety.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Guidance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moduleImpact.map((module) => (
                <TableRow key={module.module}>
                  <TableCell>{module.module}</TableCell>
                  <TableCell>
                    <StatusChip state={module.state} />
                  </TableCell>
                  <TableCell>{module.issue}</TableCell>
                  <TableCell>{module.causedBy}</TableCell>
                  <TableCell>{module.actionGuidance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incident Command Panel</CardTitle>
            <CardDescription>
              Acknowledge, run self-healing, and escalate to manual handoff when required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="rounded-md border border-border bg-[var(--bg-soft)] p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {incident.ticketRef} - {incident.title}
                    </p>
                    <p className="text-xs text-slate-600">
                      Owner: {owners.find((owner) => owner.id === incident.ownerId)?.name ?? incident.ownerId}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusChip state={incident.severity} />
                    <StatusChip state={incident.status} />
                  </div>
                </div>
                <p className="mb-2 text-xs text-slate-700">{incident.currentWorkaround}</p>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge variant="outline">Retry {incident.retryCount}/{incident.retryLimit}</Badge>
                  <Badge variant="outline">Fallback {incident.fallbackMinutes}m</Badge>
                  <Badge variant="outline">Repeat count {incident.repeatCount}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/incidents/${incident.id}`}>
                    <Button size="sm" variant="outline">
                      Open Incident
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      acknowledgeIncident(incident.id);
                      notify("Incident acknowledged", `${incident.ticketRef} moved to acknowledged.`);
                    }}
                  >
                    Acknowledge
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const result = runSelfHealingWorkflow(incident.id);
                      notify(
                        result.outcome === "success"
                          ? "Workflow AI recovered incident"
                          : result.outcome === "failed"
                            ? "Workflow AI escalated incident"
                            : "Workflow AI action completed",
                        result.message,
                      );
                    }}
                  >
                    Run Self-Healing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const ticketId = createManualHandoffTicket(
                        incident.id,
                        "Operator requested manual handoff from command panel.",
                      );
                      notify("Manual handoff ticket created", `${ticketId} added to handoff queue.`);
                    }}
                  >
                    Escalate
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Self-Healing Workflow Log</CardTitle>
            <CardDescription>Auditable scripted actions and outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selfHealingLog.slice(0, 8).map((action) => (
                  <TableRow key={`${action.timestamp}-${action.actionTaken}`}>
                    <TableCell className="whitespace-nowrap">{action.timestamp}</TableCell>
                    <TableCell>{action.triggerCondition}</TableCell>
                    <TableCell>{action.actionTaken}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          action.result === "success"
                            ? "success"
                            : action.result === "partial"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {action.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeAlert className="h-4 w-4 text-[#003DA5]" />
            Bottlenecks and Anomalies
            <HelpTip
              title="Bottleneck and anomaly panel"
              content="Click any card to inspect stage-level impact, related incident, and mitigation status."
            />
          </CardTitle>
          <CardDescription>Detect repeated failure points and investigate pipeline bottlenecks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {bottlenecks.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setSelectedBottleneck(item)}
              className="rounded-md border border-border bg-white p-3 text-left transition hover:border-[rgba(0,158,223,0.5)]"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant={item.category === "anomaly" ? "warning" : "info"}>
                  {item.category}
                </Badge>
                <StatusChip state={item.severity} />
              </div>
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs text-slate-600">{item.signal}</p>
              <p className="mt-2 text-xs text-slate-500">Status: {bottleneckLabels[item.status]}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-[#003DA5]" />
            CI/CD Pipeline Visibility
          </CardTitle>
          <CardDescription>Simulated GitHub Actions run status and release traceability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={pipelineEnvironment}
              onChange={(event) => setPipelineEnvironment(event.target.value as "Dev" | "Staging" | "Demo" | "all")}
              aria-label="Pipeline environment filter"
            >
              <option value="all">All environments</option>
              <option value="Dev">Dev</option>
              <option value="Staging">Staging</option>
              <option value="Demo">Demo</option>
            </Select>
            {latestRun ? (
              <Button
                size="sm"
                onClick={() => {
                  const run = rerunPipeline(latestRun.id);
                  notify("Pipeline rerun triggered", `${run.id} started for ${run.environment}.`);
                }}
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Rerun
              </Button>
            ) : null}
            <QuickInsightAction
              pageKey="operations"
              buttonLabel="Summarize"
              subject="CI/CD pipeline posture"
              contextLines={[
                latestRun
                  ? `Latest run ${latestRun.id} has build ${latestRun.buildStatus}, test ${latestRun.testStatus}, deploy ${latestRun.deployStatus}.`
                  : "No pipeline run available.",
                "Rerun triggers a new simulated GitHub Actions execution.",
                "Failed steps remain visible for incident handoff context.",
              ]}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Build</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Deploy</TableHead>
                <TableHead>Failed Step</TableHead>
                <TableHead>Release</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRuns.slice(0, 6).map((run) => (
                <TableRow key={run.id}>
                  <TableCell>
                    <p className="font-mono text-xs text-slate-800">{run.id}</p>
                    <p className="text-xs text-slate-500">{run.triggeredAt}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{run.environment}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trendStateColor(run.buildStatus)}>{run.buildStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trendStateColor(run.testStatus)}>{run.testStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trendStateColor(run.deployStatus)}>{run.deployStatus}</Badge>
                  </TableCell>
                  <TableCell>{run.failedStep ?? "None"}</TableCell>
                  <TableCell>{run.releaseTag}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
            <p className="mb-1 font-semibold">Release history</p>
            <div className="flex flex-wrap gap-2">
              {pipelineRuns
                .filter((run) => run.releaseTag !== "not-released" && run.releaseTag !== "pending")
                .slice(0, 5)
                .map((run) => (
                  <Badge key={run.id} variant="info">
                    {run.releaseTag} • {run.environment}
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedBottleneck)}
        onClose={() => setSelectedBottleneck(null)}
        title={selectedBottleneck?.title ?? "Bottleneck detail"}
        description={selectedBottleneck?.stage ?? ""}
        footer={
          selectedBottleneck ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setBottleneckStatus(selectedBottleneck.id, "investigating");
                  notify("Signal moved to investigating");
                }}
              >
                Mark investigating
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setBottleneckStatus(selectedBottleneck.id, "mitigated");
                  notify("Signal marked mitigated");
                }}
              >
                Mark mitigated
              </Button>
            </div>
          ) : null
        }
      >
        {selectedBottleneck ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={selectedBottleneck.category === "anomaly" ? "warning" : "info"}>
                {selectedBottleneck.category}
              </Badge>
              <StatusChip state={selectedBottleneck.severity} />
              <Badge variant="outline">{bottleneckLabels[selectedBottleneck.status]}</Badge>
            </div>
            <p className="text-sm text-slate-800">{selectedBottleneck.signal}</p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Impact:</span> {selectedBottleneck.impact}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Suggested action:</span> {selectedBottleneck.suggestedAction}
            </p>
            <div className="rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700">
              Related incident:{" "}
              {incidents.find((incident) => incident.id === selectedBottleneck.relatedIncidentId)?.ticketRef ?? "N/A"}
            </div>
          </div>
        ) : null}
      </Dialog>

      {enabled ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#003DA5]" />
              Opportunity Mode Extensions
            </CardTitle>
            <CardDescription>Future-focused reliability ideas revealed while Opportunity Mode is ON.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-md border border-border bg-white p-3 text-sm">
              Adaptive retry policies by pipeline stage risk score.
            </div>
            <div className="rounded-md border border-border bg-white p-3 text-sm">
              AI-assisted probable root-cause clustering from incident telemetry.
            </div>
            <div className="rounded-md border border-border bg-white p-3 text-sm">
              Deployment-risk scoring tied to freshness and fallback thresholds.
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-4 text-sm text-slate-700">
            Opportunity Mode is OFF. Enable it to view next-phase reliability ideas.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex items-center gap-2 py-4 text-sm text-slate-700">
          <ShieldCheck className="h-4 w-4 text-[#003DA5]" />
          Workflow AI uses bounded scripted actions only. Manual tickets are required when safe thresholds are exceeded.
        </CardContent>
      </Card>
    </section>
  );
}
