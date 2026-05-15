import * as React from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { competitorTrend } from "../data/mock-data";
import { useDemoData, type CompetitorMappingRowRecord } from "../context/demo-data-context";
import { HelpTip } from "../components/help/help-tip";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { PageHeader } from "../components/common/page-header";
import { StatusChip } from "../components/common/status-chip";
import { QuickInsightAction } from "../components/common/quick-insight-action";
import { useDemoFeedback } from "../context/demo-feedback";

interface MappingEditorState {
  id: string;
  mappedSku: string;
  coverageNote: string;
  state: "healthy" | "stale";
}

export function CompetitorIntelligencePage(): React.ReactElement {
  const { moduleImpact, competitorMappings, updateCompetitorMapping } = useDemoData();
  const { notify } = useDemoFeedback();
  const moduleState = moduleImpact.find((item) => item.module === "Competitor Intelligence");
  const [showMappingRows, setShowMappingRows] = React.useState<boolean>(false);
  const [editorOpen, setEditorOpen] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<MappingEditorState | null>(null);

  const openEditor = (row: CompetitorMappingRowRecord) => {
    setEditor({
      id: row.id,
      mappedSku: row.mappedSku,
      coverageNote: row.coverageNote,
      state: row.state,
    });
    setEditorOpen(true);
  };

  const saveEditor = () => {
    if (!editor) {
      return;
    }
    updateCompetitorMapping(editor.id, {
      mappedSku: editor.mappedSku,
      coverageNote: editor.coverageNote,
      state: editor.state,
    });
    setEditorOpen(false);
    notify("Competitor mapping updated", "Coverage diagnostics were saved locally.");
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Competitor Intelligence"
        subtitle="Business-facing competitor visibility with reliability-aware context."
        helpText="Use quick summaries for trend shifts, mapping health, and new entrant significance."
        right={<StatusChip state={moduleState?.state ?? "degraded"} />}
      />

      {moduleState && moduleState.state !== "healthy" ? (
        <div className="flex items-start gap-2 rounded-md border border-[#F59E0B] bg-[#fffdf0] p-3 text-sm text-slate-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#003DA5]" />
          <p>
            Reliability notice: {moduleState.issue}. Cause: {moduleState.causedBy}. Use
            caution for short-term competitor decisioning.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              Competitor Mapping Coverage
              <HelpTip
                title="Competitor Mapping Coverage"
                content="Lower mapping coverage lowers confidence in short-term share-shift interpretation."
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-slate-900">91%</p>
            <p className="text-xs text-slate-600">Top-tier competitor SKU mapping coverage</p>
            <QuickInsightAction
              pageKey="competitor-intelligence"
              subject="Competitor mapping coverage interpretation"
              contextLines={[
                "Coverage is 91% with two rows pending refresh.",
                moduleState?.issue ?? "No data-quality warning currently active.",
                "Short-term share shift views require caution when mapping rows are stale.",
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Shift Delta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-slate-900">-1.2 pp</p>
            <p className="text-xs text-slate-600">P&G vs top competitor (week-over-week)</p>
            <QuickInsightAction
              pageKey="competitor-intelligence"
              buttonLabel="Explain This"
              subject="Week-over-week share shift"
              contextLines={[
                "Share shifted by -1.2 percentage points this week.",
                "Trend pressure aligns with competitor promo window and stale mapping subset.",
                "Recommend reviewing promo and retention interventions.",
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Entrant Detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              1 new entrant flagged in premium liquid segment
            </p>
            <Badge variant="warning">Verification in progress</Badge>
            <QuickInsightAction
              pageKey="competitor-intelligence"
              buttonLabel="Summarize"
              subject="New entrant risk summary"
              contextLines={[
                "One premium entrant is gaining velocity in Metro clusters.",
                "Signal confidence is moderate while mapping refresh is pending.",
                "Use watch-list actions before broad response.",
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Successful Mapping Refresh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">2026-03-16 12:05</p>
            <p className="text-xs text-slate-600">Latest validated mapping refresh event</p>
            <QuickInsightAction
              pageKey="competitor-intelligence"
              buttonLabel="What This Means"
              subject="Mapping refresh recency and trust"
              contextLines={[
                "Last successful mapping refresh happened at 12:05.",
                "Pending rows are currently served via last known good mapping.",
                "If delay exceeds SLA, confidence for new entrant detection should be reduced.",
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              Competitor Rating Trends
              <QuickInsightAction
                pageKey="competitor-intelligence"
                buttonLabel="Summarize"
                subject="Competitor trend chart interpretation"
                contextLines={[
                  "P&G trend remained stable while competitor line narrowed the gap.",
                  "Short-term interpretation depends on stale-mapping recovery window.",
                  "Recommended action: compare trend with freshness and promo indicators.",
                ]}
              />
            </CardTitle>
            <CardDescription>4-week rolling average per brand cluster.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={competitorTrend}
                margin={{ top: 10, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e8f2" />
                <XAxis dataKey="time" stroke="#6d8195" />
                <YAxis stroke="#6d8195" domain={[3.5, 4.6]} width={36} />
                <Tooltip />
                <Legend verticalAlign="top" height={30} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="P&G brand"
                  stroke="#003DA5"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="secondary"
                  name="Top competitor"
                  stroke="#F59E0B"
                  strokeWidth={2.2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tertiary"
                  name="Market average"
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
            <CardTitle>Mapping Health Summary</CardTitle>
            <CardDescription>Support diagnostics for business interpretation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              <p className="font-semibold text-slate-900">Coverage status</p>
              <p className="text-xs text-slate-600">
                {competitorMappings.filter((row) => row.state === "stale").length} rows are
                pending refresh because of upstream schema updates.
              </p>
            </div>
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              <p className="font-semibold text-slate-900">Confidence guidance</p>
              <p className="text-xs text-slate-600">
                Long-range trend analysis is safe; short-term mapping-sensitive views require caution.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Mapping Support Detail
            <button
              type="button"
              onClick={() => setShowMappingRows((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-[#f5fbff]"
            >
              {showMappingRows ? (
                <>
                  Hide detail <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Show detail <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </CardTitle>
          <CardDescription>Secondary row-level diagnostics for mapping reliability.</CardDescription>
        </CardHeader>
        {showMappingRows ? (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Mapped SKU</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Coverage note</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitorMappings.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.brand}</TableCell>
                    <TableCell>{row.product}</TableCell>
                    <TableCell className="font-mono text-xs">{row.mappedSku}</TableCell>
                    <TableCell>
                      <StatusChip state={row.state === "healthy" ? "healthy" : "stale"} />
                    </TableCell>
                    <TableCell className="max-w-[260px] whitespace-normal text-xs text-slate-600">
                      {row.coverageNote}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => openEditor(row)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        ) : null}
      </Card>

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title="Update Mapping Row"
        description="Edit mapped SKU, coverage note, and health state."
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveEditor}>
              Save changes
            </Button>
          </div>
        }
      >
        {editor ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mapped SKU
              </label>
              <Input
                value={editor.mappedSku}
                onChange={(event) =>
                  setEditor((previous) =>
                    previous ? { ...previous, mappedSku: event.target.value } : previous,
                  )
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Coverage note
              </label>
              <Input
                value={editor.coverageNote}
                onChange={(event) =>
                  setEditor((previous) =>
                    previous ? { ...previous, coverageNote: event.target.value } : previous,
                  )
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={editor.state === "healthy" ? "default" : "outline"}
                onClick={() =>
                  setEditor((previous) =>
                    previous ? { ...previous, state: "healthy" } : previous,
                  )
                }
              >
                Healthy
              </Button>
              <Button
                size="sm"
                variant={editor.state === "stale" ? "secondary" : "outline"}
                onClick={() =>
                  setEditor((previous) => (previous ? { ...previous, state: "stale" } : previous))
                }
              >
                Stale
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
