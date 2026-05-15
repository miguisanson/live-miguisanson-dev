import { BrainCircuit, Lightbulb, Shield } from "lucide-react";
import { opportunityCards } from "../data/mock-data";
import { useOpportunityMode } from "../context/opportunity-mode";
import { HelpTip } from "../components/help/help-tip";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PageHeader } from "../components/common/page-header";

export function OpportunitiesPage(): React.ReactElement {
  const { enabled, setEnabled } = useOpportunityMode();
  const availableNext = opportunityCards.filter((item) => item.stage === "Available Next");
  const futureEnhancements = opportunityCards.filter(
    (item) => item.stage === "Future Enhancements",
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Future Capabilities"
        subtitle="Explore upcoming enhancements with controlled visibility."
        helpText="Opportunity Mode reveals future-oriented concepts while keeping core operational controls unchanged."
        right={<Badge variant="info">Role-aware demo mode</Badge>}
      />

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Opportunity Mode</p>
            <p className="text-xs text-slate-600">
              Turn on to view advanced concepts such as advisory AI-assisted operations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <HelpTip
              title="Opportunity Mode"
              content="OFF shows core features only. ON reveals next-phase and future-enhancement concepts for demo discussion."
            />
          </div>
        </CardContent>
      </Card>

      {enabled ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Available Next</CardTitle>
              <CardDescription>
                Near-term additions that expand capability without changing safety controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {availableNext.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border bg-[var(--bg-soft)] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <Lightbulb className="h-4 w-4 text-[#003DA5]" />
                  </div>
                  <p className="text-xs text-[var(--muted-fg)]">{item.summary}</p>
                  <Badge variant="success" className="mt-3">
                    Available Next
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Future Enhancements</CardTitle>
              <CardDescription>
                Long-horizon concepts for trust and decision-safety evolution.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {futureEnhancements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border bg-[rgba(0,158,223,0.06)] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <BrainCircuit className="h-4 w-4 text-[#003DA5]" />
                  </div>
                  <p className="text-xs text-[var(--muted-fg)]">{item.summary}</p>
                  <Badge variant="info" className="mt-3">
                    Future Enhancements
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-slate-700">
              Opportunity Mode is OFF. Enable it to view next-phase and future enhancement cards.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Future Opportunity: AI-Assisted Operations</CardTitle>
          <CardDescription>Advisory and controlled assistance concepts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              Incident summarization
            </div>
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              Root-cause suggestion
            </div>
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              Runbook recommendation
            </div>
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              Alert grouping and deduplication
            </div>
            <div className="rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              RCA drafting assistance
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-md border border-[#003DA566] bg-[#e8f7ff] p-3 text-sm text-slate-800">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#003DA5]" />
            <p>
              AI suggests actions, but humans or approved scripts execute recovery.
              No autonomous high-risk production changes.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
