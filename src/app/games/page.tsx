import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Games",
  description: "Playable browser games and tabletop experiments for miguisanson.dev accounts.",
};

export default function GamesPage() {
  return (
    <PageShell eyebrow="Games" title="Work in progress." description="This section is being cleaned up.">
      <p className="section-placeholder">Games will be added back here when the layout is ready.</p>
    </PageShell>
  );
}
