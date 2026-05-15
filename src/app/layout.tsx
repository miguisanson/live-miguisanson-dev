import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "miguisanson.dev",
    template: "%s | miguisanson.dev",
  },
  description:
    "Miguel Joaquin A. Sanson's personal technology hub for portfolio work, project case studies, lab demos, games, and learning notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="auto" data-theme="auto" suppressHydrationWarning>
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
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
