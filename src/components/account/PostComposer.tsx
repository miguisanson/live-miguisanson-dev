"use client";

import { useActionState, useEffect, useState } from "react";
import { accountPolicy } from "@/lib/account-policy";
import { createPostAction, type PostFormState } from "@/app/account/posts/actions";

const initialState: PostFormState = { ok: false, message: "" };

export function PostComposer() {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (state.ok) {
      setBody("");
    }
  }, [state]);

  return (
    <form className="account-form post-composer" action={formAction}>
      {state.message ? (
        <p className={state.ok ? "account-notice" : "account-error"} aria-live="polite">
          {state.message}
        </p>
      ) : null}
      <label>
        New post
        <textarea
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={accountPolicy.postMaxLength}
          rows={4}
          placeholder="Share something. Markdown supported."
          required
        />
        <span className="field-counter">
          {body.length}/{accountPolicy.postMaxLength}
        </span>
      </label>
      <div className="post-composer-actions">
        <select name="visibility" defaultValue="public" aria-label="Post visibility">
          <option value="public">Public</option>
          <option value="draft">Draft</option>
        </select>
        <button className="account-primary-button" type="submit" disabled={pending}>
          {pending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
