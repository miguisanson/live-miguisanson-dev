import fs from "node:fs/promises";
import path from "node:path";

export async function prototypeHtmlResponse(slug: string) {
  const filePath = path.join(process.cwd(), "public", "prototypes", slug, "index.html");
  const html = await fs.readFile(filePath, "utf8");
  const htmlWithBase = html.replace("<head>", `<head>\n  <base href="/prototypes/${slug}/">`);

  return new Response(htmlWithBase, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
