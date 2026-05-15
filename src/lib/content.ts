import fs from "node:fs";
import path from "node:path";

export type ContentItem = {
  slug: string;
  title: string;
  date?: string;
  summary: string;
  tags: string[];
  body: string;
};

const root = process.cwd();

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {} as Record<string, string>, body: raw };
  }

  const data = match[1].split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const separator = line.indexOf(":");
    if (separator === -1) {
      return acc;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    acc[key] = value;
    return acc;
  }, {});

  return { data, body: match[2].trim() };
}

function parseTags(value = "") {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getContentItems(type: "blog" | "projects") {
  const directory = path.join(root, "content", type);
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(directory, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? file.replace(/\.md$/, ""),
        date: data.date,
        summary: data.summary ?? "",
        tags: parseTags(data.tags),
        body,
      } satisfies ContentItem;
    })
    .sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
}

export function getContentItem(type: "blog" | "projects", slug: string) {
  return getContentItems(type).find((item) => item.slug === slug);
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  }

  closeList();
  return html.join("\n");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
