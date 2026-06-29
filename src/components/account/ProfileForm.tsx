"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { accountPolicy, profileBackgroundPatterns } from "@/lib/account-policy";
import { useFocusTrap } from "@/lib/useFocusTrap";
import type { UserProfile } from "@/lib/profile-data";
import { updateProfileAction, type ProfileFormState } from "@/app/account/actions";

type GameOption = { slug: string; title: string };

type ProfileFormProps = {
  username: string;
  memberSince: string;
  displayName: string;
  profile: UserProfile;
  gameOptions: GameOption[];
};

const initialState: ProfileFormState = { ok: false, message: "" };

export function ProfileForm({ username, memberSince, displayName: initialDisplayName, profile, gameOptions }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [status, setStatus] = useState(profile.status);
  const [quote, setQuote] = useState(profile.quote);
  const [bio, setBio] = useState(profile.bio);
  const [favoriteGames, setFavoriteGames] = useState<string[]>(profile.favoriteGames);
  const [themeColor, setThemeColor] = useState(profile.themeColor || "#1f6feb");
  const [useThemeColor, setUseThemeColor] = useState(Boolean(profile.themeColor));
  const [bgPattern, setBgPattern] = useState(profile.bgPattern || "none");
  const [isPublic, setIsPublic] = useState(profile.isPublic);
  const [hideActivity, setHideActivity] = useState(profile.hideActivity);

  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl);
  const [uploading, setUploading] = useState<"avatar" | "banner" | null>(null);
  const [uploadError, setUploadError] = useState("");
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  useFocusTrap(previewOpen, dialogRef);

  useEffect(() => {
    if (!previewOpen) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreviewOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [previewOpen]);

  async function upload(kind: "avatar" | "banner", file: File) {
    setUploading(kind);
    setUploadError("");
    const body = new FormData();
    body.append("kind", kind);
    body.append("file", file);
    try {
      const res = await fetch("/api/profile/media", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setUploadError(data.error ?? "Upload failed.");
      } else if (kind === "avatar") {
        setAvatarUrl(data.url);
      } else {
        setBannerUrl(data.url);
      }
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(null);
    }
  }

  function toggleGame(slug: string) {
    setFavoriteGames((current) =>
      current.includes(slug)
        ? current.filter((value) => value !== slug)
        : current.length < accountPolicy.favoriteGamesMax
          ? [...current, slug]
          : current,
    );
  }

  const initial = (displayName || username || "?").trim().slice(0, 1).toUpperCase();
  const activeTheme = useThemeColor ? themeColor : "";
  const previewStyle = activeTheme ? ({ ["--profile-accent" as string]: activeTheme }) : undefined;
  const gameTitle = (slug: string) => gameOptions.find((game) => game.slug === slug)?.title ?? slug;

  return (
    <div className="profile-edit">
      <div className="profile-edit-toolbar">
        <h2>Edit profile</h2>
        <button type="button" className="account-small-button" onClick={() => setPreviewOpen(true)}>
          Preview profile
        </button>
      </div>

      <form className="account-form profile-edit-form" action={formAction}>
        {state.message ? (
          <p className={state.ok ? "account-notice" : "account-error"} aria-live={state.ok ? "polite" : "assertive"}>
            {state.message}
          </p>
        ) : null}
        {uploadError ? (
          <p className="account-error" aria-live="assertive">
            {uploadError}
          </p>
        ) : null}

        <fieldset className="profile-fieldset">
          <legend>Images</legend>
          <div className="profile-upload-row">
            <div className="profile-upload">
              <span className="field-label">Avatar</span>
              <div className="profile-upload-control">
                <span className="public-avatar profile-upload-avatar" aria-hidden="true">
                  {avatarUrl ? <Image src={avatarUrl} alt="" width={64} height={64} /> : initial}
                </span>
                <input
                  ref={avatarInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="visually-hidden-input"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload("avatar", file);
                  }}
                />
                <button type="button" className="account-small-button" onClick={() => avatarInput.current?.click()} disabled={uploading === "avatar"}>
                  {uploading === "avatar" ? "Uploading..." : "Upload avatar"}
                </button>
              </div>
            </div>
            <div className="profile-upload">
              <span className="field-label">Banner</span>
              <div className="profile-upload-control">
                <span className="profile-upload-banner" aria-hidden="true">
                  {bannerUrl ? <Image src={bannerUrl} alt="" width={120} height={64} /> : <span className="profile-upload-banner-empty">No banner</span>}
                </span>
                <input
                  ref={bannerInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="visually-hidden-input"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload("banner", file);
                  }}
                />
                <button type="button" className="account-small-button" onClick={() => bannerInput.current?.click()} disabled={uploading === "banner"}>
                  {uploading === "banner" ? "Uploading..." : bannerUrl ? "Replace banner" : "Upload banner"}
                </button>
              </div>
            </div>
          </div>
          <p className="field-hint">PNG, JPG, or WebP. Avatar up to 2MB, banner up to 4MB.</p>
        </fieldset>

        <fieldset className="profile-fieldset">
          <legend>Identity</legend>
          <label>
            Display name
            <input name="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={accountPolicy.displayNameMaxLength} required />
          </label>
          <label>
            Status
            <input name="status" value={status} onChange={(event) => setStatus(event.target.value)} maxLength={accountPolicy.statusMaxLength} placeholder="What are you up to?" />
          </label>
          <label>
            Favorite quote
            <input name="quote" value={quote} onChange={(event) => setQuote(event.target.value)} maxLength={accountPolicy.quoteMaxLength} placeholder="A line you like." />
          </label>
          <label>
            Bio
            <textarea name="bio" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={accountPolicy.bioMaxLength} rows={4} />
            <span className="field-counter">
              {bio.length}/{accountPolicy.bioMaxLength}
            </span>
          </label>
        </fieldset>

        {gameOptions.length > 0 ? (
          <fieldset className="profile-fieldset">
            <legend>Favorite games</legend>
            <div className="profile-checkbox-grid">
              {gameOptions.map((game) => (
                <label key={game.slug} className="profile-checkbox">
                  <input type="checkbox" name="favoriteGames" value={game.slug} checked={favoriteGames.includes(game.slug)} onChange={() => toggleGame(game.slug)} />
                  <span>{game.title}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <fieldset className="profile-fieldset">
          <legend>Appearance</legend>
          <label className="profile-checkbox">
            <input type="checkbox" checked={useThemeColor} onChange={(event) => setUseThemeColor(event.target.checked)} />
            <span>Use a profile accent color</span>
          </label>
          <div className="profile-field-grid">
            <label>
              Accent color
              <input name="themeColor" type="color" value={themeColor} onChange={(event) => setThemeColor(event.target.value)} disabled={!useThemeColor} />
            </label>
            <label>
              Background pattern
              <select name="bgPattern" value={bgPattern} onChange={(event) => setBgPattern(event.target.value)}>
                {profileBackgroundPatterns.map((pattern) => (
                  <option key={pattern} value={pattern}>
                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {!useThemeColor ? <input type="hidden" name="themeColor" value="" /> : null}
        </fieldset>

        <fieldset className="profile-fieldset">
          <legend>Privacy</legend>
          <label className="profile-checkbox">
            <input type="checkbox" name="isPublic" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />
            <span>Public profile (others can open your profile page)</span>
          </label>
          <label className="profile-checkbox">
            <input type="checkbox" name="hideActivity" checked={hideActivity} onChange={(event) => setHideActivity(event.target.checked)} />
            <span>Hide game activity on my profile</span>
          </label>
        </fieldset>

        <div className="profile-edit-actions">
          <button type="button" className="account-small-button" onClick={() => setPreviewOpen(true)}>
            Preview
          </button>
          <button className="account-primary-button account-form-submit" type="submit" disabled={pending || uploading !== null}>
            {pending ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>

      {previewOpen ? (
        <div className="profile-preview-modal" role="presentation">
          <button className="account-modal-backdrop" type="button" aria-label="Close preview" onClick={() => setPreviewOpen(false)} />
          <section className="profile-preview-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Profile preview">
            <div className="profile-preview-dialog-head">
              <strong>Preview — unsaved changes</strong>
              <button type="button" className="account-small-button" onClick={() => setPreviewOpen(false)}>
                Close
              </button>
            </div>
            <article className={`public-profile-card profile-bg-${bgPattern}`} style={previewStyle}>
              <div className={`public-profile-banner${bannerUrl ? " has-image" : ""}`}>
                {bannerUrl ? <Image src={bannerUrl} alt="" fill sizes="520px" style={{ objectFit: "cover" }} /> : null}
              </div>
              <div className="public-profile-body">
                <span className="public-avatar" aria-hidden="true">
                  {avatarUrl ? <Image src={avatarUrl} alt="" width={76} height={76} /> : initial}
                </span>
                <div className="public-profile-identity">
                  <p className="post-meta">@{username || "username"}</p>
                  <p className="profile-preview-name">{displayName || "Your name"}</p>
                  {status ? <p className="profile-status">{status}</p> : null}
                  <p className="account-muted-text">Member since {memberSince}</p>
                </div>
              </div>
              {quote ? <blockquote className="profile-quote">{quote}</blockquote> : null}
              <p className="public-profile-bio">{bio || "No bio yet."}</p>
              {favoriteGames.length > 0 ? (
                <div className="profile-game-chips">
                  {favoriteGames.map((slug) => (
                    <span key={slug} className="tag-chip">
                      {gameTitle(slug)}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          </section>
        </div>
      ) : null}
    </div>
  );
}
