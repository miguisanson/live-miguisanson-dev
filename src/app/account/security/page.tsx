import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { DeleteAccountButton } from "@/components/account/DeleteAccountButton";
import { ResendVerificationButton } from "@/components/account/ResendVerificationButton";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SessionUser = {
  email: string;
  emailVerified: boolean;
};

export default async function AccountSecurityPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account/security&message=Log%20in%20to%20manage%20security.");
  }

  const user = session.user as SessionUser;

  return (
    <div className="account-dashboard">
      <section className="account-card">
        <div className="account-card-heading">
          <h2>Email Verification</h2>
          <span className={`account-status${user.emailVerified ? " is-good" : ""}`}>
            {user.emailVerified ? "Verified" : "Unverified"}
          </span>
        </div>
        <p className="account-muted-text">{user.email}</p>
        {!user.emailVerified ? <ResendVerificationButton email={user.email} /> : null}
      </section>

      <section className="account-card">
        <h2>Change Password</h2>
        <ChangePasswordForm />
      </section>

      <section className="account-card account-danger-zone">
        <h2>Delete Account</h2>
        <p className="account-muted-text">A confirmation link is sent to your account email before deletion.</p>
        <DeleteAccountButton />
      </section>
    </div>
  );
}
