import { createHmac } from "node:crypto";
import { SignJWT } from "jose";

const developmentSecret = "local-development-game-ticket-secret-change-before-deployment";

function getSecret() {
  const secret = process.env.GAME_TICKET_SECRET ?? (process.env.NODE_ENV === "production" ? "" : developmentSecret);
  if (secret.length < 32) {
    throw new Error("GAME_TICKET_SECRET must contain at least 32 characters.");
  }
  return secret;
}

function getGamePlayerId(accountId: string) {
  return createHmac("sha256", getSecret()).update(accountId).digest().readUIntBE(0, 6);
}

export async function createGameTicket(user: { id: string; username: string }) {
  const secret = new TextEncoder().encode(getSecret());
  const playerId = getGamePlayerId(user.id);

  return new SignJWT({ pid: playerId, username: user.username })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer("miguisanson.dev")
    .setAudience("here-to-slay")
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);
}
