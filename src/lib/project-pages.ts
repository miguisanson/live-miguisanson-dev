import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "./auth";
import { isAdminUser } from "./admin-data";
import { projectPagesArePublic } from "./site-config";

/**
 * Gate for /changelog and /docs.
 *
 * Hiding the links in the sidebar is cosmetic — anyone can still type the URL.
 * Call this at the top of the page itself so the route genuinely refuses.
 *
 * Returns 404 rather than 401 so an unauthorised visitor cannot tell the page
 * exists at all.
 */
export async function requireProjectPageAccess() {
  if (projectPagesArePublic) {
    return;
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !(await isAdminUser(session.user.id))) {
    notFound();
  }
}
