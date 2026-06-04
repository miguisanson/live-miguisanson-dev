"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { recordAuditEvent } from "@/lib/admin-data";
import { updateUserDisplayName, upsertUserProfile } from "@/lib/profile-data";
import { normalizeDisplayName, validateBio, validateDisplayName } from "@/lib/account-policy";

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

async function requireUser(): Promise<SessionUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account/profile&message=Log%20in%20to%20edit%20your%20profile.");
  }
  return session.user as SessionUser;
}

export async function updateProfileAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await requireUser();

  const displayName = normalizeDisplayName(String(formData.get("displayName") ?? ""));
  const bio = String(formData.get("bio") ?? "").trim();

  const displayNameError = validateDisplayName(displayName);
  if (displayNameError) {
    return { ok: false, message: displayNameError };
  }
  const bioError = validateBio(bio);
  if (bioError) {
    return { ok: false, message: bioError };
  }

  await updateUserDisplayName(user.id, displayName);
  await upsertUserProfile(user.id, { bio });
  await recordAuditEvent({
    eventType: "account.update",
    actor: user,
    targetUserId: user.id,
    targetEmail: user.email,
    metadata: { fields: "displayName,bio" },
  });

  revalidatePath("/account");
  revalidatePath("/account/profile");
  return { ok: true, message: "Profile saved." };
}
