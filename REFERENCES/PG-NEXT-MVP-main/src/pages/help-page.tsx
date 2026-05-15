import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PageHeader } from "../components/common/page-header";

const helpSections = [
  {
    title: "How to use this platform",
    detail:
      "Start from Overview for end-to-end health, then open Operations Dashboard for reliability command, incidents, and recovery actions.",
  },
  {
    title: "What status labels mean",
    detail:
      "Healthy means data and services are within targets. Degraded means service is up but quality/performance risk exists. Stale means data is available but behind SLA. Limited confidence means outputs are available with caution.",
  },
  {
    title: "Can users edit data here?",
    detail:
      "This prototype is front-end only. You can change local settings and toggles to simulate behavior, but no real backend systems are modified.",
  },
  {
    title: "What happens during stale data",
    detail:
      "Business-facing modules show reliability notices. Operational views indicate the causing incident, fallback mode, and guidance on whether outputs are still safe to use.",
  },
  {
    title: "Role-based experience",
    detail:
      "Business roles focus on business dashboards and recommendations. Operational roles can also access alerts, incidents, runbooks, and monitoring controls.",
  },
];

export function HelpPage(): React.ReactElement {
  return (
    <section className="space-y-5">
      <PageHeader
        title="Help - How to Use Consumer IQ"
        subtitle="Contextual guidance for operations and business users."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {helpSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>Platform guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{section.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
