"use client";

import { useState } from "react";
import { deleteBlogPostAction } from "@/app/admin/blog/actions";

/**
 * Two-step delete. Deleting a post is irreversible, so the first click only
 * arms the action and the second performs it.
 */
export function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <div className="danger-zone">
        <div>
          <h3>Delete this post</h3>
          <p>Removes it from the blog permanently. This cannot be undone.</p>
        </div>
        <button
          className="ui-button ui-button--danger ui-button--sm"
          type="button"
          onClick={() => setArmed(true)}
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <form action={deleteBlogPostAction} className="danger-zone danger-zone--armed">
      <input type="hidden" name="id" value={id} />
      <div>
        <h3>Delete “{title}”?</h3>
        <p>This cannot be undone.</p>
      </div>
      <div className="danger-zone-actions">
        <button className="ui-button ui-button--danger ui-button--sm" type="submit">
          Yes, delete it
        </button>
        <button
          className="ui-button ui-button--ghost ui-button--sm"
          type="button"
          onClick={() => setArmed(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
