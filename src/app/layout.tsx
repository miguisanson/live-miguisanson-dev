import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { getSiteBaseUrl } from "@/lib/site-url";
import "./globals.css";

// Three type roles, all self-hosted by next/font so there is no external request
// and no font host to allow through the CSP.
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display face: a tight industrial grotesque that gives headings a voice of their
// own instead of rendering them as larger body text.
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Used for metadata, counts, timestamps, tech chips, and code.
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteBaseUrl()),
  title: {
    default: "miguisanson.dev",
    template: "%s | miguisanson.dev",
  },
  description:
    "miguisanson.dev — a small community platform for portfolio work, games, member profiles, and posts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="auto"
      data-theme="auto"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="list" id="top">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var theme = localStorage.getItem("pref-theme");
                if (theme === "dark" || theme === "light") {
                  document.documentElement.dataset.theme = theme;
                } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                  document.documentElement.dataset.theme = "dark";
                } else {
                  document.documentElement.dataset.theme = "light";
                }
              })();
            `,
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
