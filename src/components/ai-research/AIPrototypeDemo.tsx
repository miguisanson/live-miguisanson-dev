"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { aiResearchModules, reviewStatuses, type ModuleId, type ReviewStatus } from "@/data/aiResearch";
import {
  candidateProfiles,
  hrPolicies,
  hrTickets,
  qaWorkItems,
  recruitmentJobs,
  type CandidateProfile,
  type HrTicket,
  type QaWorkItem,
  type RecruitmentJob,
} from "@/data/aiResearchDemo";

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
  action: string;
  moduleType: string;
  inputSummary: string;
  reviewStatus: ReviewStatus;
  timestamp: string;
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

function addEntry(
  current: ActivityLogEntry[],
  action: string,
  moduleType: string,
  inputSummary: string,
  reviewStatus: ReviewStatus
) {
  return [
    {
      id: `${moduleType}-${Date.now()}-${current.length}`,
      action,
      moduleType,
      inputSummary,
      reviewStatus,
      timestamp: nowLabel(),
    },
    ...current,
  ];
}

function matchesSkill(candidateSkill: string, requirement: string) {
  const skill = candidateSkill.toLowerCase();
  const required = requirement.toLowerCase();
  return skill.includes(required) || required.includes(skill);
}

function candidateScore(job: RecruitmentJob, candidate: CandidateProfile) {
  const matched = job.criteria.filter((criterion) =>
    candidate.skills.some((skill) => matchesSkill(skill, criterion))
  );
  const base = Math.round((matched.length / job.criteria.length) * 10);
  return Math.min(10, Math.max(1, base));
}

function matchedSkills(job: RecruitmentJob, candidate: CandidateProfile) {
  return job.criteria.filter((criterion) => candidate.skills.some((skill) => matchesSkill(skill, criterion)));
}

function missingCriteria(job: RecruitmentJob, candidate: CandidateProfile) {
  return job.criteria.filter((criterion) => !candidate.skills.some((skill) => matchesSkill(skill, criterion)));
}

function makeQaDraft(item: QaWorkItem, environment: string): DraftOutput {
  const config = aiResearchModules.qa;

  return {
    module: config.title,
    moduleType: config.moduleType,
    timestamp: nowLabel(),
    inputSummary: `${item.id} ${item.featureName} in ${environment}`,
    guardrails: config.guardrails,
    sections: [
      {
        title: "Test cases",
        items: [
          ...item.seedCases,
          `Verify the workflow in ${environment}.`,
          "Verify the user can recover cleanly from empty, loading, and error states.",
        ],
      },
      {
        title: "Edge cases",
        items: [
          "Refresh after state changes.",
          "Open direct route URLs.",
          "Resize between desktop and mobile while the workflow is active.",
          "Use keyboard-only navigation and browser zoom.",
        ],
      },
      {
        title: "Acceptance criteria",
        items: item.acceptanceCriteria,
      },
      {
        title: "Bug report summary",
        items: [
          item.bugReport,
          "Human tester should reproduce the defect, record device/browser details, and decide release impact.",
        ],
      },
      {
        title: "Possible failure points",
        items: item.failurePoints,
      },
      {
        title: "Existing coverage to reuse",
        items: item.existingCoverage,
      },
    ],
    codeDraft: `import { test, expect } from "@playwright/test";

test.describe("${item.featureName}", () => {
  test("supports the primary user workflow", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /projects|dashboard|alerts/i }).click();
    await expect(page.getByText("${item.featureName}", { exact: false })).toBeVisible();
  });

  test("checks the reported risk area", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    // AI-generated draft: tester must replace broad selectors with final product selectors.
    await expect(page.getByRole("main")).toBeVisible();
  });
});`,
  };
}

function makeRecruitmentDraft(job: RecruitmentJob, candidate: CandidateProfile): DraftOutput {
  const config = aiResearchModules.recruitment;
  const score = candidateScore(job, candidate);
  const matched = matchedSkills(job, candidate);
  const missing = missingCriteria(job, candidate);

  return {
    module: config.title,
    moduleType: config.moduleType,
    timestamp: nowLabel(),
    inputSummary: `${candidate.name} for ${job.title} (${score}/10 review priority)`,
    guardrails: config.guardrails,
    sections: [
      {
        title: "1-10 alignment score",
        items: [`${score}/10 review-priority score based only on role criteria and fictional profile evidence.`],
      },
      {
        title: "Skills match summary",
        items: matched.length
          ? matched.map((skill) => `${skill}: candidate profile has role-related evidence to verify.`)
          : ["No direct skill matches found in the fictional profile."],
      },
      {
        title: "Education match",
        items: [candidate.education],
      },
      {
        title: "Employment history summary",
        items: [candidate.employmentHistory],
      },
      {
        title: "Relevant experience summary",
        items: [candidate.experience],
      },
      {
        title: "Missing or unclear requirements",
        items: [...missing, ...candidate.unclearRequirements].length
          ? [...missing, ...candidate.unclearRequirements]
          : ["No major unclear requirements in this fictional profile. Recruiter must still verify evidence."],
      },
      {
        title: "Overall top 10% review list concept",
        items: [
          "Use this score only to prioritize recruiter review order. Do not auto-hire, auto-reject, or make final decisions.",
        ],
      },
      {
        title: "Top 10% per skill category concept",
        items: job.skillCategories.map((category) => {
          const hasSignal = candidate.skills.some((skill) => matchesSkill(skill, category));
          return `${category}: ${hasSignal ? "candidate has reviewable evidence" : "insufficient direct evidence"}.`;
        }),
      },
      {
        title: "Suggested interview questions",
        items: [
          `Tell me about your strongest evidence for ${matched[0] ?? job.criteria[0]}.`,
          "Walk me through a time you documented a problem and helped another person act on it.",
          `What would you need to learn first to succeed as a ${job.title}?`,
        ],
      },
      {
        title: "Candidate communication draft",
        items: [
          `Hello ${candidate.name}, thank you for your interest in the ${job.title} role. Your profile has been marked for recruiter review based on role-related criteria. A recruiter may contact you if your background matches the next review stage.`,
        ],
      },
    ],
  };
}

function makeHrDraft(ticket: HrTicket): DraftOutput {
  const config = aiResearchModules.hr;
  const linkedPolicies = hrPolicies.filter((policy) => ticket.linkedPolicyIds.includes(policy.id));
  const policyFound = linkedPolicies.length > 0;

  return {
    module: config.title,
    moduleType: config.moduleType,
    timestamp: nowLabel(),
    inputSummary: `${ticket.id} ${ticket.category}: ${ticket.question}`,
    guardrails: config.guardrails,
    sections: [
      {
        title: "Policy-based answer",
        items: policyFound
          ? linkedPolicies.map((policy) => `${policy.title}: ${policy.text}`)
          : ["The answer is not clearly found in the sample policy database. HR confirmation is needed."],
      },
      {
        title: "Suggested HR reply",
        items: [
          policyFound
            ? `Draft reply to ${ticket.requester}: Based on the sample policy, HR should review the request details and confirm the next step before final action.`
            : `Draft reply to ${ticket.requester}: I need to confirm this with HR because the policy answer is unclear.`,
        ],
      },
      {
        title: "Form guidance",
        items: [
          ticket.formRequest,
          "Confirm required fields, approver, requested date, and supporting documents before processing.",
        ],
      },
      {
        title: "Ticket category",
        items: [ticket.category],
      },
      {
        title: "Priority level",
        items: [ticket.priority],
      },
      {
        title: "Recommended next action",
        items: linkedPolicies.length
          ? linkedPolicies.map((policy) => policy.escalationRule)
          : ["Escalate to HR because the sample database has no clear policy match."],
      },
      {
        title: "Compensation factor summary",
        items: [
          ticket.compensationFactors.join(", "),
          "Review only. This must not finalize payroll, compensation, or salary decisions.",
        ],
      },
      {
        title: "Timesheet checking notes",
        items: [
          ticket.sampleTimesheet,
          "Flag missing entries, pending approvals, unusual hours, and missing explanations for HR review.",
        ],
      },
      {
        title: "Escalation note if unclear",
        items: ["Escalate unclear, sensitive, payroll-related, or salary-related items to an authorized HR reviewer."],
      },
    ],
  };
}

export function AIPrototypeDemo({ moduleId }: { moduleId: ModuleId }) {
  if (moduleId === "qa") return <QaAssistantWorkspace />;
  if (moduleId === "recruitment") return <RecruitmentAssistantWorkspace />;
  return <HrAssistantWorkspace />;
}

function WorkspaceHeader({
  moduleId,
  status,
}: {
  moduleId: ModuleId;
  status: ReviewStatus;
}) {
  const config = aiResearchModules[moduleId];

  return (
    <>
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
          <span>Current review status</span>
          <strong>{status}</strong>
          <small>{config.operatorNote}</small>
        </div>
      </header>

      <section className="ai-guardrail-strip" aria-label={`${config.title} guardrails`}>
        {config.guardrails.map((guardrail) => (
          <span key={guardrail}>{guardrail}</span>
        ))}
      </section>
    </>
  );
}

function OutputConsole({ output, status }: { output: DraftOutput | null; status: ReviewStatus }) {
  return (
    <section className="ai-output-console" aria-labelledby="ai-output-title">
      <div className="ai-output-toolbar">
        <div className="ai-panel-title">
          <span>02</span>
          <h2 id="ai-output-title">Generated work draft</h2>
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
          <span>Select a demo record and run the assistant. Mock mode is active; no private data or AI API is used.</span>
        </div>
      )}
    </section>
  );
}

function ReviewConsole({
  status,
  activityLog,
  onStatus,
  onSave,
  children,
}: {
  status: ReviewStatus;
  activityLog: ActivityLogEntry[];
  onStatus: (status: ReviewStatus) => void;
  onSave: () => void;
  children?: React.ReactNode;
}) {
  return (
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
            onClick={() => onStatus(reviewStatus)}
          >
            {reviewStatus}
          </button>
        ))}
      </div>
      <button className="ai-secondary-button" type="button" onClick={onSave}>
        Save review checkpoint
      </button>

      {children}

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
  );
}

function QaAssistantWorkspace() {
  const config = aiResearchModules.qa;
  const [selectedId, setSelectedId] = useState(qaWorkItems[0].id);
  const [environment, setEnvironment] = useState(qaWorkItems[0].environment);
  const [output, setOutput] = useState<DraftOutput | null>(null);
  const [status, setStatus] = useState<ReviewStatus>("Draft");
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [testPlan, setTestPlan] = useState<string[]>([]);
  const [runResults, setRunResults] = useState<string[]>([]);

  const selectedItem = qaWorkItems.find((item) => item.id === selectedId) ?? qaWorkItems[0];

  function log(action: string, nextStatus = status, summary = selectedItem.featureName) {
    setActivityLog((current) => addEntry(current, action, config.moduleType, summary, nextStatus));
  }

  function generateDraft() {
    const draft = makeQaDraft(selectedItem, environment);
    setOutput(draft);
    setStatus("Draft");
    log("Generated QA draft", "Draft", draft.inputSummary);
  }

  function addToPlan() {
    const cases = selectedItem.seedCases.filter((testCase) => !testPlan.includes(testCase));
    setTestPlan((current) => [...current, ...cases]);
    log("Added draft cases to test plan", status, selectedItem.featureName);
  }

  function simulateRun() {
    const results = selectedItem.seedCases.map((testCase, index) => {
      const result = selectedItem.priority === "High" && index === 1 ? "Needs investigation" : "Passed";
      return `${result}: ${testCase}`;
    });
    setRunResults(results);
    log("Simulated manual test run", status, selectedItem.featureName);
  }

  return (
    <article className={`ai-wide-shell ai-prototype-workspace ${config.accentClass}`}>
      <WorkspaceHeader moduleId="qa" status={status} />
      <div className="ai-workbench-grid">
        <section className="ai-input-console" aria-labelledby="ai-db-title">
          <div className="ai-panel-title">
            <span>01</span>
            <h2 id="ai-db-title">QA work queue</h2>
          </div>
          <div className="ai-database-list">
            {qaWorkItems.map((item) => (
              <button
                className={item.id === selectedItem.id ? "ai-record-button is-active" : "ai-record-button"}
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  setEnvironment(item.environment);
                }}
              >
                <strong>{item.featureName}</strong>
                <span>{item.id} · {item.project}</span>
                <small>{item.priority} · {item.status}</small>
              </button>
            ))}
          </div>

          <div className="ai-record-detail">
            <h3>{selectedItem.featureName}</h3>
            <p>{selectedItem.userStory}</p>
            <dl className="ai-record-meta">
              <div>
                <dt>Owner</dt>
                <dd>{selectedItem.owner}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{selectedItem.priority}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedItem.status}</dd>
              </div>
            </dl>
            <label className="ai-field">
              <span>Test environment</span>
              <input value={environment} onChange={(event) => setEnvironment(event.target.value)} />
            </label>
            <div className="ai-simulation-actions">
              <button className="ai-primary-button" type="button" onClick={generateDraft}>
                Generate QA draft
              </button>
              <button className="ai-secondary-button" type="button" onClick={addToPlan}>
                Add cases to test plan
              </button>
              <button className="ai-secondary-button" type="button" onClick={simulateRun}>
                Simulate test run
              </button>
            </div>
          </div>
        </section>

        <OutputConsole output={output} status={status} />

        <ReviewConsole
          status={status}
          activityLog={activityLog}
          onStatus={(nextStatus) => {
            setStatus(nextStatus);
            log(`Marked as ${nextStatus}`, nextStatus);
          }}
          onSave={() => log("Saved QA review checkpoint")}
        >
          <div className="ai-side-panel">
            <h3>Test plan</h3>
            {testPlan.length ? (
              <ul>
                {testPlan.map((testCase) => (
                  <li key={testCase}>{testCase}</li>
                ))}
              </ul>
            ) : (
              <p>No test cases added yet.</p>
            )}
            {runResults.length ? (
              <>
                <h3>Run results</h3>
                <ul>
                  {runResults.map((result) => (
                    <li key={result}>{result}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </ReviewConsole>
      </div>
    </article>
  );
}

function RecruitmentAssistantWorkspace() {
  const config = aiResearchModules.recruitment;
  const [selectedJobId, setSelectedJobId] = useState(recruitmentJobs[0].id);
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidateProfiles[0].id);
  const [output, setOutput] = useState<DraftOutput | null>(null);
  const [status, setStatus] = useState<ReviewStatus>("Draft");
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [reviewList, setReviewList] = useState<CandidateProfile[]>([]);

  const selectedJob = recruitmentJobs.find((job) => job.id === selectedJobId) ?? recruitmentJobs[0];
  const selectedCandidate =
    candidateProfiles.find((candidate) => candidate.id === selectedCandidateId) ?? candidateProfiles[0];

  const rankedCandidates = useMemo(
    () =>
      [...candidateProfiles].sort((left, right) => candidateScore(selectedJob, right) - candidateScore(selectedJob, left)),
    [selectedJob]
  );

  function log(action: string, nextStatus = status, summary = `${selectedCandidate.name} for ${selectedJob.title}`) {
    setActivityLog((current) => addEntry(current, action, config.moduleType, summary, nextStatus));
  }

  function generateDraft(candidate = selectedCandidate) {
    const draft = makeRecruitmentDraft(selectedJob, candidate);
    setSelectedCandidateId(candidate.id);
    setOutput(draft);
    setStatus("Draft");
    log("Generated candidate review draft", "Draft", draft.inputSummary);
  }

  function addTopCandidate() {
    const topCandidate = rankedCandidates[0];
    setReviewList((current) =>
      current.some((candidate) => candidate.id === topCandidate.id) ? current : [...current, topCandidate]
    );
    generateDraft(topCandidate);
    log("Added top-ranked candidate to recruiter review list", "Draft", `${topCandidate.name} for ${selectedJob.title}`);
  }

  function addSelectedCandidate() {
    setReviewList((current) =>
      current.some((candidate) => candidate.id === selectedCandidate.id) ? current : [...current, selectedCandidate]
    );
    log("Added selected candidate to recruiter review list");
  }

  return (
    <article className={`ai-wide-shell ai-prototype-workspace ${config.accentClass}`}>
      <WorkspaceHeader moduleId="recruitment" status={status} />
      <div className="ai-workbench-grid">
        <section className="ai-input-console" aria-labelledby="recruitment-db-title">
          <div className="ai-panel-title">
            <span>01</span>
            <h2 id="recruitment-db-title">Recruiting database</h2>
          </div>

          <h3 className="ai-subheading">Open requisitions</h3>
          <div className="ai-database-list">
            {recruitmentJobs.map((job) => (
              <button
                className={job.id === selectedJob.id ? "ai-record-button is-active" : "ai-record-button"}
                key={job.id}
                type="button"
                onClick={() => setSelectedJobId(job.id)}
              >
                <strong>{job.title}</strong>
                <span>{job.id} · {job.department}</span>
                <small>{job.stage}</small>
              </button>
            ))}
          </div>

          <h3 className="ai-subheading">Candidate pool</h3>
          <div className="ai-candidate-table">
            {rankedCandidates.map((candidate) => (
              <button
                className={candidate.id === selectedCandidate.id ? "ai-candidate-row is-active" : "ai-candidate-row"}
                key={candidate.id}
                type="button"
                onClick={() => setSelectedCandidateId(candidate.id)}
              >
                <span>
                  <strong>{candidate.name}</strong>
                  <small>{candidate.role}</small>
                </span>
                <b>{candidateScore(selectedJob, candidate)}/10</b>
              </button>
            ))}
          </div>

          <div className="ai-record-detail">
            <h3>{selectedCandidate.name}</h3>
            <p>{selectedCandidate.experience}</p>
            <div className="ai-token-row">
              {selectedCandidate.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <div className="ai-simulation-actions">
              <button className="ai-primary-button" type="button" onClick={() => generateDraft()}>
                Analyze candidate
              </button>
              <button className="ai-secondary-button" type="button" onClick={addSelectedCandidate}>
                Add selected to review
              </button>
              <button className="ai-secondary-button" type="button" onClick={addTopCandidate}>
                Add top 10% candidate
              </button>
            </div>
          </div>
        </section>

        <OutputConsole output={output} status={status} />

        <ReviewConsole
          status={status}
          activityLog={activityLog}
          onStatus={(nextStatus) => {
            setStatus(nextStatus);
            log(`Marked as ${nextStatus}`, nextStatus);
          }}
          onSave={() => log("Saved recruiter review checkpoint")}
        >
          <div className="ai-side-panel">
            <h3>Recruiter review list</h3>
            {reviewList.length ? (
              <ul>
                {reviewList.map((candidate) => (
                  <li key={candidate.id}>
                    {candidate.name} · {candidateScore(selectedJob, candidate)}/10 for {selectedJob.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No candidates added yet.</p>
            )}
            <p>
              Review list only. This assistant does not auto-hire, auto-reject, or evaluate protected
              characteristics.
            </p>
          </div>
        </ReviewConsole>
      </div>
    </article>
  );
}

function HrAssistantWorkspace() {
  const config = aiResearchModules.hr;
  const [selectedTicketId, setSelectedTicketId] = useState(hrTickets[0].id);
  const [output, setOutput] = useState<DraftOutput | null>(null);
  const [status, setStatus] = useState<ReviewStatus>("Draft");
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [ticketStatus, setTicketStatus] = useState<Record<string, string>>({});

  const selectedTicket = hrTickets.find((ticket) => ticket.id === selectedTicketId) ?? hrTickets[0];
  const linkedPolicies = hrPolicies.filter((policy) => selectedTicket.linkedPolicyIds.includes(policy.id));

  function log(action: string, nextStatus = status, summary = `${selectedTicket.id} ${selectedTicket.category}`) {
    setActivityLog((current) => addEntry(current, action, config.moduleType, summary, nextStatus));
  }

  function generateDraft() {
    const draft = makeHrDraft(selectedTicket);
    setOutput(draft);
    setStatus("Draft");
    setTicketStatus((current) => ({ ...current, [selectedTicket.id]: "Drafted" }));
    log("Generated HR case draft", "Draft", draft.inputSummary);
  }

  function routeTicket(nextRoute: string) {
    setTicketStatus((current) => ({ ...current, [selectedTicket.id]: nextRoute }));
    log(`Routed ticket: ${nextRoute}`, status, selectedTicket.id);
  }

  return (
    <article className={`ai-wide-shell ai-prototype-workspace ${config.accentClass}`}>
      <WorkspaceHeader moduleId="hr" status={status} />
      <div className="ai-workbench-grid">
        <section className="ai-input-console" aria-labelledby="hr-db-title">
          <div className="ai-panel-title">
            <span>01</span>
            <h2 id="hr-db-title">HR service queue</h2>
          </div>
          <div className="ai-database-list">
            {hrTickets.map((ticket) => (
              <button
                className={ticket.id === selectedTicket.id ? "ai-record-button is-active" : "ai-record-button"}
                key={ticket.id}
                type="button"
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <strong>{ticket.id} · {ticket.category}</strong>
                <span>{ticket.requester}</span>
                <small>{ticketStatus[ticket.id] ?? ticket.priority}</small>
              </button>
            ))}
          </div>

          <div className="ai-record-detail">
            <h3>{selectedTicket.question}</h3>
            <p>{selectedTicket.formRequest}</p>
            <dl className="ai-record-meta">
              <div>
                <dt>Requester</dt>
                <dd>{selectedTicket.requester}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{selectedTicket.priority}</dd>
              </div>
              <div>
                <dt>Route</dt>
                <dd>{ticketStatus[selectedTicket.id] ?? "New"}</dd>
              </div>
            </dl>

            <h3 className="ai-subheading">Matched policy records</h3>
            <div className="ai-knowledge-list">
              {linkedPolicies.map((policy) => (
                <article key={policy.id}>
                  <strong>{policy.title}</strong>
                  <span>{policy.category}</span>
                  <p>{policy.text}</p>
                </article>
              ))}
            </div>

            <div className="ai-simulation-actions">
              <button className="ai-primary-button" type="button" onClick={generateDraft}>
                Draft HR response
              </button>
              <button className="ai-secondary-button" type="button" onClick={() => routeTicket("Needs HR confirmation")}>
                Send to HR confirmation
              </button>
              <button className="ai-secondary-button" type="button" onClick={() => routeTicket("Ready for reviewed reply")}>
                Mark ready for reply
              </button>
            </div>
          </div>
        </section>

        <OutputConsole output={output} status={status} />

        <ReviewConsole
          status={status}
          activityLog={activityLog}
          onStatus={(nextStatus) => {
            setStatus(nextStatus);
            log(`Marked as ${nextStatus}`, nextStatus);
          }}
          onSave={() => log("Saved HR review checkpoint")}
        >
          <div className="ai-side-panel">
            <h3>Case facts</h3>
            <ul>
              <li>{selectedTicket.sampleTimesheet}</li>
              <li>Compensation factors: {selectedTicket.compensationFactors.join(", ")}</li>
              <li>Current route: {ticketStatus[selectedTicket.id] ?? "New"}</li>
            </ul>
            <p>Sample data only. Payroll, compensation, and policy decisions remain human-owned.</p>
          </div>
        </ReviewConsole>
      </div>
    </article>
  );
}
