"use client";

import { useState } from "react";

const defaultFeature = "Users can filter project cards by status and open a live demo link in a new tab.";

export function QAHelper() {
  const [feature, setFeature] = useState(defaultFeature);
  const [cases, setCases] = useState<string[]>([]);

  function generateCases() {
    // Future hook: call an AI route here, then store accepted test cases
    // in PostgreSQL/Supabase/Neon through Prisma only when user history is needed.
    const subject = feature.trim() || defaultFeature;
    setCases([
      `Happy path: verify that ${subject}`,
      "Empty state: verify the interface remains clear when there are no matching records.",
      "Responsive behavior: verify controls remain usable on mobile width.",
      "Accessibility: verify keyboard focus order and visible focus styles.",
      "Regression: verify existing navigation and links still work after the feature is added.",
    ]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
        <label className="block">
          <span className="text-sm font-bold">Feature description</span>
          <textarea value={feature} onChange={(event) => setFeature(event.target.value)} rows={8} className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2" />
        </label>
        <button onClick={generateCases} className="mt-4 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]">
          Generate mock test cases
        </button>
      </section>
      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="text-2xl font-extrabold">Mock QA output</h2>
        {cases.length ? (
          <ol className="mt-5 space-y-3">
            {cases.map((testCase) => (
              <li key={testCase} className="rounded-lg bg-[var(--surface-muted)] p-4 text-sm font-medium">
                {testCase}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-[var(--muted)]">Generated test cases will appear here using deterministic mock rules.</p>
        )}
      </section>
    </div>
  );
}
