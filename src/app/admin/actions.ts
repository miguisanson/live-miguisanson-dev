"use server";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  clearUserSessions,
  isAdminUser,
  setUserApproved,
  setUserBanned,
  setUserVerified,
  updateGameSettings,
} from "@/lib/admin-data";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/admin&message=Log%20in%20with%20an%20admin%20account.");
  }
  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }
  return session.user;
}

function requiredUserId(formData: FormData) {
  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) {
    throw new Error("Missing user id.");
  }
  return userId;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function saveGameSettingsAction(formData: FormData) {
  const actor = await requireAdmin();
  await updateGameSettings(
    {
      gameOpen: checked(formData, "gameOpen"),
      approvedOnly: checked(formData, "approvedOnly"),
      maintenanceMode: checked(formData, "maintenanceMode"),
    },
    actor,
  );
  revalidatePath("/admin");
}

export async function verifyUserAction(formData: FormData) {
  const actor = await requireAdmin();
  await setUserVerified(requiredUserId(formData), true, actor);
  revalidatePath("/admin");
}

export async function approveUserAction(formData: FormData) {
  const actor = await requireAdmin();
  await setUserApproved(requiredUserId(formData), formData.get("approved") === "1", actor);
  revalidatePath("/admin");
}

export async function banUserAction(formData: FormData) {
  const actor = await requireAdmin();
  await setUserBanned(requiredUserId(formData), formData.get("banned") === "1", actor);
  revalidatePath("/admin");
}

export async function clearSessionsAction(formData: FormData) {
  const actor = await requireAdmin();
  await clearUserSessions(requiredUserId(formData), actor);
  revalidatePath("/admin");
}
