import { WorkoutPlanner } from "@/components/lab/WorkoutPlanner";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = {
  title: "Mock AI Workout Planner",
};

export default function AIWorkoutPlannerPage() {
  return (
    <PageShell
      eyebrow="Lab Demo"
      title="Mock AI Workout Planner"
      description="A local-only planning UI that simulates generated training advice without using an AI API."
    >
      <WorkoutPlanner />
    </PageShell>
  );
}
