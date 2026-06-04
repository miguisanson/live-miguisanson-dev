import fs from "node:fs/promises";
import path from "node:path";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function addBaseTag(html: string, slug: string) {
  if (html.includes("<base ")) {
    return html;
  }
  return html.replace("<head>", `<head>\n  <base href="/prototypes/${slug}/">`);
}

export async function prototypeHtmlResponse(slug: string) {
  const filePath = path.join(process.cwd(), "public", "prototypes", slug, "index.html");
  const html = await fs.readFile(filePath, "utf8");
  const htmlWithBase = addBaseTag(html, slug);

  return new Response(htmlWithBase, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}

export async function prototypeFileOrHtmlResponse(slug: string, request: Request) {
  const publicRoot = path.resolve(process.cwd(), "public", "prototypes", slug);
  const url = new URL(request.url);
  const prefix = `/prototypes/${slug}/`;
  const relativePath = decodeURIComponent(url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) : "");
  const requestedPath = relativePath || "index.html";
  const resolvedPath = path.resolve(publicRoot, requestedPath);

  if (resolvedPath !== publicRoot && !resolvedPath.startsWith(`${publicRoot}${path.sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const stat = await fs.stat(resolvedPath);
    if (stat.isFile()) {
      const extension = path.extname(resolvedPath).toLowerCase();
      if (extension === ".html") {
        const html = await fs.readFile(resolvedPath, "utf8");
        return new Response(addBaseTag(html, slug), {
          headers: {
            "content-type": contentTypes[extension],
            "cache-control": "public, max-age=0, must-revalidate",
          },
        });
      }

      const file = await fs.readFile(resolvedPath);
      return new Response(file, {
        headers: {
          "content-type": contentTypes[extension] ?? "application/octet-stream",
          // Built prototype assets use content-hashed filenames, so they are safe to cache immutably.
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {
    if (path.extname(requestedPath)) {
      return new Response("Not found", { status: 404 });
    }
  }

  return prototypeHtmlResponse(slug);
}
