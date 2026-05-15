import { QAHelper } from "@/components/lab/QAHelper";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = {
  title: "Mock AI QA Helper",
};

export default function AIQAHelperPage() {
  return (
    <PageShell
      eyebrow="Lab Demo"
      title="Mock AI QA Helper"
      description="A frontend-only assistant that turns a feature description into deterministic sample test cases."
    >
      <QAHelper />
    </PageShell>
  );
}
