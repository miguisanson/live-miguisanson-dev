import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  displayUsername?: string | null;
};

export default async function AccountProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account/profile&message=Log%20in%20to%20edit%20your%20profile.");
  }

  const user = session.user as SessionUser;
  const profile = await getUserProfile(user.id);
  const displayName = user.displayUsername ?? user.name ?? user.username ?? user.email;
  const profileHref = user.username ? `/u/${encodeURIComponent(user.username)}` : "/account";

  return (
    <div className="account-dashboard">
      <section className="account-card">
        <div className="account-card-heading">
          <h2>Edit Profile</h2>
          <Link href={profileHref}>View public</Link>
        </div>
        <ProfileForm displayName={displayName} bio={profile?.bio ?? ""} />
      </section>
    </div>
  );
}
