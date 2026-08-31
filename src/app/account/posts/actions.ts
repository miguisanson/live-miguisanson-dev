"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { accountPolicy, validatePostBody } from "@/lib/account-policy";
import { createPost, deletePost, getPost, serializePostImages, updatePost } from "@/lib/posts-data";

export type PostFormState = {
  ok: boolean;
  message: string;
};

type SessionUser = { id: string; username?: string | null };

async function requireUser(): Promise<SessionUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account&message=Log%20in%20to%20write%20posts.");
  }
  return session.user as SessionUser;
}

function revalidatePost(username?: string | null) {
  revalidatePath("/community");
  if (username) {
    revalidatePath(`/u/${username}`);
  }
}

export async function createPostAction(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();

  // Images arrive already uploaded, as /media/posts/... URLs from the composer.
  // serializePostImages re-checks the prefix, so a forged field cannot point the
  // post at an arbitrary URL.
  const images = serializePostImages(
    formData.getAll("images").map((value) => String(value)),
    accountPolicy.postImageMax,
  );

  // A post with no text but with pictures is a legitimate Reddit-style image
  // post, so only require a body when nothing is attached.
  if (!body && !images) {
    return { ok: false, message: "Write something or attach an image." };
  }
  if (body) {
    const error = validatePostBody(body);
    if (error) {
      return { ok: false, message: error };
    }
  }

  await createPost(user.id, body, "public", images);
  revalidatePost(user.username);
  return { ok: true, message: "Posted." };
}

export async function updatePostAction(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "public");

  const error = validatePostBody(body);
  if (error) {
    return { ok: false, message: error };
  }

  const updated = await updatePost(id, user.id, body, visibility);
  if (!updated) {
    return { ok: false, message: "Could not update that post." };
  }
  revalidatePost(user.username);
  return { ok: true, message: "Updated." };
}

export async function deletePostAction(formData: FormData) {
  const user = await requireUser();
  await deletePost(String(formData.get("id") ?? ""), user.id);
  revalidatePost(user.username);
}

export async function setPostVisibilityAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const visibility = String(formData.get("visibility") ?? "public");
  const post = await getPost(id);
  if (post && post.userId === user.id) {
    await updatePost(id, user.id, post.body, visibility);
  }
  revalidatePost(user.username);
}
