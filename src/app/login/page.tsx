import type { Metadata } from "next";
import Link from "next/link";
import { OpenAccountButton } from "@/components/auth/OpenAccountButton";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your verified miguisanson.dev account.",
};

type LoginPageProps = {
  searchParams?: Promise<{ account?: string | string[]; next?: string | string[]; message?: string | string[] }>;
};

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function accountMode(value: string) {
  return value === "signup" || value === "verify" || value === "forgot" || value === "reset" ? value : "login";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const mode = accountMode(first(params?.account));
  const next = first(params?.next);
  const message = first(params?.message);

  return (
    <section className="page-header">
      <p className="eyebrow">Account Required</p>
      <h1>Log in to continue</h1>
      <p>
        The game launcher is available only to verified miguisanson.dev accounts. Use the account dialog to log in or
        create an account.
      </p>
      <div className="account-inline-actions">
        <OpenAccountButton mode={mode} next={next} message={message} />
        <Link className="account-small-button" href="/">
          Back home
        </Link>
      </div>
    </section>
  );
}
