import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateProfileMedia } from "@/lib/profile-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sizeLimits: Record<"avatar" | "banner", number> = {
  avatar: 2 * 1024 * 1024,
  banner: 4 * 1024 * 1024,
};

const mimeToExt: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const form = await request.formData();
  const kind = String(form.get("kind"));
  if (kind !== "avatar" && kind !== "banner") {
    return NextResponse.json({ error: "Invalid upload kind." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const ext = mimeToExt[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use a PNG, JPG, or WebP image." }, { status: 400 });
  }
  if (file.size > sizeLimits[kind]) {
    return NextResponse.json(
      { error: `Image is too large (max ${Math.round(sizeLimits[kind] / (1024 * 1024))}MB).` },
      { status: 400 },
    );
  }

  const dir = path.join(process.cwd(), ".runtime", "uploads", kind);
  await mkdir(dir, { recursive: true });
  const filename = `${session.user.id}-${randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const url = `/media/${kind}/${filename}`;
  await updateProfileMedia(session.user.id, kind, url);

  return NextResponse.json({ url });
}
