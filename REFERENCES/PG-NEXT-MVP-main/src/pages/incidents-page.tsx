import * as React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useDemoData, useOwners } from "../context/demo-data-context";
import { useDemoFeedback } from "../context/demo-feedback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PageHeader } from "../components/common/page-header";
import { StatusChip } from "../components/common/status-chip";
import { QuickInsightAction } from "../components/common/quick-insight-action";

export function IncidentsPage(): React.ReactElement {
  const {
    incidents,
    tickets,
    acknowledgeIncident,
    assignIncidentOwner,
    createManualHandoffTicket,
  } = useDemoData();
  const owners = useOwners();
  const { notify } = useDemoFeedback();
  const [query, setQuery] = React.useState<string>("");
  const [severity, setSeverity] = React.useState<string>("all");
  const [source, setSource] = React.useState<string>("all");

  const ticketByIncidentId = Object.fromEntries(
    tickets.map((ticket) => [ticket.incidentId, ticket]),
  );

  const filteredIncidents = incidents.filter((incident) => {
    const byQuery =
      incident.ticketRef.toLowerCase().includes(query.toLowerCase()) ||
      incident.id.toLowerCase().includes(query.toLowerCase()) ||
      incident.title.toLowerCase().includes(query.toLowerCase());
    const bySeverity = severity === "all" ? true : incident.severity === severity;
    const bySource = source === "all" ? true : incident.source === source;
    return byQuery && bySeverity && bySource;
  });

  return (
    <section className="space-y-5">
      <PageHeader
        title="Incidents"
        subtitle="Interactive incident queue with ticketing, assignment, acknowledgment, and escalation controls."
        helpText="Use owner assignment and escalation controls directly in the queue. Every action writes to persistent local workflow state."
        right={<Badge variant="warning">Incident Command Active</Badge>}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            Incident Queue
            <QuickInsightAction
              pageKey="incidents"
              buttonLabel="Summarize"
              subject="Incident queue posture"
              contextLines={[
                `${filteredIncidents.length} incidents currently match queue filters.`,
                `${tickets.length} incidents have manual handoff tickets.`,
                "Prioritize P1/P2 incidents with repeated retries or stale freshness impact.",
              ]}
            />
          </CardTitle>
          <CardDescription>
            Filter by severity, source domain, and incident reference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-2 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[var(--muted-fg)]" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-8"
                placeholder="Search ticket ref, incident ID, or title"
              />
            </div>
            <Select value={severity} onChange={(event) => setSeverity(event.target.value)}>
              <option value="all">All severities</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="P4">P4</option>
              <option value="P5">P5</option>
            </Select>
            <Select value={source} onChange={(event) => setSource(event.target.value)}>
              <option value="all">All sources</option>
              <option value="Source/API">Source/API</option>
              <option value="Data Lake">Data Lake</option>
              <option value="ETL">ETL</option>
              <option value="AI">AI</option>
              <option value="Dashboard/API">Dashboard/API</option>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Ref</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Affect</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Handoff</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => {
                const ticket = ticketByIncidentId[incident.id];
                return (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">{incident.ticketRef}</TableCell>
                    <TableCell>
                      <Link
                        to={`/incidents/${incident.id}`}
                        className="text-[#003DA5] underline decoration-dotted underline-offset-4"
                      >
                        {incident.id}
                      </Link>
                      <span className="block max-w-[280px] whitespace-normal text-xs text-slate-700">
                        {incident.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusChip state={incident.severity} />
                    </TableCell>
                    <TableCell>
                      <StatusChip state={incident.status} />
                    </TableCell>
                    <TableCell className="min-w-[180px]">
                      <Select
                        value={incident.ownerId}
                        onChange={(event) => {
                          assignIncidentOwner(incident.id, event.target.value);
                          notify("Incident owner updated", `${incident.ticketRef} reassigned.`);
                        }}
                      >
                        {owners.map((owner) => (
                          <option key={owner.id} value={owner.id}>
                            {owner.name}
                          </option>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell className="max-w-[220px] whitespace-normal text-xs text-slate-700">
                      {incident.affectedBusinessModule}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {incident.responseBy}
                    </TableCell>
                    <TableCell>
                      {ticket ? (
                        <Badge variant="warning">{ticket.id}</Badge>
                      ) : (
                        <Badge variant="outline">Not created</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            acknowledgeIncident(incident.id);
                            notify("Incident acknowledged", `${incident.ticketRef} moved to acknowledged.`);
                          }}
                        >
                          Ack
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const ticketId = createManualHandoffTicket(
                              incident.id,
                              "Manual handoff requested from incident queue.",
                            );
                            notify("Manual handoff ticket", `${ticketId} created.`);
                          }}
                        >
                          Escalate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
