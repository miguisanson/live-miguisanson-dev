import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { path: segments } = await params;
  const root = path.resolve(process.cwd(), ".runtime", "uploads");
  const resolved = path.resolve(root, ...segments);

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  const extension = path.extname(resolved).toLowerCase();
  const contentType = contentTypes[extension];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const stats = await stat(resolved);
    if (!stats.isFile()) {
      return new Response("Not found", { status: 404 });
    }
    const file = await readFile(resolved);
    return new Response(new Uint8Array(file), {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
