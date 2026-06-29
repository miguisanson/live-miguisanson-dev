const PRODUCTION_URL = "https://miguisanson.dev";

export function getSiteBaseUrl() {
  const configured = process.env.BETTER_AUTH_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      const isLocal = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname);
      if (process.env.NODE_ENV === "production" && isLocal) {
        return PRODUCTION_URL;
      }
      return url.origin;
    } catch {
      return PRODUCTION_URL;
    }
  }
  return process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";
}
