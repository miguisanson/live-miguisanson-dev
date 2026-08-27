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

/**
 * Renders the small markdown subset used by blog posts and member posts.
 *
 * Supported: `##` / `###` / `####` headings, `-` and `1.` lists, `>` quotes,
 * `---` rules, fenced code blocks, and inline **bold**, `code` and [links](url).
 *
 * SAFETY: every path escapes HTML *before* any tag is added, so the only markup
 * that can reach the DOM is what this function emits. Do not reorder that, and
 * do not replace this with a renderer that passes raw HTML through.
 */
export function markdownToHtml(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inQuote = false;
  let codeLanguage: string | null = null;
  let codeBuffer: string[] = [];
  let inTable = false;
  let paragraph: string[] = [];

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  const closeQuote = () => {
    if (inQuote) {
      html.push("</blockquote>");
      inQuote = false;
    }
  };

  const closeTable = () => {
    if (inTable) {
      html.push("</tbody></table></div>");
      inTable = false;
    }
  };

  // Markdown paragraphs are hard-wrapped across several source lines. Buffer
  // them and emit one <p>, or every wrapped line becomes its own paragraph.
  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const openList = (type: "ul" | "ol") => {
    if (listType !== type) {
      closeList();
      html.push(`<${type}>`);
      listType = type;
    }
  };

  const flushCode = () => {
    const cls = codeLanguage ? ` class="lang-${escapeAttribute(codeLanguage)}"` : "";
    html.push(`<pre${cls}><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
    codeBuffer = [];
    codeLanguage = null;
  };

  for (const line of lines) {
    // Inside a fence, take lines verbatim until the closing fence.
    if (codeLanguage !== null) {
      if (line.trim().startsWith("```")) {
        flushCode();
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph();
      closeList();
      closeQuote();
      codeLanguage = trimmed.slice(3).trim() || "text";
      codeBuffer = [];
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      closeQuote();
      closeTable();
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      flushParagraph();
      closeList();
      closeQuote();
      html.push("<hr />");
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      closeList();
      closeQuote();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      closeList();
      if (!inQuote) {
        html.push("<blockquote>");
        inQuote = true;
      }
      html.push(`<p>${inlineMarkdown(trimmed.slice(2))}</p>`);
      continue;
    }

    // Pipe tables: a header row, a |---|---| separator, then body rows.
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushParagraph();
      closeList();
      closeQuote();
      const cells = (row: string) =>
        row
          .slice(1, -1)
          .split("|")
          .map((cell) => cell.trim());
      const next = lines[lines.indexOf(line) + 1]?.trim() ?? "";
      const isHeader = /^\|[\s:|-]+\|$/.test(next);
      if (isHeader && !inTable) {
        inTable = true;
        html.push("<div class=\"post-table-wrap\"><table><thead><tr>");
        for (const cell of cells(trimmed)) {
          html.push(`<th>${inlineMarkdown(cell)}</th>`);
        }
        html.push("</tr></thead><tbody>");
        continue;
      }
      if (/^\|[\s:|-]+\|$/.test(trimmed)) {
        continue;
      }
      if (inTable) {
        html.push("<tr>");
        for (const cell of cells(trimmed)) {
          html.push(`<td>${inlineMarkdown(cell)}</td>`);
        }
        html.push("</tr>");
        continue;
      }
    }

    const ordered = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (ordered) {
      flushParagraph();
      closeQuote();
      openList("ol");
      html.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      closeQuote();
      openList("ul");
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      continue;
    }

    closeList();
    closeQuote();
    paragraph.push(trimmed);
  }

  if (codeLanguage !== null) {
    flushCode();
  }
  flushParagraph();
  closeList();
  closeQuote();
  closeTable();
  return html.join("\n");
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    // Only http(s), mailto and site-relative targets — never javascript: URLs.
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)/g,
      '<a href="$2">$1</a>');
}

function escapeAttribute(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

/**
 * Renders a single line of inline markdown — `code` and **bold** only.
 *
 * Escaping runs first, so the tags this adds are the only markup that can reach
 * the DOM. Used for changelog and docs copy, which is authored in the repo.
 */
export function inlineMarkdownToHtml(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
