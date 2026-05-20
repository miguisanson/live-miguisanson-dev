import { PageShell } from "@/components/layout/PageShell";
import { AIResearchPrototypes } from "@/components/ai-research/AIResearchPrototypes";

export const metadata = {
  title: "AI Research",
  description:
    "Seven Seven AI Research Implementation prototypes for QA, recruitment, and HR workflows using mock draft outputs and human review controls.",
};

export default function AIResearchPage() {
  return (
    <PageShell
      eyebrow="Seven Seven AI Research"
      title="AI Research / AI Prototypes"
      description="Mock-first AI workflow demos for QA, recruitment, and HR support. No API key, real applicant data, employee data, payroll data, or HR records are required."
    >
      <AIResearchPrototypes />
    </PageShell>
  );
}
