import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login?account=login&next=/account&message=Log%20in%20to%20manage%20your%20account.");
  }

  return (
    <section className="account-shell" aria-labelledby="account-title">
      <header className="account-shell-header">
        <div className="post-meta">Private Account</div>
        <h1 id="account-title">Account</h1>
        <div className="post-description">Profile, security, and tabletop activity.</div>
      </header>

      <nav className="account-tabs" aria-label="Account sections">
        <Link className="account-tab" href="/account">
          Overview
        </Link>
        <Link className="account-tab" href="/account/profile">
          Profile
        </Link>
        <Link className="account-tab" href="/account/security">
          Security
        </Link>
        <Link className="account-tab" href="/account/activity">
          Activity
        </Link>
      </nav>

      {children}
    </section>
  );
}
