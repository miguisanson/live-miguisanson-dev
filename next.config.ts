import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

// Flip to `true` once the browser console shows no CSP violations in production.
// Until then the policy is sent as Report-Only so it can never break a page.
const enforceContentSecurityPolicy = false;

// Hosts the app genuinely talks to. Keep this list minimal — every entry widens
// the blast radius of an injected script or image tag.
const externalImageHosts = ["https://cdn.simpleicons.org", "https://cdn.jsdelivr.net"];
const turnstileHost = "https://challenges.cloudflare.com";
const gameHost = "https://game.miguisanson.dev";

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' covers the theme-init script in layout.tsx and Next's hydration
  // payload. 'unsafe-eval' is only needed by the dev-mode React refresh runtime.
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"} ${turnstileHost}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${externalImageHosts.join(" ")}`,
  "font-src 'self' data:",
  `connect-src 'self' ${turnstileHost}`,
  // Same-origin frames serve the DD Project runtime and certificate PDFs.
  `frame-src 'self' ${turnstileHost} ${gameHost}`,
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Browsers ignore this directive in a Report-Only policy and log a warning for
  // every page load. Only send it once the policy is actually enforced, so the
  // console stays clean enough to spot real violations.
  ...(enforceContentSecurityPolicy ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  {
    key: enforceContentSecurityPolicy ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicy,
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

// The GameMaker HTML5 runtime uses eval() and WebAssembly (verified in
// DD-Project.js). The site-wide policy above forbids both in production, so
// enforcing it would break the game. Relax the policy for this one route rather
// than weakening it everywhere — the document it serves is ours, and it embeds
// no third-party script.
const gameRuntimeCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "connect-src 'self' blob:",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework and version to attackers.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Must come after the site-wide rule so it overrides the CSP for this path.
        source: "/api/games/dd-project/runtime",
        headers: [
          {
            key: enforceContentSecurityPolicy
              ? "Content-Security-Policy"
              : "Content-Security-Policy-Report-Only",
            value: gameRuntimeCsp,
          },
        ],
      },
      {
        source: "/game-assets/dd-project/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Account and admin surfaces must never be stored by the CDN or the browser.
        source: "/:path(account|admin)/:rest*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
