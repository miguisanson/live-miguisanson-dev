import type { MetadataRoute } from "next";
import { getContentItems } from "@/lib/content";
import { listPublicUsernames } from "@/lib/profile-data";
import { getSiteBaseUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/resume", "/games", "/community", "/blog"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
  }));

  let profiles: MetadataRoute.Sitemap = [];
  try {
    const usernames = await listPublicUsernames();
    profiles = usernames.map((username) => ({
      url: `${base}/u/${encodeURIComponent(username)}`,
      lastModified: now,
      changeFrequency: "weekly",
    }));
  } catch {
    profiles = [];
  }

  const posts: MetadataRoute.Sitemap = getContentItems("blog").map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...profiles, ...posts];
}
