"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { recordAuditEvent } from "@/lib/admin-data";
import { upsertUserProfile, updateUserDisplayName } from "@/lib/profile-data";
import { games } from "@/data/games";
import {
  accountPolicy,
  normalizeDisplayName,
  profileBackgroundPatterns,
  validateBio,
  validateDisplayName,
  validateQuote,
  validateStatus,
  validateThemeColor,
} from "@/lib/account-policy";

export type ProfileFormState = {
  ok: boolean;
  message: string;
};

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  displayUsername?: string | null;
};

const validGameSlugs = new Set<string>(games.map((game) => game.slug));

async function requireUser(): Promise<SessionUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account/profile&message=Log%20in%20to%20edit%20your%20profile.");
  }
  return session.user as SessionUser;
}

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateProfileAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await requireUser();

  const displayName = normalizeDisplayName(field(formData, "displayName"));
  const bio = String(formData.get("bio") ?? "").trim();
  const status = field(formData, "status");
  const quote = field(formData, "quote");
  const themeColor = field(formData, "themeColor");
  const bgPatternRaw = field(formData, "bgPattern");
  const bgPattern = (profileBackgroundPatterns as readonly string[]).includes(bgPatternRaw) ? bgPatternRaw : "none";

  const favoriteGames = formData
    .getAll("favoriteGames")
    .map((value) => String(value))
    .filter((slug) => validGameSlugs.has(slug))
    .slice(0, accountPolicy.favoriteGamesMax);

  const isPublic = formData.get("isPublic") === "on";
  const hideActivity = formData.get("hideActivity") === "on";

  const error =
    validateDisplayName(displayName) ||
    validateBio(bio) ||
    validateStatus(status) ||
    validateQuote(quote) ||
    validateThemeColor(themeColor) ||
    "";
  if (error) {
    return { ok: false, message: error };
  }

  await updateUserDisplayName(user.id, displayName);
  await upsertUserProfile(user.id, {
    bio,
    status,
    quote,
    themeColor,
    bgPattern,
    favoriteGames,
    isPublic,
    hideActivity,
  });
  await recordAuditEvent({
    eventType: "account.update",
    actor: user,
    targetUserId: user.id,
    targetEmail: user.email,
    metadata: { fields: "profile" },
  });

  revalidatePath("/account");
  revalidatePath("/account/profile");
  if (user.username) {
    revalidatePath(`/u/${user.username}`);
  }
  return { ok: true, message: "Profile saved." };
}
