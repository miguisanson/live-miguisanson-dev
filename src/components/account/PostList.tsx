"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { accountPolicy } from "@/lib/account-policy";
import { deletePostAction, updatePostAction, type PostFormState } from "@/app/account/posts/actions";
import { PostGallery } from "@/components/account/PostGallery";

export type PostView = {
  id: string;
  body: string;
  html: string;
  visibility: string;
  images: string[];
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

  return (
    <article className="post-card">
      <div className="post-card-head">
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
          {/* Member posts are always public; visibility is carried through
              unchanged rather than offered as a choice. */}
          <input type="hidden" name="visibility" value={post.visibility} />
          <div className="post-composer-actions">
            <button className="ui-button ui-button--primary ui-button--sm" type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button className="ui-button ui-button--ghost ui-button--sm" type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {post.body ? <div className="post-card-body" dangerouslySetInnerHTML={{ __html: post.html }} /> : null}
          <PostGallery images={post.images} alt="Attached image" />
          <div className="post-card-actions">
            <button className="account-small-button" type="button" onClick={() => setEditing(true)}>
              Edit
            </button>
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
