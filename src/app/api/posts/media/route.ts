import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { accountPolicy } from "@/lib/account-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxBytes = 5 * 1024 * 1024;

// Extension is derived from the sniffed signature below, never from the
// browser-supplied file.type, which anyone can set to whatever they like.
const signatures: { ext: string; type: string; test: (b: Buffer) => boolean }[] = [
  {
    ext: "png",
    type: "image/png",
    test: (b) => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    ext: "jpg",
    type: "image/jpeg",
    test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: "webp",
    type: "image/webp",
    test: (b) =>
      b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP",
  },
  {
    ext: "gif",
    type: "image/gif",
    test: (b) => b.length > 6 && ["GIF87a", "GIF89a"].includes(b.subarray(0, 6).toString("ascii")),
  },
];

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }
  if (!session.user.emailVerified) {
    return NextResponse.json({ error: "Verify your email before posting images." }, { status: 403 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No images provided." }, { status: 400 });
  }
  if (files.length > accountPolicy.postImageMax) {
    return NextResponse.json(
      { error: `Attach at most ${accountPolicy.postImageMax} images.` },
      { status: 400 },
    );
  }

  const dir = path.join(process.cwd(), ".runtime", "uploads", "posts");
  await mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (file.size > maxBytes) {
      return NextResponse.json({ error: `Each image must be ${maxBytes / (1024 * 1024)}MB or smaller.` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const match = signatures.find((signature) => signature.test(buffer));
    if (!match) {
      return NextResponse.json({ error: "Use a PNG, JPG, WebP, or GIF image." }, { status: 400 });
    }

    const filename = `${session.user.id}-${randomBytes(8).toString("hex")}.${match.ext}`;
    await writeFile(path.join(dir, filename), buffer);
    urls.push(`/media/posts/${filename}`);
  }

  return NextResponse.json({ urls });
}
