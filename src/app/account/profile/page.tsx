import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile-data";
import { games } from "@/data/games";

export const dynamic = "force-dynamic";

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  displayUsername?: string | null;
  createdAt?: Date | string;
};

function memberSinceLabel(value?: Date | string | null) {
  if (!value) {
    return "—";
  }
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function AccountProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account/profile&message=Log%20in%20to%20edit%20your%20profile.");
  }

  const user = session.user as SessionUser;
  const profile = await getUserProfile(user.id);
  const displayName = user.displayUsername ?? user.name ?? user.username ?? user.email;

  return (
    <div className="account-dashboard">
      <ProfileForm
        username={user.username ?? ""}
        memberSince={memberSinceLabel(user.createdAt)}
        displayName={displayName}
        profile={profile}
        gameOptions={games.map((game) => ({ slug: game.slug, title: game.title }))}
      />
    </div>
  );
}
