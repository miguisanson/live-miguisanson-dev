import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { autonomousDecisionLog } from "../data/mock-data";
import { useDemoData } from "../context/demo-data-context";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PageHeader } from "../components/common/page-header";
import { QuickInsightAction } from "../components/common/quick-insight-action";
import { useDemoFeedback } from "../context/demo-feedback";

export function IntelligenceCommandCenterPage(): React.ReactElement {
  const { moduleImpact, commandRecommendations, updateRecommendation } = useDemoData();
  const { notify } = useDemoFeedback();
  const commandCenterState = moduleImpact.find(
    (item) => item.module === "Intelligence Command Center",
  );

  const [editTargetId, setEditTargetId] = React.useState<string | null>(null);
  const [decisionNote, setDecisionNote] = React.useState<string>("");

  const openModify = (recommendationId: string, initialNote: string) => {
    setEditTargetId(recommendationId);
    setDecisionNote(initialNote);
  };

  const applyDecision = (
    id: string,
    decision: "approved" | "dismissed" | "modified",
    note?: string,
  ) => {
    updateRecommendation(id, decision, note ?? "");
    notify(
      `Recommendation ${decision}`,
      decision === "modified"
        ? "Parameters saved with an updated note."
        : "Recommendation state updated in local workflow.",
    );
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Intelligence Command Center"
        subtitle="Recommendation workflow with explicit human approval controls."
        helpText="Approve, modify, or dismiss recommendations. Decisions are saved locally and reflected in the command log."
        right={
          <Badge
            variant={
              commandCenterState?.state === "healthy"
                ? "success"
                : commandCenterState?.state === "limited confidence"
                  ? "warning"
                  : "default"
            }
          >
            {commandCenterState?.state ?? "degraded"}
          </Badge>
        }
      />

      {commandCenterState && commandCenterState.state !== "healthy" ? (
        <div className="flex items-start gap-2 rounded-md border border-[#F59E0B] bg-[#fffdf0] p-3 text-sm text-slate-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#003DA5]" />
          <p>
            Warning: AI quality and freshness are currently degraded ({commandCenterState.issue}).
            Recommendations remain advisory and require operator approval.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {commandRecommendations.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.detail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-800">{card.action}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    card.decision === "approved"
                      ? "success"
                      : card.decision === "dismissed"
                        ? "danger"
                        : card.decision === "modified"
                          ? "warning"
                          : "default"
                  }
                >
                  {card.decision}
                </Badge>
                <span className="text-xs text-slate-500">Updated {card.updatedAt}</span>
              </div>
              {card.decisionNote ? (
                <p className="rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700">
                  Note: {card.decisionNote}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => applyDecision(card.id, "approved", card.decisionNote)}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModify(card.id, card.decisionNote)}
                >
                  Modify
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => applyDecision(card.id, "dismissed")}
                >
                  Dismiss
                </Button>
                <QuickInsightAction
                  pageKey="command-center"
                  buttonLabel="Explain This"
                  subject={card.title}
                  contextLines={[
                    card.detail,
                    card.action,
                    `Current decision state: ${card.decision}`,
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Autonomous Decision Log</CardTitle>
          <CardDescription>
            AI suggestions plus human decisions and guardrail events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autonomousDecisionLog.map((item) => (
                <TableRow key={`${item.timestamp}-${item.action}`}>
                  <TableCell>{item.timestamp}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.state}</TableCell>
                </TableRow>
              ))}
              {commandRecommendations.map((item) => (
                <TableRow key={`local-${item.id}`}>
                  <TableCell>{item.updatedAt}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="capitalize">{item.decision}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editTargetId)}
        onClose={() => setEditTargetId(null)}
        title="Modify Recommendation"
        description="Adjust rationale or constraints before approving this action."
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditTargetId(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!editTargetId) {
                  return;
                }
                applyDecision(editTargetId, "modified", decisionNote);
                setEditTargetId(null);
              }}
            >
              Save modification
            </Button>
          </div>
        }
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Modification note
          </label>
          <Input
            value={decisionNote}
            onChange={(event) => setDecisionNote(event.target.value)}
            placeholder="Add business guardrails, budget constraints, or rollout notes."
          />
        </div>
      </Dialog>
    </section>
  );
}
