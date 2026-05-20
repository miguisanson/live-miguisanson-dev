export type QaWorkItem = {
  id: string;
  project: string;
  featureName: string;
  priority: "High" | "Medium" | "Low";
  owner: string;
  status: "Ready for QA" | "Bug reported" | "Needs clarification";
  environment: string;
  userStory: string;
  bugReport: string;
  acceptanceCriteria: string[];
  existingCoverage: string[];
  seedCases: string[];
  failurePoints: string[];
};

export type RecruitmentJob = {
  id: string;
  title: string;
  department: string;
  stage: "Intake" | "Active" | "Final review";
  criteria: string[];
  skillCategories: string[];
  description: string;
};

export type CandidateProfile = {
  id: string;
  name: string;
  role: string;
  stage: "New" | "Screening" | "Interview" | "Recruiter Review";
  skills: string[];
  education: string;
  experience: string;
  employmentHistory: string;
  unclearRequirements: string[];
  communicationTone: string;
};

export type HrPolicy = {
  id: string;
  title: string;
  category: string;
  text: string;
  escalationRule: string;
};

export type HrTicket = {
  id: string;
  requester: string;
  category: string;
  priority: "Normal" | "High" | "Needs HR confirmation";
  question: string;
  formRequest: string;
  sampleTimesheet: string;
  compensationFactors: string[];
  linkedPolicyIds: string[];
};

export const qaWorkItems: QaWorkItem[] = [
  {
    id: "QA-117",
    project: "miguisanson.dev",
    featureName: "Project filter controls",
    priority: "High",
    owner: "Frontend",
    status: "Bug reported",
    environment: "Chrome desktop, iPhone viewport, dark mode",
    userStory:
      "A visitor can filter portfolio projects by status and open a project demo without losing their place on the page.",
    bugReport:
      "On small screens, the selected filter sometimes resets after opening a live demo link.",
    acceptanceCriteria: [
      "Selected filters remain visible after navigating back from a project page.",
      "External demo links open without resetting the project section state.",
      "Keyboard users can tab through all filters and cards in order.",
    ],
    existingCoverage: ["Landing page smoke test", "Project card render check"],
    seedCases: [
      "Filter Prototype projects and verify only prototype cards remain visible.",
      "Open Consumer IQ, return to projects, and verify the selected filter is still active.",
      "Run the same flow at 390px width with the mobile navigation visible.",
    ],
    failurePoints: [
      "Filter state stored only in component state and lost after route navigation.",
      "Link target behavior interrupts scroll restoration.",
      "Mobile layout wraps controls in a way that hides the active state.",
    ],
  },
  {
    id: "QA-121",
    project: "USLS Graduate Lifecycle",
    featureName: "Graduate monitoring alert queue",
    priority: "High",
    owner: "Capstone prototype",
    status: "Ready for QA",
    environment: "Edge desktop, tablet viewport",
    userStory:
      "A graduate school coordinator reviews at-risk students, opens alert details, records an intervention, and sees the alert status update.",
    bugReport:
      "No confirmed defect yet. The team wants release coverage for the mock alert workflow.",
    acceptanceCriteria: [
      "Alert queue loads seeded demo alerts.",
      "Coordinator can record a fictional intervention note.",
      "Alert status changes are reflected in the activity trail.",
    ],
    existingCoverage: ["Login render check", "Dashboard route check"],
    seedCases: [
      "Open the alert queue and sort by priority.",
      "Open a high-risk alert and add an intervention note.",
      "Verify the dashboard count updates after changing the alert status.",
    ],
    failurePoints: [
      "Mock API state does not persist between views.",
      "Direct routes fail when the SPA fallback is missing.",
      "Activity trail omits who changed the alert status.",
    ],
  },
  {
    id: "QA-128",
    project: "Consumer IQ",
    featureName: "Competitor sentiment insight panel",
    priority: "Medium",
    owner: "Analytics UI",
    status: "Needs clarification",
    environment: "Chrome desktop, reduced motion",
    userStory:
      "An operations user reviews competitor sentiment shifts, sees the confidence level, and opens supporting evidence before sharing an insight.",
    bugReport:
      "Stakeholders need clarification on whether low-confidence insights should be hidden or shown with a warning.",
    acceptanceCriteria: [
      "Low-confidence insight cards are clearly labeled.",
      "Supporting evidence opens without overlapping the dashboard controls.",
      "Exported summaries include a draft disclaimer.",
    ],
    existingCoverage: ["Dashboard chart render", "Mock data load"],
    seedCases: [
      "Filter sentiment by brand and verify chart totals update.",
      "Open an insight with low confidence and verify the warning copy.",
      "Export the draft summary and check that human review language is present.",
    ],
    failurePoints: [
      "Chart totals and insight cards use different filtered datasets.",
      "Export omits confidence values.",
      "Evidence drawer overlaps controls at tablet widths.",
    ],
  },
];

export const recruitmentJobs: RecruitmentJob[] = [
  {
    id: "REQ-204",
    title: "Junior QA Analyst",
    department: "Product Quality",
    stage: "Active",
    criteria: [
      "Testing fundamentals",
      "Clear bug reports",
      "Basic SQL",
      "Communication",
      "Attention to detail",
      "Automation readiness",
    ],
    skillCategories: ["Testing", "SQL", "Communication", "Automation readiness"],
    description:
      "Support manual and automated testing for web applications, document defects clearly, and collaborate with developers during release checks.",
  },
  {
    id: "REQ-218",
    title: "HR Operations Coordinator",
    department: "People Operations",
    stage: "Intake",
    criteria: [
      "HR ticket handling",
      "Policy interpretation",
      "Forms coordination",
      "Confidential documentation",
      "Stakeholder communication",
    ],
    skillCategories: ["HR operations", "Policy support", "Documentation", "Communication"],
    description:
      "Coordinate employee service requests, draft policy-based responses, and route sensitive HR cases to authorized reviewers.",
  },
  {
    id: "REQ-226",
    title: "Frontend Support Developer",
    department: "Digital Experience",
    stage: "Final review",
    criteria: ["React", "TypeScript", "Accessibility", "Debugging", "Release support"],
    skillCategories: ["React", "TypeScript", "Accessibility", "Debugging"],
    description:
      "Maintain production-facing React interfaces, fix defects, improve accessibility, and support release validation.",
  },
];

export const candidateProfiles: CandidateProfile[] = [
  {
    id: "CAN-014",
    name: "Sofia Reyes",
    role: "Junior QA applicant",
    stage: "New",
    skills: ["Testing", "SQL", "Bug reports", "Communication", "Capstone QA"],
    education: "BS Information Technology graduate; coursework included database systems and web development.",
    experience:
      "Built classroom web projects, wrote manual test notes for a capstone application, and used SQL in coursework.",
    employmentHistory: "Internship-style project work and academic software delivery experience.",
    unclearRequirements: ["Production QA depth", "Hands-on Playwright experience"],
    communicationTone: "Warm and early-career friendly",
  },
  {
    id: "CAN-027",
    name: "Andre Lim",
    role: "Frontend support applicant",
    stage: "Screening",
    skills: ["React", "TypeScript", "Accessibility", "Debugging", "Release support"],
    education: "Completed software engineering certificate and front-end accessibility workshops.",
    experience:
      "Maintained a small React dashboard, fixed UI defects, and documented regression checks before release.",
    employmentHistory: "Two short contract projects supporting internal dashboard maintenance.",
    unclearRequirements: ["Availability for support rotation"],
    communicationTone: "Direct and technical",
  },
  {
    id: "CAN-038",
    name: "Camille Navarro",
    role: "People operations applicant",
    stage: "Interview",
    skills: ["HR operations", "Policy support", "Documentation", "Communication", "Ticket triage"],
    education: "Business administration degree with HR management coursework.",
    experience:
      "Handled fictional training-case HR tickets, prepared form checklists, and routed policy questions for approval.",
    employmentHistory: "Administrative assistant experience with documented process handoffs.",
    unclearRequirements: ["Depth of HRIS experience", "Payroll exposure"],
    communicationTone: "Careful and service-oriented",
  },
  {
    id: "CAN-041",
    name: "Rafael Cruz",
    role: "QA automation applicant",
    stage: "Recruiter Review",
    skills: ["Testing", "Automation readiness", "Playwright", "Bug reports", "Debugging"],
    education: "Information systems degree with software testing electives.",
    experience:
      "Created Playwright smoke tests for a demo storefront and linked failures to defect notes.",
    employmentHistory: "Freelance QA support on two small web projects.",
    unclearRequirements: ["SQL depth", "Long-term team collaboration evidence"],
    communicationTone: "Technical but concise",
  },
];

export const hrPolicies: HrPolicy[] = [
  {
    id: "POL-LEAVE",
    title: "Planned leave notice",
    category: "Leave",
    text:
      "Employees should submit planned leave requests five business days before the requested date. Requests inside the notice period require HR confirmation and supervisor review.",
    escalationRule: "Escalate if the requested leave date is inside the notice period or conflicts with team coverage.",
  },
  {
    id: "POL-TIME",
    title: "Timesheet approval",
    category: "Timesheet",
    text:
      "Timesheets require supervisor approval before payroll review. Missing entries, unusual hours, and pending approval must be corrected before payroll processing.",
    escalationRule: "Escalate pending approval, missing entries, or unexplained overtime to HR operations.",
  },
  {
    id: "POL-COMP",
    title: "Compensation review factors",
    category: "Compensation",
    text:
      "Compensation review may consider role scope, required skills, responsibility level, market range, internal equity, performance evidence, and budget approval. AI draft tools must not finalize salary decisions.",
    escalationRule: "Escalate all salary, payroll, and compensation decisions to authorized HR leadership.",
  },
  {
    id: "POL-FORMS",
    title: "HR forms routing",
    category: "Forms",
    text:
      "Form requests should include the form name, requester, reason, required approver, target date, and supporting documents when needed.",
    escalationRule: "Escalate missing required details or sensitive document requests.",
  },
];

export const hrTickets: HrTicket[] = [
  {
    id: "HR-330",
    requester: "Maya Santos",
    category: "Leave",
    priority: "Needs HR confirmation",
    question: "Can I submit a leave request for next Friday if I file the form today?",
    formRequest: "Leave request guidance",
    sampleTimesheet:
      "Monday 8h approved, Tuesday 8h pending approval, Wednesday 10h no note, Thursday 8h approved, Friday missing entry.",
    compensationFactors: ["Role scope", "Required skills", "Internal equity", "Budget approval"],
    linkedPolicyIds: ["POL-LEAVE", "POL-TIME"],
  },
  {
    id: "HR-347",
    requester: "Joel Tan",
    category: "Timesheet",
    priority: "High",
    question: "My supervisor approved most of my hours, but one overtime entry is still pending. What happens next?",
    formRequest: "Timesheet correction request",
    sampleTimesheet:
      "Monday 8h approved, Tuesday 8h approved, Wednesday 12h pending approval with note, Thursday 8h approved, Friday 8h approved.",
    compensationFactors: ["Overtime note", "Supervisor approval", "Payroll review readiness"],
    linkedPolicyIds: ["POL-TIME"],
  },
  {
    id: "HR-352",
    requester: "Elena Villanueva",
    category: "Compensation",
    priority: "Needs HR confirmation",
    question: "Can HR confirm whether my sample offer range can be adjusted based on additional certification evidence?",
    formRequest: "Compensation review checklist",
    sampleTimesheet: "No timesheet attached because this is a candidate compensation review demo.",
    compensationFactors: ["Role scope", "Required skills", "Market range", "Certification evidence", "Budget approval"],
    linkedPolicyIds: ["POL-COMP", "POL-FORMS"],
  },
];
