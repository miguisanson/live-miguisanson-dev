import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGameLaunchAccess, recordAuditEvent } from "@/lib/admin-data";
import { createGameRoom, findActiveGameRoom, isRoomCode, normalizeRoomCode } from "@/lib/game-rooms";
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

function accountRedirect(account: string, message?: string, next = "/api/game/launch") {
  const url = getSiteUrl();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("account", account);
  url.searchParams.set("next", next);
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

function gamePageRedirect(message: string, room?: string) {
  const url = getSiteUrl();
  url.pathname = "/games/here-to-slay-online-tabletop";
  url.search = "";
  url.searchParams.set("roomError", message);
  if (room) {
    url.searchParams.set("room", room);
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
  const launchPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    await recordAuditEvent({
      eventType: "game.launch",
      metadata: { success: false, reason: "not_authenticated" },
      request,
    });
    return accountRedirect("login", "Log in or create an account to join the tabletop.", launchPath);
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
    return accountRedirect("verify", "Verify your email address before joining the tabletop.", launchPath);
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
  const rawRoom = request.nextUrl.searchParams.get("room");
  const requestedRoom = normalizeRoomCode(rawRoom);
  if (rawRoom !== null && !isRoomCode(requestedRoom)) {
    return gamePageRedirect("Enter a valid 8-character room code.", requestedRoom);
  }

  const room = requestedRoom
    ? await findActiveGameRoom(requestedRoom)
    : await createGameRoom(user.id);
  if (!room) {
    await recordAuditEvent({
      eventType: "game.launch",
      actor: user,
      targetUserId: user.id,
      targetEmail: user.email,
      metadata: { success: false, reason: "room_not_found", room: requestedRoom, game: "Here to Slay" },
      request,
    });
    return gamePageRedirect("That room does not exist or has expired.", requestedRoom);
  }

  const ticket = await createGameTicket({ id: user.id, username }, room.code);
  const gameUrl = getGameUrl();
  const hash = new URLSearchParams({ ticket, room: room.code });
  gameUrl.hash = hash.toString();
  await recordAuditEvent({
    eventType: "game.launch",
    actor: user,
    targetUserId: user.id,
    targetEmail: user.email,
    metadata: {
      success: true,
      destination: gameUrl.origin,
      game: "Here to Slay",
      room: room.code,
      roomAction: requestedRoom ? "join" : "create",
    },
    request,
  });

  return NextResponse.redirect(gameUrl);
}
