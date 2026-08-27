import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { requireProjectPageAccess } from "@/lib/project-pages";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "How miguisanson.dev is built: architecture, design system, accounts, games, deployment and security.",
  alternates: { canonical: "/docs" },
};

const sections = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "design", label: "Design system" },
  { id: "accounts", label: "Accounts" },
  { id: "community", label: "Community" },
  { id: "games", label: "Games" },
  { id: "security", label: "Security" },
  { id: "deployment", label: "Deployment" },
];

export default async function DocsPage() {
  await requireProjectPageAccess();

  return (
    <PageShell
      eyebrow="Documentation"
      title="How this site works"
      description="A reference for the architecture, conventions and operational setup behind miguisanson.dev."
    >
      <nav className="doc-nav" aria-label="Sections">
        <a href="/changelog">Changelog</a>
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </nav>

      <div className="doc-page">
        <section className="doc-section" id="overview">
          <h2>Overview</h2>
          <div className="doc-body">
            <p>
              miguisanson.dev is a single application serving four purposes: a portfolio, a place to
              create an account and keep a profile, a community where members post and read, and a
              hub for browser games. It is one Next.js app rather than four separate sites, so a
              member signs in once and that identity carries across every section.
            </p>
            <p>
              It is self-hosted on an Ubuntu server behind a Cloudflare Tunnel — there is no
              third-party application host in the path. That keeps running costs at the price of the
              domain, and means deployment is a deliberate step rather than an automatic one.
            </p>
          </div>
        </section>

        <section className="doc-section" id="architecture">
          <h2>Architecture</h2>
          <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Choice</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Framework</strong></td>
                  <td>Next.js 16, App Router</td>
                  <td>Server components keep database queries on the server; static pages stay static.</td>
                </tr>
                <tr>
                  <td><strong>Language</strong></td>
                  <td>TypeScript</td>
                  <td>Typed data models across the profile, post and game layers.</td>
                </tr>
                <tr>
                  <td><strong>Auth</strong></td>
                  <td>Better Auth</td>
                  <td>Email and username sign-in, verification, resets and rate limiting without hand-rolling sessions.</td>
                </tr>
                <tr>
                  <td><strong>Database</strong></td>
                  <td>SQLite locally, PostgreSQL in production</td>
                  <td>Zero setup for development; a real database in production. One query layer targets both.</td>
                </tr>
                <tr>
                  <td><strong>Styling</strong></td>
                  <td>Hand-written CSS with design tokens</td>
                  <td>No build-time CSS framework; every colour resolves through a token defined for both themes.</td>
                </tr>
                <tr>
                  <td><strong>Content</strong></td>
                  <td>Markdown in <code>content/</code></td>
                  <td>Blog posts and project write-ups are files, versioned alongside the code.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="doc-body">
            <p>
              <strong>Database access.</strong> <code>src/lib/app-db.ts</code> exposes one query
              interface that takes a SQL pair — one SQLite statement, one PostgreSQL statement — and
              runs whichever matches the active dialect. Every query is parameterized. Better Auth
              shares the same connection pool rather than opening its own.
            </p>
          </div>
        </section>

        <section className="doc-section" id="design">
          <h2>Design system</h2>
          <div className="doc-body">
            <p>
              All colour, spacing, type, elevation and motion values are declared as CSS custom
              properties at the top of <code>globals.css</code>, defined once for light and once for
              dark. Components must never hard-code a colour — a component styled through tokens is
              correct in both themes automatically.
            </p>
            <p>
              <strong>Palette.</strong> Neutrals are biased toward blue rather than being flat grey,
              so they read as chosen. The action colour is emerald, used for primary buttons, links,
              active navigation and focus rings. Status colours for success, warning, danger and
              info are separate from the action colour.
            </p>
          </div>
          <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Typeface</th>
                  <th>Used for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Display</strong></td>
                  <td>Archivo</td>
                  <td>Headings, card titles, brand — gives headings their own voice.</td>
                </tr>
                <tr>
                  <td><strong>Body</strong></td>
                  <td>Geist</td>
                  <td>Running text, controls, form fields.</td>
                </tr>
                <tr>
                  <td><strong>Mono</strong></td>
                  <td>Geist Mono</td>
                  <td>Timestamps, counts, handles, tech chips, code.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="doc-callout">
            <strong>Fonts are self-hosted</strong>
            <p>
              All three load through <code>next/font</code>, which serves them from this origin. No
              request reaches a font CDN, so no font host needs allowing through the Content
              Security Policy and nothing breaks if that CDN is unreachable.
            </p>
          </div>
        </section>

        <section className="doc-section" id="accounts">
          <h2>Accounts</h2>
          <div className="doc-body">
            <p>
              Signing up requires a working email address — verification is mandatory before an
              account can do anything meaningful. Members sign in with either their username or
              their email.
            </p>
            <ul>
              <li><strong>Usernames</strong> are 3–30 characters: letters, numbers, dots and underscores.</li>
              <li><strong>Passwords</strong> are 12–128 characters, cannot be a known weak password, and cannot contain the username or the local part of the email.</li>
              <li><strong>Rate limits</strong> apply per route and are stored in the database, so they survive a restart.</li>
              <li><strong>Every authentication event</strong> — sign-up, sign-in, verification, reset — is written to an audit log.</li>
              <li><strong>Password reset</strong> revokes all existing sessions.</li>
              <li><strong>Account deletion</strong> is self-service and confirmed by email.</li>
            </ul>
            <p>
              Profiles carry a display name, status, quote, bio, favourite games, an avatar and a
              banner, plus a public or private visibility setting. Private profiles still appear in
              the member directory, but the profile page itself is readable only by its owner and
              admins.
            </p>
          </div>
        </section>

        <section className="doc-section" id="community">
          <h2>Community</h2>
          <div className="doc-body">
            <p>
              Members write markdown posts from their own profile. Each post is either public or a
              draft; public posts appear on the author&rsquo;s profile and in the community feed at{" "}
              <code>/community</code>, which also holds the member directory and search.
            </p>
            <p>
              <strong>Post rendering is escape-first.</strong> HTML is escaped before any formatting
              is applied, so the only tags that reach the page are the ones the renderer adds. This
              is the ordering that makes a user-generated feed safe, and it is deliberate.
            </p>
            <p>
              Threaded comments, voting and topics are not built yet — the current feed is flat.
              That work needs new columns on the post table rather than new styling.
            </p>
          </div>
        </section>

        <section className="doc-section" id="games">
          <h2>Games</h2>
          <div className="doc-body">
            <p>
              <strong>Here to Slay</strong> is a Java service running separately from the website.
              Launching it mints a short-lived signed ticket that binds one player to one room; the
              Java side isolates state, broadcasts and reconnections per room. Rooms are created
              with expiring invite codes.
            </p>
            <p>
              <strong>DD Project</strong> is a GameMaker HTML5 build served from this origin and
              played inside an authenticated in-site player. Its local save data is namespaced by
              account, so two members sharing a browser do not overwrite each other&rsquo;s progress.
            </p>
            <p>Both require a verified account to launch.</p>
          </div>
        </section>

        <section className="doc-section" id="security">
          <h2>Security</h2>
          <div className="doc-body">
            <ul>
              <li><strong>Every database query is parameterized</strong> — there is no string-built SQL.</li>
              <li><strong>User content is escaped before formatting</strong>, closing the usual feed XSS path.</li>
              <li><strong>Every server action checks the session</strong> before acting, and post edits and deletes verify ownership.</li>
              <li><strong>The media route resolves and bounds paths</strong> before reading, so traversal outside the upload directory fails.</li>
              <li><strong>Security headers</strong> — HSTS, nosniff, frame protection, referrer and permissions policy — are set for every response.</li>
              <li><strong>A Content Security Policy</strong> is active in Report-Only mode while it is validated against real traffic.</li>
              <li><strong>Authenticated pages send <code>no-store</code></strong>, so no cache holds them.</li>
            </ul>
          </div>
          {/*
            Do not enumerate unpatched weaknesses on this page. If
            projectPagesArePublic is ever flipped to true, a list of exactly where
            the site is soft becomes a checklist for whoever finds it. Outstanding
            security work is tracked in ROADMAP.md, in the repository.
          */}
          <div className="doc-callout">
            <strong>Ongoing work</strong>
            <p>
              Hardening is continuous. Outstanding items are tracked in the repository roadmap
              rather than listed here.
            </p>
          </div>
        </section>

        <section className="doc-section" id="deployment">
          <h2>Deployment</h2>
          <div className="doc-body">
            <p>
              Deployment is manual and deliberate. <code>scripts/deploy.sh</code> runs the whole
              sequence on the server — fetch, install, build, restart, health-check — and refuses to
              restart if the build fails, so a broken build never replaces a running site.
            </p>
          </div>
          <pre className="doc-pre">
            <span className="c"># on the Ubuntu server</span>{"\n"}
            cd /srv/miguisanson.dev{"\n"}
            ./scripts/deploy.sh{"\n"}
            {"\n"}
            <span className="c"># then purge the Cloudflare cache so the CDN stops</span>{"\n"}
            <span className="c"># serving the previous build</span>
          </pre>
          <div className="doc-body">
            <p>
              Required environment variables live in <code>.env.local</code> on the server and are
              documented in <code>.env.example</code>. At minimum production needs{" "}
              <code>DATABASE_URL</code>, <code>BETTER_AUTH_SECRET</code>,{" "}
              <code>BETTER_AUTH_URL</code>, <code>GAME_TICKET_SECRET</code> and an email provider —
              sign-up, verification and password reset are refused in production without one.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
