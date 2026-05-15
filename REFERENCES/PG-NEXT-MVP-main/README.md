# Consumer IQ Prototype

Consumer IQ is a presentation-grade, front-end concept app for consumer intelligence, competitor analytics, operations monitoring, incident handling, and human handoff workflows.

## Prototype Scope
- Front-end only (React + Vite + TypeScript).
- No real backend/API/database required for core demo.
- No live Azure/Auth/ServiceNow/GitHub integration.
- All workflows are simulated with deterministic mock logic and local persistence.

## What Is Fully Interactive
- Login/logout and quick role sign-in.
- Role-aware route visibility and default landing pages.
- Opportunity Mode switch (persistent).
- Quick Insight modals with regenerate/history behavior.
- Command recommendation actions (approve/modify/dismiss).
- Competitor mapping support edits.
- Incident queue actions (acknowledge, assign owner, escalate).
- Incident detail actions (summarize, self-heal, escalate, ticket status updates).
- Alert CRUD behavior (add/edit/enable/disable/ack/delete).
- Runbook note editing with local persistence.
- Monitoring threshold editing with persistent state.
- Monitoring rule creation from Settings (appears in Alert Center).
- Bottleneck/anomaly drill-down and status updates.
- CI/CD pipeline panel with rerun simulation and release history badges.

## What Is Simulated
- GenAI/NLP Quick Insights use local template + context logic.
- Workflow AI self-healing uses rule/threshold-based scripted behavior.
- ServiceNow-style handoff is simulated using local ticket records (`INC-000x`).
- CI/CD/GitHub pipeline visibility is simulated from local run history.
- Notification channels and route-governance toggles in settings are local-only.

## Auth and Session Model
- Seeded users are in [`src/data/mock-users.ts`](/Users/miguelsanson/Desktop/GameMaker/PG-NEXT-MVP/src/data/mock-users.ts).
- Demo password is local-only.
- Session persists in localStorage (`consumer_iq_demo_session_v1`).
- Logout clears local session and returns to `/login`.

## Role Access Model
- Business-facing roles:
  - Market Operations
  - R&D
  - Product Supply
- Operations-facing roles:
  - Operations Manager
  - Data Engineer
  - AI Engineer
  - Project Manager
- Route access is enforced by guards and role permission mapping.

## Quick Insights (GenAI/NLP Simulation)
- Available across business and operations modules.
- Opens in a modal with:
  - summary
  - confidence
  - basis/context lines
  - regenerate
  - recent insight history per page
- Implemented via shared demo state in [`src/context/demo-data-context.tsx`](/Users/miguelsanson/Desktop/GameMaker/PG-NEXT-MVP/src/context/demo-data-context.tsx).

## Self-Healing Workflow AI
- Scripted, bounded recovery only (no uncontrolled autonomous actions).
- Threshold checks include retry limits, incident age, repeat count, stale duration, and fallback duration.
- On threshold breach:
  - automation stops
  - incident is marked requiring human intervention
  - manual handoff ticket is created/linked

## Manual Handoff Ticketing
- Ticket format: `INC-0001`, `INC-0002`, etc.
- Ticket references are shown in incident list/detail and handoff flows.
- Tracks:
  - created time
  - status
  - assigned owner
  - reason
  - response target
  - respond-by time
  - response timing metrics

## CI/CD Visibility
- Simulated pipeline run panel includes:
  - build/test/deploy status
  - failed step
  - environment badge (Dev/Staging/Demo)
  - release history
  - rerun action that creates a new local run entry

## Local Persistence
- Shared demo platform state persists in localStorage:
  - incidents/tickets/alerts
  - thresholds
  - runbook notes
  - recommendations
  - bottlenecks/anomalies
  - competitor mappings
  - pipeline runs
  - generated insights
- Key provider: [`src/context/demo-data-context.tsx`](/Users/miguelsanson/Desktop/GameMaker/PG-NEXT-MVP/src/context/demo-data-context.tsx)

## Routes
- `/login`
- `/overview`
- `/brand-overview`
- `/competitor-intelligence`
- `/intelligence-command-center`
- `/operations`
- `/incidents`
- `/incidents/:id`
- `/runbooks`
- `/alerts`
- `/settings/monitoring`
- `/opportunities`
- `/help`

## Run Locally
1. Install dependencies
   - `npm install`
2. Start dev server
   - `npm run dev`
3. Build production bundle
   - `npm run build`
4. Preview build
   - `npm run preview`

## Automated Tests
- Framework: Vitest + React Testing Library.
- Test command:
  - `npm run test`
  - `npm run test:run`
- Current coverage includes:
  - login/logout
  - role-based route visibility
  - opportunity mode switch
  - quick insight modal/regenerate
  - incident ticket creation
  - self-healing escalation to manual handoff
  - alert acknowledgment
  - pipeline rerun interaction
  - chart container render check
  - help icon interaction
  - monitoring settings interaction flow
