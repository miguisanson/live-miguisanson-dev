"use client";

import { FormEvent, useMemo, useState } from "react";

type ReviewStatus = "Draft" | "Reviewed" | "Approved" | "Needs Revision";
type ModuleId = "qa" | "recruitment" | "hr";

type ActivityLogEntry = {
  id: string;
  module: string;
  inputSummary: string;
  reviewStatus: ReviewStatus;
  timestamp: string;
  action: string;
};

type SectionOutput = {
  title: string;
  items: string[];
};

type DraftOutput = {
  module: string;
  timestamp: string;
  inputSummary: string;
  guardrails: string[];
  sections: SectionOutput[];
  testDraft?: string;
};

type QaInput = {
  featureName: string;
  description: string;
  bugReport: string;
};

type RecruitmentInput = {
  jobTitle: string;
  jobDescription: string;
  roleCriteria: string;
  candidateProfile: string;
  skillCategories: string;
};

type HrInput = {
  policyText: string;
  employeeQuestion: string;
  formRequest: string;
  sampleTimesheet: string;
  compensationFactors: string;
};

const moduleNames: Record<ModuleId, string> = {
  qa: "AI QA Assistant",
  recruitment: "AI Recruitment Assistant",
  hr: "AI HR Assistant",
};

const initialStatus: Record<ModuleId, ReviewStatus> = {
  qa: "Draft",
  recruitment: "Draft",
  hr: "Draft",
};

const workflow = [
  "Input",
  "AI-generated draft/recommendation",
  "Human review",
  "Approved output",
  "Activity log",
];

const baselineGuardrails: Record<ModuleId, string[]> = {
  qa: ["AI-generated draft", "Human tester review required"],
  recruitment: [
    "Priority for recruiter review only",
    "Human recruiter decision required",
    "Do not auto-hire or auto-reject",
    "Avoid protected or sensitive characteristics",
  ],
  hr: [
    "Human HR review required",
    "Use sample data only",
    "Do not finalize payroll",
    "Do not finalize salary decisions",
    "HR confirmation is needed when the policy answer is unclear",
  ],
};

const qaStarter: QaInput = {
  featureName: "Project filter controls",
  description:
    "A visitor can filter portfolio projects by status and open a project demo without losing their place on the page.",
  bugReport:
    "On small screens, the selected filter sometimes resets after opening a live demo link.",
};

const recruitmentStarter: RecruitmentInput = {
  jobTitle: "Junior QA Analyst",
  jobDescription:
    "Support manual and automated testing for web applications, document defects clearly, and collaborate with developers during release checks.",
  roleCriteria:
    "Testing fundamentals, clear bug reports, basic SQL, communication, attention to detail, and willingness to learn Playwright.",
  candidateProfile:
    "Candidate A completed an IT degree, built classroom web projects, wrote manual test notes for a capstone app, and used SQL in coursework.",
  skillCategories: "Testing, SQL, Communication, Automation readiness",
};

const hrStarter: HrInput = {
  policyText:
    "Demo policy: employees should submit leave requests five business days before planned leave. Timesheets require supervisor approval before payroll review.",
  employeeQuestion: "Can I submit a leave request for next Friday if I file the form today?",
  formRequest: "Leave request guidance",
  sampleTimesheet:
    "Demo employee: Monday 8h approved, Tuesday 8h pending approval, Wednesday 10h no note, Thursday 8h approved, Friday missing entry.",
  compensationFactors:
    "Sample factors only: role scope, required skills, responsibility level, market range, internal equity, performance evidence, budget approval.",
};

function nowLabel() {
  return new Date().toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function summarize(value: string, fallback: string) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned) return fallback;
  return cleaned.length > 120 ? `${cleaned.slice(0, 117)}...` : cleaned;
}

function splitCategories(value: string) {
  const categories = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return categories.length ? categories : ["Role criteria", "Relevant experience", "Communication"];
}

function makeQaDraft(input: QaInput): DraftOutput {
  const feature = input.featureName.trim() || "Demo feature";
  const description = summarize(input.description, "No feature description provided.");
  const bug = summarize(input.bugReport, "No optional bug report was provided.");

  return {
    module: moduleNames.qa,
    timestamp: nowLabel(),
    inputSummary: `${feature}: ${description}`,
    guardrails: ["AI-generated draft", "Human tester review required", "Mock mode only - no model or external API was called"],
    sections: [
      {
        title: "Test cases",
        items: [
          `Verify the primary ${feature} workflow works from a clean browser session.`,
          "Verify the form or controls preserve user-entered state after navigation and refresh.",
          "Verify the interface communicates success, empty, and error states clearly.",
          "Verify keyboard users can reach and operate every control in the workflow.",
        ],
      },
      {
        title: "Edge cases",
        items: [
          "Empty, very long, duplicate, and special-character input values.",
          "Slow network responses and interrupted navigation.",
          "Mobile viewport, high zoom, and reduced motion preferences.",
        ],
      },
      {
        title: "Acceptance criteria",
        items: [
          "The user can complete the intended workflow without losing context.",
          "Invalid or missing inputs produce clear, recoverable guidance.",
          "Existing page navigation and project links still work after the feature is added.",
        ],
      },
      {
        title: "Bug report summary",
        items: [
          bug,
          "Tester should reproduce the issue, record browser/device details, and confirm whether it blocks release.",
        ],
      },
      {
        title: "Possible failure points",
        items: [
          "State reset after route changes or external link opens.",
          "Mismatched labels and data attributes in filter controls.",
          "Focus order or responsive layout hiding important controls.",
        ],
      },
    ],
    testDraft: `import { test, expect } from "@playwright/test";

test.describe("${feature}", () => {
  test("keeps the primary workflow usable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /projects/i }).click();
    await expect(page.getByText("${feature}", { exact: false })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("handles the reported edge case", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("navigation")).toBeVisible();
    // AI-generated draft: replace selectors with final implementation details after tester review.
  });
});`,
  };
}

function makeRecruitmentDraft(input: RecruitmentInput): DraftOutput {
  const title = input.jobTitle.trim() || "Demo role";
  const categories = splitCategories(input.skillCategories);
  const score = Math.min(10, Math.max(1, 6 + Math.min(2, categories.length > 3 ? 2 : 1)));

  return {
    module: moduleNames.recruitment,
    timestamp: nowLabel(),
    inputSummary: `${title}: ${summarize(input.roleCriteria, "No role criteria provided.")}`,
    guardrails: [
      "AI-generated draft",
      "Priority for recruiter review only",
      "Human recruiter decision required",
      "Do not auto-hire or auto-reject",
      "Avoid protected or sensitive characteristics",
    ],
    sections: [
      {
        title: "1-10 alignment score",
        items: [`${score}/10 demo alignment based only on the supplied job criteria and sample candidate profile.`],
      },
      {
        title: "Skills match summary",
        items: categories.map((category) => `${category}: partial match requiring recruiter validation against evidence in the resume.`),
      },
      {
        title: "Education match",
        items: ["Candidate education appears related to the role in this fictional demo profile; verify degree, coursework, and credential evidence manually."],
      },
      {
        title: "Employment history summary",
        items: ["The profile shows early-career or project-based experience. Confirm dates, responsibilities, and measurable outcomes during recruiter review."],
      },
      {
        title: "Relevant experience summary",
        items: [
          "Testing and documentation signals are present in the sample profile.",
          "Automation readiness is a development area unless the candidate can show hands-on Playwright or equivalent work.",
        ],
      },
      {
        title: "Missing or unclear requirements",
        items: [
          "Depth of production QA experience is unclear.",
          "Availability, work authorization, compensation expectations, and references are not evaluated in this mock.",
        ],
      },
      {
        title: "Top 10% shortlist concepts",
        items: [
          "Overall top 10% list: rank candidates by evidence-backed alignment score after recruiter review.",
          ...categories.map((category) => `Top 10% for ${category}: compare only role-relevant evidence for that skill category.`),
        ],
      },
      {
        title: "Suggested interview questions",
        items: [
          "Tell me about a defect you documented and how you helped the team reproduce it.",
          "How would you decide which regression tests should run before a release?",
          "What SQL queries have you written to verify data or investigate an issue?",
        ],
      },
      {
        title: "Candidate communication draft",
        items: [
          "Thank you for applying. Your profile has been marked for recruiter review based on role-related criteria. A recruiter may contact you if your background matches the next review stage.",
        ],
      },
    ],
  };
}

function makeHrDraft(input: HrInput): DraftOutput {
  const policy = input.policyText.trim();
  const question = input.employeeQuestion.trim();
  const hasPolicySignal = Boolean(policy && question && policy.toLowerCase().includes("leave"));

  return {
    module: moduleNames.hr,
    timestamp: nowLabel(),
    inputSummary: summarize(question || input.formRequest, "No HR question or form request provided."),
    guardrails: [
      "AI-generated draft",
      "Human HR review required",
      "Sample data only",
      "Do not finalize payroll",
      "Do not finalize salary decisions",
      "If the answer is not found, HR confirmation is needed",
    ],
    sections: [
      {
        title: "Policy-based answer",
        items: [
          hasPolicySignal
            ? "Based on the demo policy, planned leave should be submitted five business days before the requested date."
            : "The supplied policy text does not clearly answer the question. HR confirmation is needed before replying.",
        ],
      },
      {
        title: "Suggested HR reply",
        items: [
          hasPolicySignal
            ? "Draft reply: Please submit the leave request form as soon as possible. HR should confirm whether the request still meets the five-business-day notice rule."
            : "Draft reply: I need to confirm this with HR because the answer is not clearly covered by the provided policy text.",
        ],
      },
      {
        title: "Form guidance",
        items: [
          summarize(input.formRequest, "No form request provided."),
          "Confirm required fields, approver, submission deadline, and supporting documents before final processing.",
        ],
      },
      {
        title: "Ticket category and priority",
        items: ["Category: HR inquiry / forms support.", hasPolicySignal ? "Priority: Normal." : "Priority: Needs HR confirmation."],
      },
      {
        title: "Recommended next action",
        items: [
          hasPolicySignal
            ? "Route to HR staff for final response and policy confirmation."
            : "Escalate to HR because the provided information is incomplete or unclear.",
        ],
      },
      {
        title: "Compensation factor summary",
        items: [
          summarize(input.compensationFactors, "No compensation factor checklist provided."),
          "This is a review summary only and must not be used as a final salary or payroll decision.",
        ],
      },
      {
        title: "Timesheet checking notes",
        items: [
          summarize(input.sampleTimesheet, "No sample timesheet provided."),
          "Flag pending approval, unusual hours, missing entries, and missing explanations for human review.",
        ],
      },
      {
        title: "Escalation note",
        items: ["Escalate any unclear, sensitive, salary-related, or policy-conflicting request to an authorized HR reviewer."],
      },
    ],
  };
}

export function AIResearchPrototypes() {
  const [qaInput, setQaInput] = useState<QaInput>(qaStarter);
  const [recruitmentInput, setRecruitmentInput] = useState<RecruitmentInput>(recruitmentStarter);
  const [hrInput, setHrInput] = useState<HrInput>(hrStarter);
  const [outputs, setOutputs] = useState<Record<ModuleId, DraftOutput | null>>({
    qa: null,
    recruitment: null,
    hr: null,
  });
  const [statuses, setStatuses] = useState<Record<ModuleId, ReviewStatus>>(initialStatus);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  const prototypeCards = useMemo(
    () => [
      {
        id: "qa" as const,
        title: moduleNames.qa,
        description: "Generates test cases, edge cases, acceptance criteria, bug summaries, failure points, and Playwright-style drafts.",
        href: "#ai-qa-assistant",
      },
      {
        id: "recruitment" as const,
        title: moduleNames.recruitment,
        description: "Creates role-alignment summaries, review-only shortlist concepts, interview questions, and candidate communication drafts.",
        href: "#ai-recruitment-assistant",
      },
      {
        id: "hr" as const,
        title: moduleNames.hr,
        description: "Supports policy Q&A, form guidance, ticket triage, compensation factor summaries, and timesheet checking notes.",
        href: "#ai-hr-assistant",
      },
    ],
    []
  );

  function addLog(moduleId: ModuleId, output: DraftOutput | null, status: ReviewStatus, action: string) {
    setActivityLog((current) => [
      {
        id: `${moduleId}-${Date.now()}`,
        module: moduleNames[moduleId],
        inputSummary: output?.inputSummary ?? "No generated draft yet.",
        reviewStatus: status,
        timestamp: nowLabel(),
        action,
      },
      ...current,
    ]);
  }

  function generate(moduleId: ModuleId) {
    const output =
      moduleId === "qa"
        ? makeQaDraft(qaInput)
        : moduleId === "recruitment"
          ? makeRecruitmentDraft(recruitmentInput)
          : makeHrDraft(hrInput);

    setOutputs((current) => ({ ...current, [moduleId]: output }));
    setStatuses((current) => ({ ...current, [moduleId]: "Draft" }));
    addLog(moduleId, output, "Draft", "Generated mock draft");
  }

  function updateStatus(moduleId: ModuleId, status: ReviewStatus) {
    setStatuses((current) => ({ ...current, [moduleId]: status }));
    addLog(moduleId, outputs[moduleId], status, `Marked as ${status}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>, moduleId: ModuleId) {
    event.preventDefault();
    generate(moduleId);
  }

  return (
    <article className="ai-research-page">
      <section className="ai-overview">
        <p>
          The Seven Seven research focused on practical AI support for QA, Recruitment, and HR. The goal is not blind
          automation; it is faster draft preparation, clearer review queues, and auditable human decisions.
        </p>
        <div className="ai-workflow" aria-label="AI workflow">
          {workflow.map((step, index) => (
            <div className="ai-workflow-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="ai-prototype-grid" aria-label="Prototype list">
        {prototypeCards.map((prototype) => (
          <article className="ai-prototype-card" key={prototype.id}>
            <div className="ai-card-kicker">Mock prototype</div>
            <h2>{prototype.title}</h2>
            <p>{prototype.description}</p>
            <a className="project-view-button" href={prototype.href}>
              Open prototype
            </a>
          </article>
        ))}
      </section>

      <PrototypeSection
        id="ai-qa-assistant"
        moduleId="qa"
        title={moduleNames.qa}
        status={statuses.qa}
        baselineGuardrails={baselineGuardrails.qa}
        output={outputs.qa}
        onStatus={updateStatus}
      >
        <form className="ai-form" onSubmit={(event) => handleSubmit(event, "qa")}>
          <TextInput label="Feature name" value={qaInput.featureName} onChange={(value) => setQaInput((current) => ({ ...current, featureName: value }))} />
          <TextArea label="User story or feature description" rows={5} value={qaInput.description} onChange={(value) => setQaInput((current) => ({ ...current, description: value }))} />
          <TextArea label="Optional bug report" rows={4} value={qaInput.bugReport} onChange={(value) => setQaInput((current) => ({ ...current, bugReport: value }))} />
          <button className="ai-action-button" type="submit">
            Generate QA draft
          </button>
        </form>
      </PrototypeSection>

      <PrototypeSection
        id="ai-recruitment-assistant"
        moduleId="recruitment"
        title={moduleNames.recruitment}
        status={statuses.recruitment}
        baselineGuardrails={baselineGuardrails.recruitment}
        output={outputs.recruitment}
        onStatus={updateStatus}
      >
        <form className="ai-form" onSubmit={(event) => handleSubmit(event, "recruitment")}>
          <TextInput label="Job title" value={recruitmentInput.jobTitle} onChange={(value) => setRecruitmentInput((current) => ({ ...current, jobTitle: value }))} />
          <TextArea label="Job description" rows={4} value={recruitmentInput.jobDescription} onChange={(value) => setRecruitmentInput((current) => ({ ...current, jobDescription: value }))} />
          <TextArea label="Role criteria" rows={4} value={recruitmentInput.roleCriteria} onChange={(value) => setRecruitmentInput((current) => ({ ...current, roleCriteria: value }))} />
          <TextArea label="Sample resume or candidate profile" rows={5} value={recruitmentInput.candidateProfile} onChange={(value) => setRecruitmentInput((current) => ({ ...current, candidateProfile: value }))} />
          <TextInput label="Optional skill categories" value={recruitmentInput.skillCategories} onChange={(value) => setRecruitmentInput((current) => ({ ...current, skillCategories: value }))} />
          <button className="ai-action-button" type="submit">
            Generate recruitment draft
          </button>
        </form>
      </PrototypeSection>

      <PrototypeSection
        id="ai-hr-assistant"
        moduleId="hr"
        title={moduleNames.hr}
        status={statuses.hr}
        baselineGuardrails={baselineGuardrails.hr}
        output={outputs.hr}
        onStatus={updateStatus}
      >
        <form className="ai-form" onSubmit={(event) => handleSubmit(event, "hr")}>
          <TextArea label="HR policy text" rows={4} value={hrInput.policyText} onChange={(value) => setHrInput((current) => ({ ...current, policyText: value }))} />
          <TextArea label="Employee question" rows={3} value={hrInput.employeeQuestion} onChange={(value) => setHrInput((current) => ({ ...current, employeeQuestion: value }))} />
          <TextInput label="Form request" value={hrInput.formRequest} onChange={(value) => setHrInput((current) => ({ ...current, formRequest: value }))} />
          <TextArea label="Sample timesheet" rows={4} value={hrInput.sampleTimesheet} onChange={(value) => setHrInput((current) => ({ ...current, sampleTimesheet: value }))} />
          <TextArea label="Compensation factor checklist or sample data" rows={4} value={hrInput.compensationFactors} onChange={(value) => setHrInput((current) => ({ ...current, compensationFactors: value }))} />
          <button className="ai-action-button" type="submit">
            Generate HR draft
          </button>
        </form>
      </PrototypeSection>

      <section className="ai-log-section" aria-label="Activity log">
        <div className="ai-section-heading">
          <div>
            <div className="ai-card-kicker">Audit trail demo</div>
            <h2>Activity log</h2>
          </div>
          <span className="ai-status-pill">Local state only</span>
        </div>
        {activityLog.length ? (
          <div className="ai-log-list">
            {activityLog.map((entry) => (
              <article className="ai-log-entry" key={entry.id}>
                <div>
                  <strong>{entry.module}</strong>
                  <p>{entry.inputSummary}</p>
                </div>
                <div>
                  <span>{entry.action}</span>
                  <span>{entry.reviewStatus}</span>
                  <time>{entry.timestamp}</time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="ai-empty-state">Generate a draft or change a review status to create an activity log entry.</p>
        )}
      </section>
    </article>
  );
}

function PrototypeSection({
  id,
  moduleId,
  title,
  status,
  baselineGuardrails,
  output,
  onStatus,
  children,
}: {
  id: string;
  moduleId: ModuleId;
  title: string;
  status: ReviewStatus;
  baselineGuardrails: string[];
  output: DraftOutput | null;
  onStatus: (moduleId: ModuleId, status: ReviewStatus) => void;
  children: React.ReactNode;
}) {
  const statusOptions: ReviewStatus[] = ["Draft", "Reviewed", "Approved", "Needs Revision"];

  return (
    <section className="ai-module" id={id}>
      <div className="ai-section-heading">
        <div>
          <div className="ai-card-kicker">Module type: {title}</div>
          <h2>{title}</h2>
        </div>
        <span className="ai-status-pill">{status}</span>
      </div>
      <div className="ai-baseline-guardrails" aria-label={`${title} guardrails`}>
        {baselineGuardrails.map((guardrail) => (
          <span key={guardrail}>{guardrail}</span>
        ))}
      </div>

      <div className="ai-module-grid">
        <div>{children}</div>
        <div className="ai-output-panel">
          <div className="ai-output-header">
            <div>
              <span className="ai-draft-label">AI-generated draft</span>
              <h3>{output ? `${output.module} output` : "Generated output"}</h3>
            </div>
            {output ? <time>{output.timestamp}</time> : null}
          </div>

          {output ? (
            <>
              <div className="ai-guardrails">
                {output.guardrails.map((guardrail) => (
                  <span key={guardrail}>{guardrail}</span>
                ))}
              </div>
              <p className="ai-input-summary">
                <strong>Input summary:</strong> {output.inputSummary}
              </p>
              <div className="ai-output-sections">
                {output.sections.map((section) => (
                  <section key={section.title}>
                    <h4>{section.title}</h4>
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
                {output.testDraft ? (
                  <section>
                    <h4>Playwright-style E2E test draft</h4>
                    <pre>{output.testDraft}</pre>
                  </section>
                ) : null}
              </div>
              <div className="ai-review-controls">
                {statusOptions.map((option) => (
                  <button key={option} type="button" onClick={() => onStatus(moduleId, option)} className={status === option ? "is-active" : ""}>
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="ai-empty-state">Fill in the sample fields and generate a mock draft. This page does not call an AI API.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="ai-field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="ai-field">
      <span>{label}</span>
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
