import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createGameTicket } from "@/lib/game-tickets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const productionGameUrl = "https://game.miguisanson.dev/";
const productionSiteUrl = "https://miguisanson.dev/";

function getSiteUrl() {
  const configuredUrl = process.env.BETTER_AUTH_URL?.trim() || productionSiteUrl;
  const url = new URL(configuredUrl);
  const isLocalHost = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname);

  if (process.env.NODE_ENV === "production" && isLocalHost) {
    console.error(`[game launch] Ignoring local BETTER_AUTH_URL in production: ${configuredUrl}`);
    return new URL(productionSiteUrl);
  }

  return url;
}

function accountRedirect(account: string, message?: string) {
  const url = getSiteUrl();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("account", account);
  url.searchParams.set("next", "/api/game/launch");
  if (message) {
    url.searchParams.set("message", message);
  }
  return NextResponse.redirect(url);
}

function getGameUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_HERE_TO_SLAY_URL?.trim() || productionGameUrl;
  const url = new URL(configuredUrl);
  const isLocalHost = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname);

  if (process.env.NODE_ENV === "production" && isLocalHost) {
    console.error(
      `[game launch] Ignoring local NEXT_PUBLIC_HERE_TO_SLAY_URL in production: ${configuredUrl}`,
    );
    return new URL(productionGameUrl);
  }

  return url;
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return accountRedirect("login", "Log in or create an account to join the tabletop.");
  }

  if (!session.user.emailVerified) {
    return accountRedirect("verify", "Verify your email address before joining the tabletop.");
  }

  const user = session.user as typeof session.user & {
    displayUsername?: string | null;
    username?: string | null;
  };
  const username = user.displayUsername ?? user.username ?? user.name;
  const ticket = await createGameTicket({ id: user.id, username });
  const gameUrl = getGameUrl();
  gameUrl.hash = `ticket=${encodeURIComponent(ticket)}`;

  return NextResponse.redirect(gameUrl);
}
