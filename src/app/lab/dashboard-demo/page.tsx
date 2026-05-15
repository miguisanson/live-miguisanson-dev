import { DashboardDemo } from "@/components/lab/DashboardDemo";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = {
  title: "Dashboard Demo",
};

export default function DashboardDemoPage() {
  return (
    <PageShell
      eyebrow="Lab Demo"
      title="Dashboard Demo"
      description="A compact analytics layout with mock cards, chart placeholders, and recommended actions."
    >
      <DashboardDemo />
    </PageShell>
  );
}
