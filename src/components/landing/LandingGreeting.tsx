"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { LinkCard } from "@/components/ui/Card";
import { BlogIcon, CommunityIcon, GamesIcon, ResumeIcon, UserIcon } from "@/components/layout/NavIcons";

function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

export function LandingGreeting() {
  const { data: session } = authClient.useSession();
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const update = () => setGreeting(getGreeting());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const user = session?.user as
    | { displayUsername?: string | null; username?: string | null; name?: string | null }
    | undefined;
  const name = user?.displayUsername ?? user?.username ?? user?.name ?? "there";

  const cards = [
    { href: "/resume", title: "Resume", desc: "Background, experience, and projects.", icon: <ResumeIcon size={22} /> },
    { href: "/games", title: "Games", desc: "Browser games and tabletop experiments.", icon: <GamesIcon size={22} /> },
    { href: "/community", title: "Community", desc: "Browse members and recent posts.", icon: <CommunityIcon size={22} /> },
    { href: "/blog", title: "Blog", desc: "Notes, build logs, and learning posts.", icon: <BlogIcon size={22} /> },
  ];
  if (session) {
    cards.push({
      href: user?.username ? `/u/${encodeURIComponent(user.username)}` : "/account",
      title: "Your profile",
      desc: "View and customize your profile.",
      icon: <UserIcon size={22} />,
    });
  }

  return (
    <section className="home" aria-labelledby="home-title">
      <div className="home-intro">
        <p className="home-kicker">{greeting}</p>
        <h1 id="home-title">Hi {name}</h1>
        <p className="home-lede">A small personal platform — portfolio, games, and a growing community.</p>
      </div>

      <nav className="home-grid" aria-label="Site sections">
        {cards.map((card) => (
          <LinkCard key={card.href} href={card.href} className="home-card">
            <span className="home-card-icon" aria-hidden="true">
              {card.icon}
            </span>
            <span className="home-card-title">{card.title}</span>
            <span className="home-card-desc">{card.desc}</span>
          </LinkCard>
        ))}
      </nav>
    </section>
  );
}
