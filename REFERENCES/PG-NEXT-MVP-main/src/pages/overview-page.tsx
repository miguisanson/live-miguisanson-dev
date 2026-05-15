import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArchitectureFlow } from "../components/common/architecture-flow";
import { HealthStrip } from "../components/common/health-strip";
import { PageHeader } from "../components/common/page-header";
import { overviewArchitectureLayers, serviceHealthSummary } from "../data/mock-data";
import { useDemoData } from "../context/demo-data-context";
import { StatusChip } from "../components/common/status-chip";

const moduleCards = [
  {
    name: "Brand Overview",
    description: "Market Operations, R&D, and Product Supply insights.",
    route: "/brand-overview",
  },
  {
    name: "Competitor Intelligence",
    description: "Rating trends, share shift signals, and launch detection.",
    route: "/competitor-intelligence",
  },
  {
    name: "Intelligence Command Center",
    description: "Recommendation workflow with approval controls.",
    route: "/intelligence-command-center",
  },
  {
    name: "Operations Dashboard",
    description: "Reliability monitoring, incidents, and recovery command.",
    route: "/operations",
  },
];

export function OverviewPage(): React.ReactElement {
  const { moduleImpact } = useDemoData();

  return (
    <section>
      <PageHeader
        title="Consumer IQ Platform Overview"
        subtitle="Unified view of insight readiness, platform reliability, and business module usability."
        helpText="Use this page to quickly assess whether teams can safely act on insights before drilling into operations."
        right={<Badge variant="info">Azure-connected concepts simulated</Badge>}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {moduleCards.map((card) => (
          <Link key={card.name} to={card.route}>
            <Card className="h-full transition hover:border-[#003DA566] hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle>{card.name}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-2">
                <p className="text-xs text-[var(--muted-fg)]">Open module</p>
                <ArrowUpRight className="h-4 w-4 text-[#003DA5]" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>System Status Strip</CardTitle>
            <CardDescription>
              Ingestion, ETL, AI processing, API service, and dashboard delivery posture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HealthStrip items={serviceHealthSummary} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Impact Strip</CardTitle>
            <CardDescription>How technical issues affect business module readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {moduleImpact.map((item) => (
              <div
                key={item.module}
                className="rounded-md border border-border bg-[var(--bg-soft)] p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.module}</p>
                  <StatusChip state={item.state} />
                </div>
                <p className="text-xs text-slate-700">{item.issue}</p>
                <p className="mt-1 text-xs text-[var(--muted-fg)]">
                  Caused by: {item.causedBy}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>End-to-End Insight Flow</CardTitle>
            <CardDescription>From source ingestion to dashboard delivery.</CardDescription>
          </CardHeader>
          <CardContent>
            <ArchitectureFlow />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monitoring Backbone</CardTitle>
            <CardDescription>
              Conceptual architecture context used by operations monitoring.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {overviewArchitectureLayers.map((layer: string) => (
              <div
                key={layer}
                className="rounded-md border border-border bg-[var(--bg-soft)] px-3 py-2 text-xs text-slate-700"
              >
                {layer}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
