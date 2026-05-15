# AGENTS.md - Consumer IQ Engineering Guardrails

## Project Type
- This repository is a **presentation prototype**, not a production platform.
- Keep implementation front-end-only and demo-safe.

## Non-Negotiable Constraints
- No real Azure integration.
- No real auth provider (OAuth/SSO/etc.).
- No live credentials, secrets, or keys.
- No live SMS/email infrastructure.
- No backend API or database dependency required for core demo usage.

## Product and UX Direction
- Maintain enterprise internal-tool quality and visual polish.
- Preserve operations-first architecture and reliability narrative.
- Keep business module trust linkage visible (not uptime-only thinking).
- Keep the app intuitive for both technical and business roles.

## Interaction Quality
- Anything that appears interactive must perform a visible action.
- Avoid dead buttons, dead cards, or fake controls.
- If a feature is intentionally unavailable, hide it or disable with clear explanation.

## Responsiveness and Stability
- Preserve mobile-ready behavior:
  - sidebar drawer on small screens
  - mobile-safe tab fallback patterns
  - usable filters/actions
- Prevent chart/layout overlap and clipping.
- Ensure threshold/KPI text remains readable and does not break awkwardly.

## Role-Aware Behavior
- Preserve role-based route visibility.
- Preserve role-aware default landing behavior.
- Preserve local session restore/logout flow.

## Help System
- Preserve contextual help `?` coverage on major controls and sections.
- Keep global `/help` route available.
- Ensure help interactions work for hover (desktop) and tap/click (mobile).

## Data Integrity
- Keep mock data internally consistent across screens.
- If freshness/quality/fallback changes in one area, related module impact states should reflect it.

## UI Copy Rules
- Do not expose internal reference-document language in UI.
- Use clear end-user enterprise wording.
- Keep explanatory text concise and structured.

## Interactivity Guardrail
- If UI implies interaction (button, menu, tab, switch, icon action, row action), it must produce a visible state change, dialog, or feedback.
- Do not ship placeholder controls.
- Prefer local state + localStorage persistence for prototype workflows.

## Quick Insight Guardrail
- Preserve quick insight controls across business and operations modules.
- Keep summary output deterministic and presentation-safe (no live model dependency required).
- Provide regenerate and recent insight behavior where available.

## Self-Healing and Ticketing Guardrail
- Preserve threshold-based Workflow AI behavior.
- Keep self-healing bounded to scripted safe actions.
- On threshold breach, enforce manual handoff state and ticket flow.
- Keep clean ticket references (`INC-000x`) visible in list/detail/escalation contexts.

## Monitoring and CRUD Guardrail
- Monitoring threshold edits must update shared demo state.
- Monitoring rule creation/edit flows must be reflected in Alerts state.
- Incident/alert/recommendation/mapping/runbook edits must persist locally.

## Mobile and Layout Guardrail
- Preserve mobile drawer behavior and tap-friendly interactions.
- Keep tables usable on small screens (horizontal scroll or alternative layout).
- Prevent chart overlap, legend collisions, text clipping, and badge/pill wrapping regressions.

## Help Coverage Guardrail
- Keep contextual help `?` support on major controls and modules.
- Ensure help content remains usable via hover and click/tap patterns.

## Presentation Readiness Guardrail
- Maintain the three-tone visual language:
  - `#FFFFFF`
  - `#009EDF`
  - `#FFDB01`
- Keep business modules understandable first; place technical diagnostics as secondary detail.
