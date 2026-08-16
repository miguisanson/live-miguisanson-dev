import { randomBytes } from "node:crypto";
import { dbGet, dbRun } from "./app-db";

export const hereToSlaySlug = "here-to-slay-online-tabletop";
export const roomCodeLength = 8;
const roomAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const roomLifetimeMs = 8 * 60 * 60 * 1000;

export type GameRoom = {
  code: string;
  gameSlug: string;
  ownerUserId: string;
  createdAt: string;
  expiresAt: string;
};

export function normalizeRoomCode(value: string | null | undefined) {
  return (value ?? "").trim().toUpperCase().replace(/[^A-Z2-9]/g, "");
}

export function isRoomCode(value: string) {
  return value.length === roomCodeLength && [...value].every((character) => roomAlphabet.includes(character));
}

function randomRoomCode() {
  const bytes = randomBytes(roomCodeLength);
  return [...bytes].map((value) => roomAlphabet[value % roomAlphabet.length]).join("");
}

export async function findActiveGameRoom(code: string, gameSlug = hereToSlaySlug) {
  return dbGet<GameRoom>(
    {
      sqlite: `
        SELECT "code", "gameSlug", "ownerUserId", "createdAt", "expiresAt"
        FROM "gameRoom"
        WHERE "code" = ? AND "gameSlug" = ? AND "expiresAt" > ?
      `,
      postgres: `
        SELECT "code", "gameSlug", "ownerUserId", "createdAt", "expiresAt"
        FROM "gameRoom"
        WHERE "code" = $1 AND "gameSlug" = $2 AND "expiresAt" > $3
      `,
    },
    [code, gameSlug, new Date().toISOString()],
  );
}

export async function createGameRoom(ownerUserId: string, gameSlug = hereToSlaySlug) {
  await dbRun({
    sqlite: `DELETE FROM "gameRoom" WHERE "expiresAt" <= ?`,
    postgres: `DELETE FROM "gameRoom" WHERE "expiresAt" <= $1`,
  }, [new Date().toISOString()]);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = randomRoomCode();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + roomLifetimeMs).toISOString();
    try {
      await dbRun(
        {
          sqlite: `
            INSERT INTO "gameRoom" ("code", "gameSlug", "ownerUserId", "createdAt", "expiresAt")
            VALUES (?, ?, ?, ?, ?)
          `,
          postgres: `
            INSERT INTO "gameRoom" ("code", "gameSlug", "ownerUserId", "createdAt", "expiresAt")
            VALUES ($1, $2, $3, $4, $5)
          `,
        },
        [code, gameSlug, ownerUserId, createdAt, expiresAt],
      );
      return { code, gameSlug, ownerUserId, createdAt, expiresAt } satisfies GameRoom;
    } catch (error) {
      if (attempt === 9) {
        throw error;
      }
    }
  }

  throw new Error("Unable to allocate a game room.");
}
