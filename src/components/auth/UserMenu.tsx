"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ChevronDownIcon } from "@/components/layout/NavIcons";

type UserMenuProps = {
  username: string;
  displayName: string;
};

export function UserMenu({ username, displayName }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    firstItemRef.current?.focus();

    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function signOut() {
    setSigningOut(true);
    await authClient.signOut();
    window.location.assign("/");
  }

  const profileHref = username ? `/u/${encodeURIComponent(username)}` : "/account";

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className="account-trigger user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="user-menu-name">{displayName}</span>
        <ChevronDownIcon size={16} />
      </button>

      {open ? (
        <div className="user-menu-dropdown" role="menu" aria-label="Account menu">
          <Link
            ref={firstItemRef}
            href={profileHref}
            role="menuitem"
            className="user-menu-item"
            onClick={() => setOpen(false)}
          >
            View profile
          </Link>
          <Link href="/account/profile" role="menuitem" className="user-menu-item" onClick={() => setOpen(false)}>
            Edit profile
          </Link>
          <Link href="/account" role="menuitem" className="user-menu-item" onClick={() => setOpen(false)}>
            Account settings
          </Link>
          <button
            type="button"
            role="menuitem"
            className="user-menu-item user-menu-signout"
            onClick={signOut}
            disabled={signingOut}
          >
            {signingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
