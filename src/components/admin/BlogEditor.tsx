"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createBlogPostAction,
  updateBlogPostAction,
  type BlogFormState,
} from "@/app/admin/blog/actions";
import type { BlogPostRecord } from "@/lib/blog-data";

const initialState: BlogFormState = { ok: false, message: "" };

/** Mirrors slugify() on the server so the preview matches what will be saved. */
function previewSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function BlogEditor({ post }: { post?: BlogPostRecord }) {
  const isEdit = Boolean(post);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateBlogPostAction : createBlogPostAction,
    initialState,
  );

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const effectiveSlug = previewSlug(slug || title);

  return (
    <form action={formAction} className="blog-editor">
      {isEdit ? <input type="hidden" name="id" value={post?.id} /> : null}

      <div className="field">
        <label htmlFor="blog-title">Title</label>
        <input
          id="blog-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={140}
          required
          placeholder="What this post is about"
        />
      </div>

      <div className="field">
        <label htmlFor="blog-slug">URL</label>
        <input
          id="blog-slug"
          name="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          maxLength={80}
          placeholder="Leave blank to build one from the title"
        />
        <p className="field-hint">
          {effectiveSlug ? `/blog/${effectiveSlug}` : "A URL will be generated from the title."}
        </p>
      </div>

      <div className="field">
        <label htmlFor="blog-summary">Summary</label>
        <textarea
          id="blog-summary"
          name="summary"
          defaultValue={post?.summary ?? ""}
          maxLength={300}
          rows={2}
          placeholder="One or two sentences shown on the blog index."
        />
      </div>

      <div className="field">
        <label htmlFor="blog-tags">Tags</label>
        <input
          id="blog-tags"
          name="tags"
          defaultValue={post?.tags ?? ""}
          maxLength={200}
          placeholder="Comma separated — Linux, Hosting, Swift"
        />
      </div>

      <div className="field">
        <label htmlFor="blog-body">Body</label>
        <textarea
          id="blog-body"
          name="body"
          defaultValue={post?.body ?? ""}
          rows={22}
          required
          spellCheck
          placeholder={"## A heading\n\nParagraphs of markdown.\n\n- A list item\n\n```swift\nlet x = 1\n```"}
        />
        <p className="field-hint">
          Markdown: <code>##</code> headings, <code>-</code> and <code>1.</code> lists,{" "}
          <code>&gt;</code> quotes, <code>|</code> tables, fenced code blocks,{" "}
          <code>**bold**</code>, <code>`code`</code> and <code>[links](url)</code>.
        </p>
      </div>

      <div className="field">
        <label htmlFor="blog-status">Status</label>
        <select id="blog-status" name="status" defaultValue={post?.status ?? "draft"}>
          <option value="draft">Draft — only visible to admins</option>
          <option value="published">Published — visible on /blog</option>
        </select>
      </div>

      {state.message ? (
        <p className={state.ok ? "form-message form-message--ok" : "form-message form-message--error"}>
          {state.message}
        </p>
      ) : null}

      <div className="blog-editor-actions">
        <button className="ui-button ui-button--primary ui-button--md" type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create post"}
        </button>
        <Link className="ui-button ui-button--ghost ui-button--md" href="/admin/blog">
          Cancel
        </Link>
      </div>
    </form>
  );
}
