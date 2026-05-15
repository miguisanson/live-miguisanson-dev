import * as React from "react";
import { BellRing, Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { useDemoData, type AlertRuleRecord } from "../context/demo-data-context";
import { useDemoFeedback } from "../context/demo-feedback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PageHeader } from "../components/common/page-header";
import { StatusChip } from "../components/common/status-chip";
import { QuickInsightAction } from "../components/common/quick-insight-action";

function nextAlertId(alerts: AlertRuleRecord[]): string {
  const max = alerts.reduce((value, alert) => {
    const parsed = Number(alert.id.replace("AL-", ""));
    return Number.isFinite(parsed) ? Math.max(value, parsed) : value;
  }, 0);
  return `AL-${String(max + 1).padStart(3, "0")}`;
}

function createEditableRule(base?: AlertRuleRecord): AlertRuleRecord {
  return (
    base ?? {
      id: "",
      name: "",
      severity: "P3",
      metric: "",
      threshold: "",
      notificationPath: "Ops Manager -> Data Engineer",
      actionGroup: "AG-P3",
      autoActionEnabled: true,
      lastTriggered: "Never",
      enabled: true,
      controlTier: "Current core control",
      acknowledged: false,
      acknowledgedAt: null,
    }
  );
}

export function AlertsPage(): React.ReactElement {
  const {
    alerts,
    bottlenecks,
    addAlertRule,
    updateAlertRule,
    acknowledgeAlert,
    deleteAlert,
  } = useDemoData();
  const { notify } = useDemoFeedback();
  const [query, setQuery] = React.useState<string>("");
  const [tier, setTier] = React.useState<string>("all");
  const [editorOpen, setEditorOpen] = React.useState<boolean>(false);
  const [isNewRule, setIsNewRule] = React.useState<boolean>(false);
  const [editableRule, setEditableRule] = React.useState<AlertRuleRecord>(createEditableRule());

  const filtered = alerts.filter((rule) => {
    const matchQuery =
      rule.name.toLowerCase().includes(query.toLowerCase()) ||
      rule.metric.toLowerCase().includes(query.toLowerCase()) ||
      rule.id.toLowerCase().includes(query.toLowerCase());
    const matchTier = tier === "all" ? true : rule.controlTier === tier;
    return matchQuery && matchTier;
  });

  const coreCount = alerts.filter((rule) => rule.controlTier === "Current core control").length;
  const futureCount = alerts.length - coreCount;
  const openSignals = bottlenecks.filter((signal) => signal.status !== "mitigated");

  const openCreateDialog = () => {
    setIsNewRule(true);
    setEditableRule(createEditableRule());
    setEditorOpen(true);
  };

  const openEditDialog = (rule: AlertRuleRecord) => {
    setIsNewRule(false);
    setEditableRule({ ...rule });
    setEditorOpen(true);
  };

  const saveRule = () => {
    if (!editableRule.name || !editableRule.metric || !editableRule.threshold) {
      notify("Validation required", "Rule name, metric, and threshold are required.");
      return;
    }

    if (isNewRule) {
      addAlertRule({
        ...editableRule,
        id: nextAlertId(alerts),
      });
      notify("Alert rule created", "The new monitoring rule is now active in the list.");
    } else {
      updateAlertRule(editableRule.id, editableRule);
      notify("Alert rule updated", `${editableRule.id} was updated.`);
    }
    setEditorOpen(false);
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Alert Center"
        subtitle="Interactive alert rule management with acknowledgment and CRUD actions."
        helpText="Create, edit, acknowledge, enable/disable, and delete alert rules. All actions persist in local prototype state."
        right={<Badge variant="info">Alert routing and ticket handoff simulated</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Core Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">{coreCount}</p>
            <Badge variant="success">Active</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Future Enhanced Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">{futureCount}</p>
            <Badge variant="info">Advisory</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Enabled Rules</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">
              {alerts.filter((rule) => rule.enabled).length}
            </p>
            <BellRing className="h-5 w-5 text-[#003DA5]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Open Anomaly Signals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-3xl font-bold text-slate-900">{openSignals.length}</p>
            <Badge variant="warning">Watch</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            Alert Rules
            <div className="flex flex-wrap gap-2">
              <QuickInsightAction
                pageKey="alerts"
                buttonLabel="Quick Insight"
                subject="Alert center signal pressure"
                contextLines={[
                  `${alerts.filter((rule) => rule.enabled).length} rules currently enabled.`,
                  `${openSignals.length} bottleneck or anomaly signals are active.`,
                  "Escalate repeated P1/P2 alerts into manual handoff tickets after retry thresholds.",
                ]}
              />
              <Button size="sm" onClick={openCreateDialog}>
                <Plus className="h-3.5 w-3.5" />
                Add Rule
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Includes p95 latency, error rate, source completeness, fallback, and freshness controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[280px] flex-1">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search alert ID, metric, or rule name..."
                className="pl-8"
              />
              <Filter className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-fg)]" />
            </div>
            <Select value={tier} onChange={(event) => setTier(event.target.value)}>
              <option value="all">All controls</option>
              <option value="Current core control">Current core controls</option>
              <option value="Future enhanced control">Future enhanced controls</option>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Routing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ack</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-mono text-xs">{rule.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">{rule.name}</p>
                    <p className="text-xs text-slate-500">{rule.controlTier}</p>
                  </TableCell>
                  <TableCell>
                    <StatusChip state={rule.severity} />
                  </TableCell>
                  <TableCell>{rule.metric}</TableCell>
                  <TableCell className="whitespace-nowrap">{rule.threshold}</TableCell>
                  <TableCell className="max-w-[220px] whitespace-normal text-xs">
                    {rule.notificationPath}
                    <span className="block text-[10px] text-slate-500">{rule.actionGroup}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.enabled ? "success" : "default"}>
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <div className="mt-1">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(next) => {
                          updateAlertRule(rule.id, { enabled: next });
                          notify("Alert status updated", `${rule.id} ${next ? "enabled" : "disabled"}.`);
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {rule.acknowledged ? (
                      <Badge variant="success">Ack @ {rule.acknowledgedAt ?? "-"}</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          acknowledgeAlert(rule.id);
                          notify("Alert acknowledged", `${rule.id} acknowledged.`);
                        }}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(rule)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          deleteAlert(rule.id);
                          notify("Alert deleted", `${rule.id} removed from list.`);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={isNewRule ? "Create Monitoring Rule" : `Edit ${editableRule.id}`}
        description="Configure threshold, severity, and routing for this rule."
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveRule}>
              Save rule
            </Button>
          </div>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Rule name
            </label>
            <Input
              value={editableRule.name}
              onChange={(event) =>
                setEditableRule((previous) => ({ ...previous, name: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Severity
            </label>
            <Select
              value={editableRule.severity}
              onChange={(event) =>
                setEditableRule((previous) => ({
                  ...previous,
                  severity: event.target.value as "P1" | "P2" | "P3" | "P4" | "P5",
                }))
              }
            >
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
              <option value="P5">P5</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Metric
            </label>
            <Input
              value={editableRule.metric}
              onChange={(event) =>
                setEditableRule((previous) => ({ ...previous, metric: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Threshold
            </label>
            <Input
              value={editableRule.threshold}
              onChange={(event) =>
                setEditableRule((previous) => ({ ...previous, threshold: event.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Notification path
            </label>
            <Input
              value={editableRule.notificationPath}
              onChange={(event) =>
                setEditableRule((previous) => ({
                  ...previous,
                  notificationPath: event.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Action group
            </label>
            <Input
              value={editableRule.actionGroup}
              onChange={(event) =>
                setEditableRule((previous) => ({ ...previous, actionGroup: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Control tier
            </label>
            <Select
              value={editableRule.controlTier}
              onChange={(event) =>
                setEditableRule((previous) => ({
                  ...previous,
                  controlTier: event.target.value as
                    | "Current core control"
                    | "Future enhanced control",
                }))
              }
            >
              <option value="Current core control">Current core control</option>
              <option value="Future enhanced control">Future enhanced control</option>
            </Select>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Switch
                checked={editableRule.autoActionEnabled}
                onCheckedChange={(next) =>
                  setEditableRule((previous) => ({ ...previous, autoActionEnabled: next }))
                }
              />
              Auto action enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Switch
                checked={editableRule.enabled}
                onCheckedChange={(next) =>
                  setEditableRule((previous) => ({ ...previous, enabled: next }))
                }
              />
              Rule enabled
            </label>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
