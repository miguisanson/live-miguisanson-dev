import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { AlertOctagon, ArrowLeft, ClipboardList, FileSearch, ShieldAlert } from "lucide-react";
import { runbooks } from "../data/mock-data";
import { useDemoData, useOwners } from "../context/demo-data-context";
import { useDemoFeedback } from "../context/demo-feedback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PageHeader } from "../components/common/page-header";
import { StatusChip } from "../components/common/status-chip";
import { QuickInsightAction } from "../components/common/quick-insight-action";

function toMinutes(from: string, to: string): number {
  const fromDate = new Date(from.replace(" ", "T"));
  const toDate = new Date(to.replace(" ", "T"));
  const diff = Math.max(0, toDate.getTime() - fromDate.getTime());
  return Math.round(diff / 60000);
}

export function IncidentDetailPage(): React.ReactElement {
  const { id } = useParams();
  const {
    getIncidentById,
    alerts,
    tickets,
    bottlenecks,
    acknowledgeIncident,
    assignIncidentOwner,
    runSelfHealingWorkflow,
    createManualHandoffTicket,
    updateTicketStatus,
  } = useDemoData();
  const owners = useOwners();
  const { notify } = useDemoFeedback();
  const incident = id ? getIncidentById(id) : undefined;

  if (!incident) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Incident not found"
          subtitle="The requested incident ID does not exist in the local prototype dataset."
        />
        <Link to="/incidents">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back to incidents
          </Button>
        </Link>
      </section>
    );
  }

  const linkedRunbooks = runbooks.filter((rb) => incident.linkedRunbookIds.includes(rb.id));
  const linkedAlerts = alerts.filter((alert) => incident.linkedAlertIds.includes(alert.id));
  const relatedTicket = tickets.find((ticket) => ticket.incidentId === incident.id);
  const relatedSignals = bottlenecks.filter((signal) => signal.relatedIncidentId === incident.id);
  const owner = owners.find((entry) => entry.id === incident.ownerId);

  const mttrRespond =
    relatedTicket && relatedTicket.respondedAt
      ? toMinutes(relatedTicket.createdAt, relatedTicket.respondedAt)
      : null;

  return (
    <section className="space-y-5">
      <PageHeader
        title={incident.title}
        subtitle={`Ticket ${incident.ticketRef} | Affected system: ${incident.affectedComponent}`}
        helpText="Use this page to inspect timeline evidence, run self-healing actions, and manage manual handoff ticket flow."
        right={
          <>
            <StatusChip state={incident.severity} />
            <StatusChip state={incident.status} />
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Link to="/incidents">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
        </Link>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            acknowledgeIncident(incident.id);
            notify("Incident acknowledged", `${incident.ticketRef} status updated.`);
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
                  : "Workflow AI action attempted",
              result.message,
            );
          }}
        >
          Run Self-Healing
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const ticketId = createManualHandoffTicket(
              incident.id,
              "Manual escalation requested by incident owner.",
            );
            notify("Manual handoff ticket created", `${ticketId} now tracks this incident.`);
          }}
        >
          Escalate
        </Button>
        <QuickInsightAction
          pageKey="incident-detail"
          buttonLabel="Summarize"
          subject={`Incident summary for ${incident.ticketRef}`}
          contextLines={[
            `What happened: ${incident.title}`,
            `Likely cause: ${incident.detectionRule}`,
            `Already tried: ${incident.autoActionsAttempted.join("; ")}`,
            `Next step: ${incident.manualHandoffCondition}`,
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Incident Timeline</CardTitle>
            <CardDescription>
              Detection, automated actions, escalation, mitigation, and RCA progression.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incident.timeline.map((entry) => (
                <div
                  key={`${entry.timestamp}-${entry.event}`}
                  className="rounded-md border border-border bg-[var(--bg-soft)] p-3"
                >
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted-fg)]">
                    <span>{entry.timestamp}</span>
                    <Badge variant="outline">{entry.state}</Badge>
                  </div>
                  <p className="text-sm text-slate-900">{entry.event}</p>
                  <p className="mt-1 text-xs text-[var(--muted-fg)]">Actor: {entry.actor}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Command Snapshot</CardTitle>
            <CardDescription>Ticket reference, owner assignment, and fallback state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">Ticket reference</p>
              <p className="font-mono text-sm">{incident.ticketRef}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--muted-fg)]">Owner</p>
              <Select
                value={incident.ownerId}
                onChange={(event) => {
                  assignIncidentOwner(incident.id, event.target.value);
                  notify("Incident owner updated", `${incident.ticketRef} reassigned.`);
                }}
              >
                {owners.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-xs text-[var(--muted-fg)]">
                {owner?.role ?? "Owner role not available"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">Detection rule</p>
              <p>{incident.detectionRule}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">Fallback state</p>
              <p>{incident.fallbackState}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">Manual handoff condition</p>
              <p>{incident.manualHandoffCondition}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Automatic Actions Attempted</CardTitle>
            <CardDescription>
              Rule-based and script-based actions only. No uncontrolled autonomous changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-900">
              {incident.autoActionsAttempted.map((action) => (
                <li
                  key={action}
                  className="rounded-md border border-border bg-[var(--bg-soft)] px-3 py-2"
                >
                  {action}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Handoff Panel</CardTitle>
            <CardDescription>
              ServiceNow-style manual intervention flow with response commitments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {relatedTicket ? (
              <>
                <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">Ticket</p>
                  <p className="font-mono">{relatedTicket.id}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                    Ticket status
                  </p>
                  <Select
                    value={relatedTicket.status}
                    onChange={(event) => {
                      updateTicketStatus(
                        relatedTicket.id,
                        event.target.value as
                          | "new"
                          | "assigned"
                          | "in-progress"
                          | "waiting"
                          | "resolved",
                      );
                      notify("Ticket status updated", `${relatedTicket.id} moved to ${event.target.value}.`);
                    }}
                  >
                    <option value="new">new</option>
                    <option value="assigned">assigned</option>
                    <option value="in-progress">in-progress</option>
                    <option value="waiting">waiting</option>
                    <option value="resolved">resolved</option>
                  </Select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-border bg-white p-2 text-xs">
                    <p className="text-[var(--muted-fg)]">Created</p>
                    <p>{relatedTicket.createdAt}</p>
                  </div>
                  <div className="rounded-md border border-border bg-white p-2 text-xs">
                    <p className="text-[var(--muted-fg)]">Respond by</p>
                    <p>{relatedTicket.respondBy}</p>
                  </div>
                  <div className="rounded-md border border-border bg-white p-2 text-xs">
                    <p className="text-[var(--muted-fg)]">Response target</p>
                    <p>{relatedTicket.responseTargetMinutes} minutes</p>
                  </div>
                  <div className="rounded-md border border-border bg-white p-2 text-xs">
                    <p className="text-[var(--muted-fg)]">Mean time to respond</p>
                    <p>{mttrRespond ?? "Pending"}{mttrRespond !== null ? " minutes" : ""}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">Reason for handoff</p>
                  <p>{relatedTicket.reason}</p>
                </div>
              </>
            ) : (
              <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3">
                <p>No manual handoff ticket yet.</p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    const ticketId = createManualHandoffTicket(
                      incident.id,
                      "Manual handoff requested from incident detail.",
                    );
                    notify("Manual handoff ticket created", `${ticketId} added.`);
                  }}
                >
                  Create Ticket
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-[#003DA5]" />
                RCA Section
              </div>
            </CardTitle>
            <CardDescription>Root-cause analysis and required control improvements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {incident.rcaItems.length === 0 ? (
              <p className="text-sm text-[var(--muted-fg)]">RCA in progress.</p>
            ) : (
              incident.rcaItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border bg-[var(--bg-soft)] p-3"
                >
                  <p className="mb-2 text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                    {item.id}
                  </p>
                  <p className="mb-2 text-sm text-slate-900">{item.why}</p>
                  <p className="text-xs text-[var(--muted-fg)]">
                    Corrective control: {item.correctiveControl}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#003DA5]" />
                CAP Section
              </div>
            </CardTitle>
            <CardDescription>Corrective Action Plan tasks linked to this incident.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incident.capTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.ownerRole}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === "done"
                            ? "success"
                            : task.status === "in-progress"
                              ? "warning"
                              : "default"
                        }
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#003DA5]" />
                Linked Runbooks
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {linkedRunbooks.map((runbook) => (
              <div
                key={runbook.id}
                className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm"
              >
                <p className="font-semibold">{runbook.domain}</p>
                <p className="text-xs text-[var(--muted-fg)]">
                  Escalation owner: {runbook.escalationOwner} | Response target:{" "}
                  {runbook.responseTarget}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-[#003DA5]" />
                Linked Alerts
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {linkedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm"
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-semibold">
                    {alert.id} - {alert.name}
                  </p>
                  <StatusChip state={alert.severity} />
                </div>
                <p className="text-xs text-[var(--muted-fg)]">
                  {alert.metric} | Threshold: {alert.threshold}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Related Bottleneck and Anomaly Signals</CardTitle>
          <CardDescription>Signals linked to this incident’s pipeline stage.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {relatedSignals.length > 0 ? (
            relatedSignals.map((signal) => (
              <div key={signal.id} className="rounded-md border border-border bg-[var(--bg-soft)] p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Badge variant={signal.category === "anomaly" ? "warning" : "info"}>
                    {signal.category}
                  </Badge>
                  <StatusChip state={signal.severity} />
                </div>
                <p className="text-sm font-semibold text-slate-900">{signal.title}</p>
                <p className="text-xs text-slate-600">{signal.signal}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No related anomaly signals found.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>Representative incident evidence stream.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Stream</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incident.eventLog.map((log) => (
                <TableRow key={`${log.timestamp}-${log.stream}`}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>{log.stream}</TableCell>
                  <TableCell>{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
