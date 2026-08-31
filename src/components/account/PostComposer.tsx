"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { accountPolicy } from "@/lib/account-policy";
import { createPostAction, type PostFormState } from "@/app/account/posts/actions";

const initialState: PostFormState = { ok: false, message: "" };

type Attachment = {
  /** Object URL for the local preview, shown while and after uploading. */
  preview: string;
  /** Server path, present once the upload finishes. */
  url?: string;
  error?: string;
};

export function PostComposer() {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      setBody("");
      setAttachments((current) => {
        current.forEach((item) => URL.revokeObjectURL(item.preview));
        return [];
      });
    }
  }, [state]);

  // Object URLs are only released on unmount here; removing a single attachment
  // revokes its own URL at the point of removal.
  useEffect(() => {
    return () => {
      setAttachments((current) => {
        current.forEach((item) => URL.revokeObjectURL(item.preview));
        return [];
      });
    };
  }, []);

  const remaining = accountPolicy.postImageMax - attachments.length;
  const uploaded = attachments.filter((item) => item.url);
  const canSubmit = (body.trim().length > 0 || uploaded.length > 0) && !pending && !uploading;

  async function onFilesChosen(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? []).slice(0, remaining);
    if (chosen.length === 0) {
      return;
    }

    const pendingItems: Attachment[] = chosen.map((file) => ({ preview: URL.createObjectURL(file) }));
    setAttachments((current) => [...current, ...pendingItems]);
    setUploading(true);

    try {
      const payload = new FormData();
      chosen.forEach((file) => payload.append("files", file));

      const response = await fetch("/api/posts/media", { method: "POST", body: payload });
      const result = (await response.json()) as { urls?: string[]; error?: string };

      setAttachments((current) =>
        current.map((item) => {
          const index = pendingItems.indexOf(item);
          if (index === -1) {
            return item;
          }
          return response.ok && result.urls?.[index]
            ? { ...item, url: result.urls[index] }
            : { ...item, error: result.error ?? "Upload failed." };
        }),
      );
    } catch {
      setAttachments((current) =>
        current.map((item) => (pendingItems.includes(item) ? { ...item, error: "Upload failed." } : item)),
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeAttachment(target: Attachment) {
    URL.revokeObjectURL(target.preview);
    setAttachments((current) => current.filter((item) => item !== target));
  }

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
        />
        <span className="field-counter">
          {body.length}/{accountPolicy.postMaxLength}
        </span>
      </label>

      {/* Uploaded URLs travel with the form; the file input itself is not submitted. */}
      {uploaded.map((item) => (
        <input key={item.url} type="hidden" name="images" value={item.url} />
      ))}

      {attachments.length > 0 ? (
        <ul className="composer-attachments">
          {attachments.map((item, index) => (
            <li key={item.preview} className={item.error ? "is-failed" : item.url ? "" : "is-uploading"}>
              <Image src={item.preview} alt={`Attachment ${index + 1}`} width={96} height={96} unoptimized />
              {!item.url && !item.error ? <span className="attachment-state">Uploading…</span> : null}
              {item.error ? <span className="attachment-state is-error">{item.error}</span> : null}
              <button
                type="button"
                className="attachment-remove"
                onClick={() => removeAttachment(item)}
                aria-label={`Remove attachment ${index + 1}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="post-composer-actions">
        <input
          ref={fileInputRef}
          id="post-images"
          className="visually-hidden"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={onFilesChosen}
          disabled={remaining <= 0 || uploading}
        />
        <label
          htmlFor="post-images"
          className={`ui-button ui-button--neutral ui-button--sm composer-attach${
            remaining <= 0 || uploading ? " is-disabled" : ""
          }`}
        >
          {uploading ? "Uploading…" : `Add images (${attachments.length}/${accountPolicy.postImageMax})`}
        </label>

        <button className="ui-button ui-button--primary ui-button--sm" type="submit" disabled={!canSubmit}>
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
