import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DDProjectPlayer } from "@/components/game/DDProjectPlayer";
import { PageShell } from "@/components/layout/PageShell";
import { getGameLaunchAccess, recordAuditEvent } from "@/lib/admin-data";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Play DD Project",
  description: "Play a private, account-isolated DD Project browser session.",
};

export default async function DDProjectPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) {
    redirect("/login?account=login&next=/play/dd-project&message=Log+in+to+play+DD+Project.");
  }
  if (!session.user.emailVerified) {
    redirect("/login?account=verify&next=/play/dd-project&message=Verify+your+email+before+playing.");
  }

  const access = await getGameLaunchAccess(session.user);
  if (!access.allowed) {
    redirect(`/account?message=${encodeURIComponent(access.message ?? "This account cannot launch the game.")}`);
  }

  await recordAuditEvent({
    eventType: "game.launch",
    actor: session.user,
    targetUserId: session.user.id,
    targetEmail: session.user.email,
    metadata: { success: true, game: "DD Project", instance: "account" },
  });

  return (
    <PageShell
      eyebrow="Single-player"
      title="DD Project"
      description="A private browser instance linked to your signed-in account."
    >
      <DDProjectPlayer />
    </PageShell>
  );
}
