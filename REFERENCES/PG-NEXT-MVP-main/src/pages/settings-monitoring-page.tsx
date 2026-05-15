import * as React from "react";
import { Plus, Save } from "lucide-react";
import { runbooks } from "../data/mock-data";
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
import { HelpTip } from "../components/help/help-tip";
import { QuickInsightAction } from "../components/common/quick-insight-action";

interface NotificationState {
  email: boolean;
  sms: boolean;
  webhook: boolean;
  teams: boolean;
}

interface RoleVisibilityState {
  [key: string]: boolean;
}

interface NewRuleDraft {
  name: string;
  severity: "P1" | "P2" | "P3" | "P4" | "P5";
  metric: string;
  threshold: string;
  notificationPath: string;
  actionGroup: string;
  autoActionEnabled: boolean;
  enabled: boolean;
}

const SETTINGS_STORAGE_KEY = "consumer_iq_monitoring_settings_v1";

function nextAlertId(alerts: AlertRuleRecord[]): string {
  const max = alerts.reduce((value, alert) => {
    const parsed = Number(alert.id.replace("AL-", ""));
    return Number.isFinite(parsed) ? Math.max(value, parsed) : value;
  }, 0);
  return `AL-${String(max + 1).padStart(3, "0")}`;
}

function parseRange(range: string): { min: number; max: number } | null {
  const numbers = range
    .split("-")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
  if (numbers.length !== 2) {
    return null;
  }
  return { min: numbers[0], max: numbers[1] };
}

function readSettingsState(): {
  selfHealingEnabled: boolean;
  notifications: NotificationState;
  roleVisibility: RoleVisibilityState;
} {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return {
        selfHealingEnabled: true,
        notifications: {
          email: true,
          sms: true,
          webhook: true,
          teams: true,
        },
        roleVisibility: {
          "Market Operations -> Operations pages": false,
          "R&D -> Operations pages": false,
          "Product Supply -> Operations pages": false,
          "Project Manager -> Monitoring settings": true,
          "Operations roles -> Business pages": true,
        },
      };
    }
    return JSON.parse(raw) as {
      selfHealingEnabled: boolean;
      notifications: NotificationState;
      roleVisibility: RoleVisibilityState;
    };
  } catch {
    return {
      selfHealingEnabled: true,
      notifications: {
        email: true,
        sms: true,
        webhook: true,
        teams: true,
      },
      roleVisibility: {
        "Market Operations -> Operations pages": false,
        "R&D -> Operations pages": false,
        "Product Supply -> Operations pages": false,
        "Project Manager -> Monitoring settings": true,
        "Operations roles -> Business pages": true,
      },
    };
  }
}

export function SettingsMonitoringPage(): React.ReactElement {
  const { thresholds, alerts, updateThreshold, addAlertRule } = useDemoData();
  const { notify } = useDemoFeedback();
  const [thresholdState, setThresholdState] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(thresholds.map((item) => [item.id, item.currentValue])),
  );
  const [settingsState, setSettingsState] = React.useState(() => readSettingsState());
  const [newRuleOpen, setNewRuleOpen] = React.useState<boolean>(false);
  const [ruleDraft, setRuleDraft] = React.useState<NewRuleDraft>({
    name: "",
    severity: "P3",
    metric: "",
    threshold: "",
    notificationPath: "Ops Manager -> Data Engineer",
    actionGroup: "AG-P3",
    autoActionEnabled: true,
    enabled: true,
  });

  React.useEffect(() => {
    setThresholdState(Object.fromEntries(thresholds.map((item) => [item.id, item.currentValue])));
  }, [thresholds]);

  React.useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsState));
  }, [settingsState]);

  const outOfRangeCount = thresholds.reduce((count, item) => {
    const currentValue = thresholdState[item.id] ?? item.currentValue;
    const range = parseRange(item.recommendedRange);
    if (!range) {
      return count;
    }
    return currentValue < range.min || currentValue > range.max ? count + 1 : count;
  }, 0);

  const saveThresholds = () => {
    thresholds.forEach((item) => {
      const nextValue = thresholdState[item.id];
      if (!Number.isFinite(nextValue)) {
        return;
      }
      updateThreshold(item.id, nextValue);
    });
    notify("Threshold settings saved", "Monitoring thresholds updated in persistent local state.");
  };

  const createMonitoringRule = () => {
    if (!ruleDraft.name || !ruleDraft.metric || !ruleDraft.threshold) {
      notify("Validation required", "Name, metric, and threshold are required.");
      return;
    }

    addAlertRule({
      id: nextAlertId(alerts),
      name: ruleDraft.name,
      severity: ruleDraft.severity,
      metric: ruleDraft.metric,
      threshold: ruleDraft.threshold,
      notificationPath: ruleDraft.notificationPath,
      actionGroup: ruleDraft.actionGroup,
      autoActionEnabled: ruleDraft.autoActionEnabled,
      lastTriggered: "Never",
      enabled: ruleDraft.enabled,
      controlTier: "Current core control",
    });

    notify("Monitoring rule created", "The new rule is now visible in Alert Center.");
    setRuleDraft({
      name: "",
      severity: "P3",
      metric: "",
      threshold: "",
      notificationPath: "Ops Manager -> Data Engineer",
      actionGroup: "AG-P3",
      autoActionEnabled: true,
      enabled: true,
    });
    setNewRuleOpen(false);
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Monitoring Settings"
        subtitle="Threshold tuning, notification routing, and self-healing controls with persistent local behavior."
        helpText="This page is fully interactive in prototype mode. Threshold updates affect workflow escalation behavior and newly created monitoring rules appear in Alert Center."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={outOfRangeCount > 0 ? "warning" : "success"}>
              {outOfRangeCount > 0 ? `${outOfRangeCount} thresholds out of range` : "All thresholds within range"}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => setNewRuleOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add Monitoring Rule
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            Threshold Controls
            <HelpTip
              title="Threshold controls"
              content="Adjust threshold values to simulate alert behavior and Workflow AI escalation boundaries."
            />
          </CardTitle>
          <CardDescription>
            Editable thresholds for latency, error rate, freshness, data quality, fallback, and availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
            <p className="text-slate-800">
              Freshness threshold directly affects self-healing escalation logic when stale duration remains above target.
            </p>
            <QuickInsightAction
              pageKey="settings-monitoring"
              buttonLabel="What This Means"
              subject="Threshold posture summary"
              contextLines={[
                `Current out-of-range thresholds: ${outOfRangeCount}.`,
                "Freshness and fallback controls are tied to incident escalation outcomes.",
                "Save updates to apply monitoring behavior changes across operations views.",
              ]}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threshold</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Recommended Range</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {thresholds.map((item) => {
                const value = thresholdState[item.id] ?? item.currentValue;
                const range = parseRange(item.recommendedRange);
                const inRange = range ? value >= range.min && value <= range.max : true;

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="max-w-[120px]">
                      <Input
                        type="number"
                        value={value}
                        onChange={(event) =>
                          setThresholdState((previous) => ({
                            ...previous,
                            [item.id]: Number(event.target.value),
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.recommendedRange}</TableCell>
                    <TableCell>
                      <Badge variant={inRange ? "success" : "warning"}>
                        {inRange ? "within range" : "watch"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={saveThresholds}>
              <Save className="h-3.5 w-3.5" />
              Save Threshold Changes
            </Button>
            <Badge variant="outline">{alerts.length} current alert rules</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              Notification Methods
              <HelpTip
                title="Notification methods"
                content="Toggle simulated notification channels used by alert routing."
              />
            </CardTitle>
            <CardDescription>Email, SMS, webhook, and Teams-style routing controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3">
              <span>Email</span>
              <Switch
                checked={settingsState.notifications.email}
                onCheckedChange={(next) =>
                  setSettingsState((previous) => ({
                    ...previous,
                    notifications: { ...previous.notifications, email: next },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3">
              <span>SMS</span>
              <Switch
                checked={settingsState.notifications.sms}
                onCheckedChange={(next) =>
                  setSettingsState((previous) => ({
                    ...previous,
                    notifications: { ...previous.notifications, sms: next },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3">
              <span>Webhook</span>
              <Switch
                checked={settingsState.notifications.webhook}
                onCheckedChange={(next) =>
                  setSettingsState((previous) => ({
                    ...previous,
                    notifications: { ...previous.notifications, webhook: next },
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3">
              <span>Teams / webhook-style integration</span>
              <Switch
                checked={settingsState.notifications.teams}
                onCheckedChange={(next) =>
                  setSettingsState((previous) => ({
                    ...previous,
                    notifications: { ...previous.notifications, teams: next },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              Self-Healing Controls
              <HelpTip
                title="Self-healing controls"
                content="Workflow AI only runs safe scripted actions and escalates when thresholds are breached."
              />
            </CardTitle>
            <CardDescription>
              Control high-level self-healing mode and review runbook routing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3">
              <div>
                <p className="font-medium text-slate-900">Enable scripted self-healing</p>
                <p className="text-xs text-[var(--muted-fg)]">
                  Retry, restart, quarantine, fallback switch, and publish-hold controls.
                </p>
              </div>
              <Switch
                checked={settingsState.selfHealingEnabled}
                onCheckedChange={(next) =>
                  setSettingsState((previous) => ({ ...previous, selfHealingEnabled: next }))
                }
              />
            </div>
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              <p className="mb-1 font-semibold text-slate-900">Incident severity routing note</p>
              <p className="text-xs text-[var(--muted-fg)]">
                P1/P2 route through multi-channel escalation; P3-P5 route to owner channels and queue-based triage.
              </p>
            </div>
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              <p className="mb-1 font-semibold text-slate-900">Alert-to-runbook mapping</p>
              <ul className="space-y-1 text-xs text-[var(--muted-fg)]">
                {runbooks.map((runbook) => (
                  <li key={runbook.id}>
                    {runbook.id} {"->"} {runbook.domain}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            Role Visibility Settings
            <HelpTip
              title="Role visibility"
              content="Simulate route-level visibility policies for role groups in this concept app."
            />
          </CardTitle>
          <CardDescription>Prototype-level visibility controls for governance discussions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(settingsState.roleVisibility).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3"
            >
              <span className="text-sm">{key}</span>
              <Switch
                checked={value}
                onCheckedChange={(next) =>
                  setSettingsState((previous) => ({
                    ...previous,
                    roleVisibility: { ...previous.roleVisibility, [key]: next },
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={newRuleOpen}
        onClose={() => setNewRuleOpen(false)}
        title="Create monitoring rule"
        description="This action adds a new rule to Alert Center in local prototype state."
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setNewRuleOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={createMonitoringRule}>
              Create rule
            </Button>
          </div>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Rule name
            </label>
            <Input
              aria-label="Rule name"
              value={ruleDraft.name}
              onChange={(event) =>
                setRuleDraft((previous) => ({ ...previous, name: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Severity
            </label>
            <Select
              aria-label="Severity"
              value={ruleDraft.severity}
              onChange={(event) =>
                setRuleDraft((previous) => ({
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
              aria-label="Metric"
              value={ruleDraft.metric}
              onChange={(event) =>
                setRuleDraft((previous) => ({ ...previous, metric: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Threshold
            </label>
            <Input
              aria-label="Threshold"
              value={ruleDraft.threshold}
              onChange={(event) =>
                setRuleDraft((previous) => ({ ...previous, threshold: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Action group
            </label>
            <Input
              aria-label="Action group"
              value={ruleDraft.actionGroup}
              onChange={(event) =>
                setRuleDraft((previous) => ({ ...previous, actionGroup: event.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Notification path
            </label>
            <Input
              aria-label="Notification path"
              value={ruleDraft.notificationPath}
              onChange={(event) =>
                setRuleDraft((previous) => ({
                  ...previous,
                  notificationPath: event.target.value,
                }))
              }
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Switch
                checked={ruleDraft.autoActionEnabled}
                onCheckedChange={(next) =>
                  setRuleDraft((previous) => ({ ...previous, autoActionEnabled: next }))
                }
              />
              Enable auto action
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <Switch
                checked={ruleDraft.enabled}
                onCheckedChange={(next) =>
                  setRuleDraft((previous) => ({ ...previous, enabled: next }))
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
