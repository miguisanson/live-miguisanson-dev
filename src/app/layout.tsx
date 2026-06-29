import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { getSiteBaseUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" dir="auto" data-theme="auto" className={sans.variable} suppressHydrationWarning>
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
