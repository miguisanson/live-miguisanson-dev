"use client";

import { useState } from "react";

type Plan = {
  headline: string;
  days: string[];
  notes: string[];
};

export function WorkoutPlanner() {
  const [goal, setGoal] = useState("Build strength");
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState("Gym");
  const [schedule, setSchedule] = useState("3 days per week");
  const [plan, setPlan] = useState<Plan | null>(null);

  function generatePlan() {
    // Future hook: replace this local mock logic with a Next.js route handler
    // that calls an LLM provider, then optionally persist saved plans with Prisma.
    setPlan({
      headline: `${goal} plan for ${activity.toLowerCase()} training`,
      days: [
        `Day 1: Full-body strength focus with moderate volume for a ${weight}kg baseline.`,
        "Day 2: Mobility, zone 2 cardio, and core stability.",
        "Day 3: Compound lifts or bodyweight progressions plus conditioning.",
      ],
      notes: [
        `Schedule: ${schedule}`,
        "Mock output only. Validate real health advice with a qualified professional later.",
        "Real AI integration can add personalization, progression, and saved history.",
      ],
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm" action={generatePlan}>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold">Goal</span>
            <input value={goal} onChange={(event) => setGoal(event.target.value)} className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm font-bold">Weight</span>
            <input value={weight} onChange={(event) => setWeight(event.target.value)} className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm font-bold">Activity type</span>
            <select value={activity} onChange={(event) => setActivity(event.target.value)} className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2">
              <option>Gym</option>
              <option>Home workout</option>
              <option>Running</option>
              <option>Hybrid</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold">Schedule</span>
            <select value={schedule} onChange={(event) => setSchedule(event.target.value)} className="mt-2 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2">
              <option>3 days per week</option>
              <option>4 days per week</option>
              <option>5 days per week</option>
            </select>
          </label>
          <button type="submit" className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]">
            Generate mock plan
          </button>
        </div>
      </form>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="text-2xl font-extrabold">{plan?.headline ?? "Generated plan appears here"}</h2>
        {plan ? (
          <div className="mt-5 space-y-5">
            <ol className="space-y-3">
              {plan.days.map((day) => (
                <li key={day} className="rounded-lg bg-[var(--surface-muted)] p-4 text-sm font-medium">
                  {day}
                </li>
              ))}
            </ol>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              {plan.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-[var(--muted)]">This is local mock behavior only. No API request is made.</p>
        )}
      </section>
    </div>
  );
}
