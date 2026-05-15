import * as React from "react";
import { Pencil } from "lucide-react";
import { runbooks } from "../data/mock-data";
import { useDemoData } from "../context/demo-data-context";
import { useDemoFeedback } from "../context/demo-feedback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog } from "../components/ui/dialog";
import { PageHeader } from "../components/common/page-header";
import { QuickInsightAction } from "../components/common/quick-insight-action";

export function RunbooksPage(): React.ReactElement {
  const { runbookNotes, saveRunbookNote } = useDemoData();
  const { notify } = useDemoFeedback();
  const [editingRunbookId, setEditingRunbookId] = React.useState<string | null>(null);
  const [draftNote, setDraftNote] = React.useState<string>("");

  const openNoteEditor = (runbookId: string) => {
    setEditingRunbookId(runbookId);
    setDraftNote(runbookNotes[runbookId] ?? "");
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Runbooks and Escalation"
        subtitle="Operational runbooks mapped to alert types, severity targets, and escalation ownership."
        helpText="Runbooks describe trigger conditions, scripted first response, manual escalation points, and closure validation checks."
        right={
          <QuickInsightAction
            pageKey="runbooks"
            buttonLabel="Quick Insight"
            subject="Runbook readiness summary"
            contextLines={[
              `${runbooks.length} runbooks are available for source, ETL, AI, and dashboard incidents.`,
              "Runbook notes are editable and persist locally for handoff guidance.",
              "Manual escalation conditions should stay aligned to threshold-based workflow policy.",
            ]}
          />
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {runbooks.map((runbook) => (
          <Card key={runbook.id}>
            <CardHeader>
              <CardTitle>{runbook.domain}</CardTitle>
              <CardDescription>
                {runbook.severityMapping} | Response target: {runbook.responseTarget}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                  Trigger Condition
                </p>
                <p>{runbook.triggerCondition}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                  First Response
                </p>
                <p>{runbook.firstResponse}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                  Automated Action
                </p>
                <p>{runbook.automatedAction}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                  Manual Escalation Condition
                </p>
                <p>{runbook.manualEscalationCondition}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-[var(--bg-soft)] p-2 text-xs">
                  <p className="mb-1 text-[var(--muted-fg)]">Owner</p>
                  <p>{runbook.ownerRole}</p>
                </div>
                <div className="rounded-md border border-border bg-[var(--bg-soft)] p-2 text-xs">
                  <p className="mb-1 text-[var(--muted-fg)]">Escalation Owner</p>
                  <p>{runbook.escalationOwner}</p>
                </div>
                <div className="rounded-md border border-border bg-[var(--bg-soft)] p-2 text-xs">
                  <p className="mb-1 text-[var(--muted-fg)]">Notification Method</p>
                  <p>{runbook.notificationMethod}</p>
                </div>
                <div className="rounded-md border border-border bg-[var(--bg-soft)] p-2 text-xs">
                  <p className="mb-1 text-[var(--muted-fg)]">Auto Action Policy</p>
                  <Badge variant={runbook.autoActionAllowed ? "success" : "warning"}>
                    {runbook.autoActionAllowed ? "Allowed" : "Manual only"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                  Validation Before Closure
                </p>
                <p>{runbook.validationBeforeClosure}</p>
              </div>
              <div className="rounded-md border border-border bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">
                    Runbook note
                  </p>
                  <Button size="sm" variant="outline" onClick={() => openNoteEditor(runbook.id)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit note
                  </Button>
                </div>
                <p className="text-xs text-slate-700">
                  {runbookNotes[runbook.id] ?? "No note added yet."}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={Boolean(editingRunbookId)}
        onClose={() => setEditingRunbookId(null)}
        title={`Edit runbook note${editingRunbookId ? ` (${editingRunbookId})` : ""}`}
        description="Notes persist locally and are intended for handoff context in this prototype."
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditingRunbookId(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!editingRunbookId) {
                  return;
                }
                saveRunbookNote(editingRunbookId, draftNote.trim());
                notify("Runbook note saved", `${editingRunbookId} note updated.`);
                setEditingRunbookId(null);
              }}
            >
              Save note
            </Button>
          </div>
        }
      >
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Operational note
        </label>
        <textarea
          value={draftNote}
          onChange={(event) => setDraftNote(event.target.value)}
          className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003DA5]"
          placeholder="Add checkpoint details, manual validation tips, or escalation notes."
        />
      </Dialog>
    </section>
  );
}
