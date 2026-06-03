"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) {
    return "Good Morning";
  }
  if (hour < 18) {
    return "Good Afternoon";
  }
  return "Good Evening";
}

export function LandingGreeting() {
  const { data: session } = authClient.useSession();
  const [greeting, setGreeting] = useState("Good Day");

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting());
    updateGreeting();
    const timer = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const user = session?.user as
    | {
        displayUsername?: string | null;
        username?: string | null;
        name?: string | null;
      }
    | undefined;
  const name = user?.displayUsername ?? user?.username ?? user?.name ?? "Guest";

  return (
    <section className="landing-page" aria-labelledby="landing-title">
      <div className="landing-copy">
        <p className="landing-kicker">{greeting}</p>
        <h1 id="landing-title">Hi {name}!</h1>
      </div>

      <nav className="landing-actions" aria-label="Primary pages">
        <Link className="button landing-button" href="/resume">
          <span className="button-inner">My Resume</span>
        </Link>
      </nav>
    </section>
  );
}
