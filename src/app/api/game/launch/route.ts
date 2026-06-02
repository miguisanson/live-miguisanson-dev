import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createGameTicket } from "@/lib/game-tickets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function accountRedirect(request: NextRequest, account: string, message?: string) {
  const url = new URL("/", request.url);
  url.searchParams.set("account", account);
  url.searchParams.set("next", "/api/game/launch");
  if (message) {
    url.searchParams.set("message", message);
  }
  url.hash = "projects";
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return accountRedirect(request, "login", "Log in or create an account to join the tabletop.");
  }

  if (!session.user.emailVerified) {
    return accountRedirect(request, "verify", "Verify your email address before joining the tabletop.");
  }

  const user = session.user as typeof session.user & {
    displayUsername?: string | null;
    username?: string | null;
  };
  const username = user.displayUsername ?? user.username ?? user.name;
  const ticket = await createGameTicket({ id: user.id, username });
  const gameUrl = new URL(process.env.NEXT_PUBLIC_HERE_TO_SLAY_URL ?? "http://localhost:5000/");
  gameUrl.hash = `ticket=${encodeURIComponent(ticket)}`;

  return NextResponse.redirect(gameUrl);
}
