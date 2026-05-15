export type LabDemo = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export const labDemos: LabDemo[] = [
  {
    slug: "ai-workout-planner",
    title: "Mock AI Workout Planner",
    description:
      "A local-only form that returns a deterministic workout plan from mock rules. No model or account is used yet.",
    tags: ["Mock AI", "Forms", "Planner UI"],
  },
  {
    slug: "ai-qa-helper",
    title: "Mock AI QA Helper",
    description:
      "A prototype QA assistant that transforms a feature description into sample test cases using mock logic.",
    tags: ["Mock AI", "QA", "Testing"],
  },
  {
    slug: "dashboard-demo",
    title: "Dashboard Demo",
    description:
      "A compact analytics dashboard with mock metrics, chart placeholders, and recommended actions.",
    tags: ["Dashboard", "Analytics", "Mock data"],
  },
];
