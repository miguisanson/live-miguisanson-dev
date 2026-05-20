"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  aiResearchModules,
  reviewStatuses,
  type ModuleId,
  type ReviewStatus,
} from "@/data/aiResearch";

type SectionOutput = {
  title: string;
  items: string[];
};

type DraftOutput = {
  module: string;
  moduleType: string;
  timestamp: string;
  inputSummary: string;
  guardrails: string[];
  sections: SectionOutput[];
  codeDraft?: string;
};

type ActivityLogEntry = {
  id: string;
  module: string;
  moduleType: string;
  inputSummary: string;
  reviewStatus: ReviewStatus;
  timestamp: string;
  action: string;
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

function summarize(value: string | undefined, fallback: string) {
  const cleaned = (value ?? "").trim().replace(/\s+/g, " ");
  if (!cleaned) return fallback;
  return cleaned.length > 140 ? `${cleaned.slice(0, 137)}...` : cleaned;
}

function splitCategories(value: string | undefined) {
  const categories = (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return categories.length ? categories : ["Role criteria", "Relevant experience", "Communication"];
}

function makeQaDraft(input: Record<string, string>): DraftOutput {
  const config = aiResearchModules.qa;
  const feature = input.featureName.trim() || "Demo feature";
  const description = summarize(input.description, "No feature description provided.");
  const bug = summarize(input.bugReport, "No optional bug report was provided.");

  return {
    module: config.title,
    moduleType: config.moduleType,
    timestamp: nowLabel(),
    inputSummary: `${feature}: ${description}`,
    guardrails: config.guardrails,
    sections: [
      {
        title: "Test cases",
        items: [
          `Verify the primary ${feature} workflow works from a clean browser session.`,
          "Verify the form or controls preserve user-entered state after navigation and refresh.",
          "Verify success, empty, loading, and error states are visible without layout shifts.",
          "Verify keyboard users can reach and operate every control in the workflow.",
        ],
      },
      {
        title: "Edge cases",
        items: [
          "Empty, very long, duplicate, and special-character input values.",
          "Slow network responses and interrupted navigation.",
          "Mobile viewport, high zoom, reduced motion, and dark mode.",
        ],
      },
      {
        title: "Acceptance criteria",
        items: [
          "The user can complete the intended workflow without losing context.",
          "Invalid or missing inputs produce clear, recoverable guidance.",
          "Existing navigation and live project links still work after the feature is added.",
        ],
      },
      {
        title: "Bug report summary",
        items: [
          bug,
          "Human tester should reproduce the issue, record browser/device details, and confirm release impact.",
        ],
      },
      {
        title: "Possible failure points",
        items: [
          "State reset after route changes or external link opens.",
          "Mismatched labels, selectors, and data attributes in filter controls.",
          "Responsive layout hiding important controls or focus indicators.",
        ],
      },
    ],
    codeDraft: `import { test, expect } from "@playwright/test";

test.describe("${feature}", () => {
  test("keeps the primary workflow usable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /projects/i }).click();
    await expect(page.getByText("${feature}", { exact: false })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("keeps state stable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("navigation")).toBeVisible();
    // AI-generated draft: replace selectors with final implementation details after tester review.
  });
});`,
  };
}

function makeRecruitmentDraft(input: Record<string, string>): DraftOutput {
  const config = aiResearchModules.recruitment;
  const title = input.jobTitle.trim() || "Demo role";
  const categories = splitCategories(input.skillCategories);
  const score = Math.min(10, Math.max(1, 6 + Math.min(2, categories.length > 3 ? 2 : 1)));

  return {
    module: config.title,
    moduleType: config.moduleType,
    timestamp: nowLabel(),
    inputSummary: `${title}: ${summarize(input.roleCriteria, "No role criteria provided.")}`,
    guardrails: config.guardrails,
    sections: [
      {
        title: "1-10 alignment score",
        items: [`${score}/10 demo alignment based only on supplied role criteria and the fictional candidate profile.`],
      },
      {
        title: "Skills match summary",
        items: categories.map(
          (category) => `${category}: partial match requiring recruiter validation against role-related evidence.`
        ),
      },
      {
        title: "Education match",
        items: [
          "Education appears related in this fictional profile. Verify degree, coursework, and credential evidence manually.",
        ],
      },
      {
        title: "Employment history summary",
        items: [
          "The profile shows early-career or project-based experience. Confirm dates, responsibilities, and measurable outcomes during recruiter review.",
        ],
      },
      {
        title: "Relevant experience summary",
        items: [
          "Testing and documentation signals are present in the supplied sample.",
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
        title: "Overall top 10% review list concept",
        items: [
          "Rank candidates by evidence-backed alignment score after recruiter review. This should only prioritize human review order.",
        ],
      },
      {
        title: "Top 10% per skill category concept",
        items: categories.map((category) => `For ${category}, compare only role-relevant evidence tied to that skill.`),
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

function makeHrDraft(input: Record<string, string>): DraftOutput {
  const config = aiResearchModules.hr;
  const policy = input.policyText.trim();
  const question = input.employeeQuestion.trim();
  const hasPolicySignal = Boolean(policy && question && policy.toLowerCase().includes("leave"));

  return {
    module: config.title,
    moduleType: config.moduleType,
    timestamp: nowLabel(),
    inputSummary: summarize(question || input.formRequest, "No HR question or form request provided."),
    guardrails: config.guardrails,
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
        title: "Ticket category",
        items: ["HR inquiry / forms support."],
      },
      {
        title: "Priority level",
        items: [hasPolicySignal ? "Normal." : "Needs HR confirmation."],
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
        title: "Escalation note if unclear",
        items: ["Escalate any unclear, sensitive, salary-related, or policy-conflicting request to an authorized HR reviewer."],
      },
    ],
  };
}

function generateDraft(moduleId: ModuleId, input: Record<string, string>) {
  if (moduleId === "qa") return makeQaDraft(input);
  if (moduleId === "recruitment") return makeRecruitmentDraft(input);
  return makeHrDraft(input);
}

export function AIPrototypeDemo({ moduleId }: { moduleId: ModuleId }) {
  const config = aiResearchModules[moduleId];
  const [input, setInput] = useState<Record<string, string>>(config.sampleInput);
  const [output, setOutput] = useState<DraftOutput | null>(null);
  const [status, setStatus] = useState<ReviewStatus>("Draft");
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  function addLog(action: string, nextStatus: ReviewStatus, nextOutput: DraftOutput | null) {
    setActivityLog((current) => [
      {
        id: `${config.id}-${Date.now()}-${current.length}`,
        module: config.title,
        moduleType: config.moduleType,
        inputSummary: nextOutput?.inputSummary ?? summarize(input[config.fields[0].name], "No generated draft yet."),
        reviewStatus: nextStatus,
        timestamp: nowLabel(),
        action,
      },
      ...current,
    ]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextOutput = generateDraft(moduleId, input);
    setOutput(nextOutput);
    setStatus("Draft");
    addLog("Generated mock draft", "Draft", nextOutput);
  }

  function updateStatus(nextStatus: ReviewStatus) {
    setStatus(nextStatus);
    addLog(`Marked as ${nextStatus}`, nextStatus, output);
  }

  function saveReview() {
    addLog("Saved reviewer checkpoint", status, output);
  }

  return (
    <article className={`ai-wide-shell ai-prototype-workspace ${config.accentClass}`}>
      <header className="ai-workspace-hero">
        <div>
          <Link className="ai-back-link" href="/ai-research">
            AI Research
          </Link>
          <div className="ai-eyebrow">{config.moduleType}</div>
          <h1>{config.title}</h1>
          <p>{config.summary}</p>
        </div>
        <div className="ai-module-status-card">
          <span>Review status</span>
          <strong>{status}</strong>
          <small>{config.operatorNote}</small>
        </div>
      </header>

      <section className="ai-guardrail-strip" aria-label={`${config.title} guardrails`}>
        {config.guardrails.map((guardrail) => (
          <span key={guardrail}>{guardrail}</span>
        ))}
      </section>

      <div className="ai-workbench-grid">
        <section className="ai-input-console" aria-labelledby="ai-input-title">
          <div className="ai-panel-title">
            <span>01</span>
            <h2 id="ai-input-title">Sample input</h2>
          </div>
          <form className="ai-form" onSubmit={handleSubmit}>
            {config.fields.map((field) => (
              <label className="ai-field" key={field.name}>
                <span>{field.label}</span>
                {field.rows ? (
                  <textarea
                    value={input[field.name] ?? ""}
                    rows={field.rows}
                    onChange={(event) => setInput((current) => ({ ...current, [field.name]: event.target.value }))}
                  />
                ) : (
                  <input
                    value={input[field.name] ?? ""}
                    onChange={(event) => setInput((current) => ({ ...current, [field.name]: event.target.value }))}
                  />
                )}
              </label>
            ))}
            <button className="ai-primary-button" type="submit">
              Generate draft
            </button>
          </form>
        </section>

        <section className="ai-output-console" aria-labelledby="ai-output-title">
          <div className="ai-output-toolbar">
            <div className="ai-panel-title">
              <span>02</span>
              <h2 id="ai-output-title">Review output</h2>
            </div>
            {output ? <time>{output.timestamp}</time> : null}
          </div>

          {output ? (
            <>
              <div className="ai-draft-banner">
                <strong>AI-generated draft</strong>
                <span>Human review required before use</span>
              </div>
              <dl className="ai-output-meta">
                <div>
                  <dt>Module type</dt>
                  <dd>{output.moduleType}</dd>
                </div>
                <div>
                  <dt>Input summary</dt>
                  <dd>{output.inputSummary}</dd>
                </div>
                <div>
                  <dt>Review status</dt>
                  <dd>{status}</dd>
                </div>
              </dl>
              <div className="ai-output-list">
                {output.sections.map((section) => (
                  <section key={section.title}>
                    <h3>{section.title}</h3>
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
                {output.codeDraft ? (
                  <section>
                    <h3>Playwright-style E2E test draft</h3>
                    <pre>{output.codeDraft}</pre>
                  </section>
                ) : null}
              </div>
            </>
          ) : (
            <div className="ai-empty-panel">
              <strong>No draft generated</strong>
              <span>Mock mode is active. No AI API or private data is used.</span>
            </div>
          )}
        </section>

        <aside className="ai-review-console" aria-labelledby="ai-review-title">
          <div className="ai-panel-title">
            <span>03</span>
            <h2 id="ai-review-title">Human review</h2>
          </div>
          <div className="ai-status-controls" role="group" aria-label="Review status">
            {reviewStatuses.map((reviewStatus) => (
              <button
                className={status === reviewStatus ? "is-active" : ""}
                key={reviewStatus}
                type="button"
                onClick={() => updateStatus(reviewStatus)}
              >
                {reviewStatus}
              </button>
            ))}
          </div>
          <button className="ai-secondary-button" type="button" onClick={saveReview}>
            Save review checkpoint
          </button>

          <div className="ai-activity-log">
            <h3>Activity log</h3>
            {activityLog.length ? (
              <div className="ai-activity-list">
                {activityLog.map((entry) => (
                  <article key={entry.id}>
                    <div>
                      <strong>{entry.action}</strong>
                      <span>{entry.reviewStatus}</span>
                    </div>
                    <p>{entry.inputSummary}</p>
                    <footer>
                      <span>{entry.moduleType}</span>
                      <time>{entry.timestamp}</time>
                    </footer>
                  </article>
                ))}
              </div>
            ) : (
              <p className="ai-log-empty">No activity yet.</p>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
