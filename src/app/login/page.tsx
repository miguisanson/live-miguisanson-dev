import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your verified miguisanson.dev account.",
};

export default function LoginPage() {
  return (
    <section className="page-header">
      <p className="eyebrow">Account Required</p>
      <h1>Log in to continue</h1>
      <p>
        The game launcher is available only to verified miguisanson.dev accounts. Use the account dialog to log in or
        create an account.
      </p>
      <Link className="button" href="/?account=login">
        Open account dialog
      </Link>
    </section>
  );
}
