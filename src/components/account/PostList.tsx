"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { accountPolicy } from "@/lib/account-policy";
import {
  deletePostAction,
  setPostVisibilityAction,
  updatePostAction,
  type PostFormState,
} from "@/app/account/posts/actions";

export type PostView = {
  id: string;
  body: string;
  html: string;
  visibility: string;
  createdAt: string;
};

const initialState: PostFormState = { ok: false, message: "" };

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function PostItem({ post }: { post: PostView }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updatePostAction, initialState);
  const prevOk = useRef(false);

  useEffect(() => {
    if (state.ok && !prevOk.current) {
      setEditing(false);
    }
    prevOk.current = state.ok;
  }, [state.ok]);

  const isPublic = post.visibility === "public";

  return (
    <article className="post-card">
      <div className="post-card-head">
        <span className={`post-visibility${isPublic ? " is-public" : ""}`}>{isPublic ? "Public" : "Draft"}</span>
        <time dateTime={post.createdAt}>{dateLabel(post.createdAt)}</time>
      </div>

      {editing ? (
        <form className="account-form" action={formAction}>
          <input type="hidden" name="id" value={post.id} />
          {state.message ? (
            <p className={state.ok ? "account-notice" : "account-error"} aria-live="polite">
              {state.message}
            </p>
          ) : null}
          <textarea name="body" defaultValue={post.body} maxLength={accountPolicy.postMaxLength} rows={4} required />
          <div className="post-composer-actions">
            <select name="visibility" defaultValue={post.visibility} aria-label="Post visibility">
              <option value="public">Public</option>
              <option value="draft">Draft</option>
            </select>
            <button className="account-primary-button" type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </button>
            <button className="account-small-button" type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="post-card-body" dangerouslySetInnerHTML={{ __html: post.html }} />
          <div className="post-card-actions">
            <button className="account-small-button" type="button" onClick={() => setEditing(true)}>
              Edit
            </button>
            <form action={setPostVisibilityAction}>
              <input type="hidden" name="id" value={post.id} />
              <input type="hidden" name="visibility" value={isPublic ? "draft" : "public"} />
              <button className="account-small-button" type="submit">
                {isPublic ? "Make draft" : "Make public"}
              </button>
            </form>
            <form action={deletePostAction}>
              <input type="hidden" name="id" value={post.id} />
              <button className="account-small-button post-delete" type="submit">
                Delete
              </button>
            </form>
          </div>
        </>
      )}
    </article>
  );
}

export function PostList({ posts }: { posts: PostView[] }) {
  if (posts.length === 0) {
    return <p className="account-empty">No posts yet. Write your first one above.</p>;
  }
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
