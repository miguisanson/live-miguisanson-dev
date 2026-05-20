export type ModuleId = "qa" | "recruitment" | "hr";

export type ReviewStatus = "Draft" | "Reviewed" | "Approved" | "Needs Revision";

export type FieldConfig = {
  name: string;
  label: string;
  rows?: number;
};

export type ModuleConfig = {
  id: ModuleId;
  slug: string;
  route: string;
  title: string;
  moduleType: string;
  summary: string;
  operatorNote: string;
  accentClass: string;
  metrics: string[];
  guardrails: string[];
  outputPreview: string[];
  fields: FieldConfig[];
  sampleInput: Record<string, string>;
};

export const reviewStatuses: ReviewStatus[] = ["Draft", "Reviewed", "Approved", "Needs Revision"];

export const aiResearchWorkflow = [
  {
    title: "Input",
    description: "Use fictional or sample-only context for the workflow.",
  },
  {
    title: "Draft",
    description: "Generate structured recommendations in mock mode.",
  },
  {
    title: "Review",
    description: "Route the draft to a human tester, recruiter, or HR reviewer.",
  },
  {
    title: "Approve",
    description: "Mark the output only after human validation.",
  },
  {
    title: "Log",
    description: "Record timestamp, module type, input summary, and status.",
  },
];

export const aiResearchModules = {
  qa: {
    id: "qa",
    slug: "qa-assistant",
    route: "/ai-research/qa-assistant",
    title: "AI QA Assistant",
    moduleType: "Quality assurance",
    summary:
      "Turns a feature brief or bug note into review-ready testing artifacts for a human QA tester.",
    operatorNote: "Designed for release checks, bug reproduction, and Playwright draft preparation.",
    accentClass: "ai-module-qa",
    metrics: ["6 output groups", "E2E draft", "Tester gate"],
    guardrails: ["AI-generated draft", "Human tester review required", "Mock mode only"],
    outputPreview: [
      "Test cases and edge cases",
      "Acceptance criteria",
      "Bug summary and failure points",
      "Playwright-style E2E draft",
    ],
    fields: [
      { name: "featureName", label: "Feature name" },
      { name: "description", label: "User story or feature description", rows: 5 },
      { name: "bugReport", label: "Optional bug report", rows: 4 },
    ],
    sampleInput: {
      featureName: "Project filter controls",
      description:
        "A visitor can filter portfolio projects by status and open a project demo without losing their place on the page.",
      bugReport:
        "On small screens, the selected filter sometimes resets after opening a live demo link.",
    },
  },
  recruitment: {
    id: "recruitment",
    slug: "recruitment-assistant",
    route: "/ai-research/recruitment-assistant",
    title: "AI Recruitment Assistant",
    moduleType: "Recruitment review",
    summary:
      "Produces recruiter-review summaries from a job brief and fictional candidate profile without making hiring decisions.",
    operatorNote: "Designed for review queues, skills matching, and candidate communication drafts.",
    accentClass: "ai-module-recruitment",
    metrics: ["1-10 score", "Skill matrix", "Recruiter gate"],
    guardrails: [
      "Priority for recruiter review only",
      "Human recruiter decision required",
      "Do not auto-hire or auto-reject",
      "Avoid protected or sensitive characteristics",
    ],
    outputPreview: [
      "Alignment score and skills match",
      "Education and employment summary",
      "Top 10% review concepts",
      "Interview and candidate message drafts",
    ],
    fields: [
      { name: "jobTitle", label: "Job title" },
      { name: "jobDescription", label: "Job description", rows: 4 },
      { name: "roleCriteria", label: "Role criteria", rows: 4 },
      { name: "candidateProfile", label: "Sample resume or candidate profile", rows: 5 },
      { name: "skillCategories", label: "Optional skill categories" },
    ],
    sampleInput: {
      jobTitle: "Junior QA Analyst",
      jobDescription:
        "Support manual and automated testing for web applications, document defects clearly, and collaborate with developers during release checks.",
      roleCriteria:
        "Testing fundamentals, clear bug reports, basic SQL, communication, attention to detail, and willingness to learn Playwright.",
      candidateProfile:
        "Candidate A completed an IT degree, built classroom web projects, wrote manual test notes for a capstone app, and used SQL in coursework.",
      skillCategories: "Testing, SQL, Communication, Automation readiness",
    },
  },
  hr: {
    id: "hr",
    slug: "hr-assistant",
    route: "/ai-research/hr-assistant",
    title: "AI HR Assistant",
    moduleType: "HR support",
    summary:
      "Drafts HR support responses from sample policies, form requests, timesheets, and compensation factors.",
    operatorNote: "Designed for HR ticket triage, policy lookup, and escalation support.",
    accentClass: "ai-module-hr",
    metrics: ["Policy answer", "Ticket triage", "HR gate"],
    guardrails: [
      "Human HR review required",
      "Use sample data only",
      "Do not finalize payroll",
      "Do not finalize salary decisions",
      "HR confirmation is needed when policy text is unclear",
    ],
    outputPreview: [
      "Policy-based answer",
      "Suggested HR reply and form guidance",
      "Ticket category and priority",
      "Timesheet notes and escalation path",
    ],
    fields: [
      { name: "policyText", label: "HR policy text", rows: 4 },
      { name: "employeeQuestion", label: "Employee question", rows: 3 },
      { name: "formRequest", label: "Form request" },
      { name: "sampleTimesheet", label: "Sample timesheet", rows: 4 },
      { name: "compensationFactors", label: "Compensation factor checklist or sample data", rows: 4 },
    ],
    sampleInput: {
      policyText:
        "Demo policy: employees should submit leave requests five business days before planned leave. Timesheets require supervisor approval before payroll review.",
      employeeQuestion: "Can I submit a leave request for next Friday if I file the form today?",
      formRequest: "Leave request guidance",
      sampleTimesheet:
        "Demo employee: Monday 8h approved, Tuesday 8h pending approval, Wednesday 10h no note, Thursday 8h approved, Friday missing entry.",
      compensationFactors:
        "Sample factors only: role scope, required skills, responsibility level, market range, internal equity, performance evidence, budget approval.",
    },
  },
} satisfies Record<ModuleId, ModuleConfig>;

export const aiResearchModuleList = Object.values(aiResearchModules);

export function getAiResearchModuleBySlug(slug: string) {
  return aiResearchModuleList.find((module) => module.slug === slug);
}
