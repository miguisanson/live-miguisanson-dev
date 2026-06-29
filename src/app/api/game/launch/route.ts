import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGameLaunchAccess, recordAuditEvent } from "@/lib/admin-data";
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

function accountPageRedirect(message?: string) {
  const url = getSiteUrl();
  url.pathname = "/account";
  url.search = "";
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
    await recordAuditEvent({
      eventType: "game.launch",
      metadata: { success: false, reason: "not_authenticated" },
      request,
    });
    return accountRedirect("login", "Log in or create an account to join the tabletop.");
  }

  if (!session.user.emailVerified) {
    await recordAuditEvent({
      eventType: "game.launch",
      actor: session.user,
      targetUserId: session.user.id,
      targetEmail: session.user.email,
      metadata: { success: false, reason: "email_not_verified" },
      request,
    });
    return accountRedirect("verify", "Verify your email address before joining the tabletop.");
  }

  const user = session.user as typeof session.user & {
    displayUsername?: string | null;
    username?: string | null;
  };
  const access = await getGameLaunchAccess(user);
  if (!access.allowed) {
    await recordAuditEvent({
      eventType: "game.launch",
      actor: user,
      targetUserId: user.id,
      targetEmail: user.email,
      metadata: { success: false, reason: access.reason },
      request,
    });
    return accountPageRedirect(access.message ?? "This account cannot launch the game right now.");
  }

  const username = user.displayUsername ?? user.username ?? user.name;
  const ticket = await createGameTicket({ id: user.id, username });
  const gameUrl = getGameUrl();
  gameUrl.hash = `ticket=${encodeURIComponent(ticket)}`;
  await recordAuditEvent({
    eventType: "game.launch",
    actor: user,
    targetUserId: user.id,
    targetEmail: user.email,
    metadata: { success: true, destination: gameUrl.origin, game: "Here to Slay" },
    request,
  });

  return NextResponse.redirect(gameUrl);
}
