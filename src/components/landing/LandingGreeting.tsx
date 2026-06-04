"use client";

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
        <p className="landing-kicker">
          {greeting}, {name}
        </p>
        <h1 id="landing-title">miguisanson.dev</h1>
        <p className="landing-summary">A compact home for resume work, games, community notes, and account profiles.</p>
      </div>
    </section>
  );
}
