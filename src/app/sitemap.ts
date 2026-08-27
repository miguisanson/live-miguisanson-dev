import type { MetadataRoute } from "next";
import { getContentItems } from "@/lib/content";
import { listPublicUsernames } from "@/lib/profile-data";
import { getSiteBaseUrl } from "@/lib/site-url";
import { projectPagesArePublic } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteBaseUrl();
  const now = new Date();

  // /changelog and /docs are only listed when they are actually public — there is
  // no point advertising URLs that 404 for everyone but an admin.
  const projectRoutes = projectPagesArePublic ? ["/changelog", "/docs"] : [];

  const staticRoutes: MetadataRoute.Sitemap = ["", "/resume", "/games", "/community", "/blog", ...projectRoutes].map((path) => ({
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
