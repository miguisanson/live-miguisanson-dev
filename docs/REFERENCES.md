# References — what we borrow, from where, and what may be copied

"A good product copies the best parts of others." This file is how that is
done honestly: every idea has a source, and every source has a licence verdict.

**The copy rule.** *Ideas, layouts and behaviour may always be borrowed.* Code
may be copied **only** from a row marked **yes** (permissive: MIT, ISC, BSD,
Apache-2.0 — keep the licence notice) — and only when writing it ourselves would
be worse. **Copyleft (GPL/AGPL) and no-licence repositories are read-only:**
learn the shape, close the tab, write our own. This repository is public, so a
mistake here is visible. When an agent adopts something, it adds the source to
the code comment (`// after lobsters' mod log — REFERENCES §3`) and, if code was
copied, to §8.

**How this was gathered (2026-09-19/20).** Seven research passes by Sonnet
subagents using web search and page fetches; GitHub facts (stars, licence, last
push) came from `api.github.com` on 2026-09-20 for §2–§6 rows marked *API*;
other rows were read on the repository page. Sites in §1 were loaded live unless
marked *not loaded*. **Reddit could not be read**: both the fetcher and the
browser pane refuse reddit.com, so Reddit patterns here are from general
knowledge and are marked so. Hacker News, the Cloudflare and GameMaker forums,
itch.io and Blind were used in its place (§7). Anything marked UNVERIFIED must
be checked before it is relied on.

---

## 1. Websites — patterns to copy

### Developer personal sites (all loaded live)

| Site | What it does | Copy this |
|---|---|---|
| rauno.me | Terse manifesto as the hero; Craft / Projects / Notes; copy-email button | A one-line stance instead of a bio paragraph; copy-to-clipboard email with a tick |
| emilkowal.ski | Single column, no navbar, work and writing as plain linked lists | Lists can look more intentional than cards |
| paco.me | Building / Projects / Writing / Now / Connect | A real `/now` page: three short paragraphs, dated |
| leerob.com | Bio, topic notes, chronological feed, one hand-made illustration | One custom decorative element, nothing else |
| brianlovin.com | Many small pages: stack, TIL, listening, AMA | A TIL page as a low-effort, high-volume content type |
| delba.dev | Anchor nav, short bulleted work list | Keep the public nav to four items |
| joshwcomeau.com | Category browsing, "Popular" list, theme toggle | A "most read" list to resurface old posts |
| maggieappleton.com | Digital garden tiers (essay / note / smidgeon), `/now`, `/colophon` | Tier writing by polish so small notes are allowed to exist |
| antfu.me | Icon links, `/projects`, `/talks`, `/uses`, licence in footer | A content licence line in the footer |
| cassidoo.co | `[home] [blog]` bracket text nav | A cheap typographic motif carried everywhere |
| jvns.ca | TIL, Favorites, zines as identity | A "Favorites" page curating your own best work |
| simonwillison.net | Entries, links, quotes, notes; tag counts | Tag links with counts make an archive scannable |
| overreacted.io | A bare reverse-chronological list | Restraint: content can carry a page |
| lynnandtonic.com | Public site version ("v. XIX") | A version number in the footer linking to `/changelog` |
| bruno-simon.com | 3D game as portfolio; "Whispers" message wall | A tiny guestbook wall (short messages) as the friendliest community surface |
| jhey.dev | Live "now playing" and weather widgets | One live heartbeat widget — ours is **server status / uptime** |
| nan.fyi, samwho.dev | Thumbnail per post; animated SVG previews | A generated thumbnail per post raises perceived quality |
| ciechanow.ski | Inline sliders driving live diagrams | The ceiling for explanatory posts; one interactive diagram in the homelab case study |
| kilianvalkhof.com, pawelgrzybek.com, bryanbraun.com, susam.net | Category counts, blogroll, read time, dated `YYYY.MM.DD`, RSS + JSON feeds | Blogroll page; read time; mono dates |
| deadsimplesites.com | "Less, but better"; rejects scroll-jacking | Its rule list is our motion policy |

Hacker News favourites named in "share your personal site" threads, worth a
look when designing: dustinbrett.com, simonsarris.com, danilafe.com,
marginalia.nu, steve.fi (§7).

### Product and community patterns

| Source | Loaded? | Copy this |
|---|---|---|
| lobste.rs | yes | **Public moderation log** linked from the footer; tag pills; flat-ish comments |
| tildes.net | yes | Typed posts (Ask / Show / Discussion) instead of free tags; theme picker; no growth features |
| news.ycombinator.com | yes | Uniform row density — nobody's post looks bigger than another's |
| dev.to | yes | A small fixed reaction set, read time, role badge beside the author |
| reddit.com | **not loaded** (general knowledge) | Post card anatomy, collapse toggles on comment trees, sort pills — deferred to community stage 2/3 |
| github.com profiles | yes | **Pinned items grid**, achievement badges, contribution rhythm |
| chess.com member pages | yes | Tabbed profile: Overview / Games / Stats |
| steamcommunity.com | partly (private) | Showcases and a recent-games shelf on the profile |
| itch.io | yes | Game page: cover, GIF strip, **sidebar metadata block**, **devlog timeline** |
| lichess.org | yes | Lobby-first home for players; a small daily widget to bring people back |
| poki.com, crazygames.com | yes | Controls hint beside the frame; fullscreen affordance; fixed-aspect container |
| read.cv, bento.me, newgrounds.com, land-book.com | not loaded | — |

## 2. Repositories — personal sites

| Repo | Licence | Copy code? | Open this |
|---|---|---|---|
| [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) (API) | MIT | yes (not its Tailwind) | `app/blog/[...slug]/page.tsx`, RSS and sitemap scripts |
| [antfu/antfu.me](https://github.com/antfu/antfu.me) (API) | MIT | yes | Content structure, `/uses`, `/projects` data files |
| [theodorusclarence/theodorusclarence.com](https://github.com/theodorusclarence/theodorusclarence.com) | GPL-3.0 | **no — read only** | Guestbook and likes model |
| [leerob/next-mdx-blog](https://github.com/leerob/next-mdx-blog) | none | **no** | `app/og/route.tsx`, feed route |
| [chronark/chronark.com](https://github.com/chronark/chronark.com) (API) | none | **no** | Typography and project write-up layout |
| [suyalcinkaya/onur.dev](https://github.com/suyalcinkaya/onur.dev) (API) | unclear | **no** | Widgets, bookmarks, résumé section |
| [nexxeln/nexxel.dev](https://github.com/nexxeln/nexxel.dev) (API), [shuding/shud.in](https://github.com/shuding/shud.in), [pacocoursey/paco](https://github.com/pacocoursey/paco) (archived) | none / UNVERIFIED | **no** | Layout restraint |

## 3. Repositories — community, comments, moderation

| Repo | Licence | Copy code? | Learn |
|---|---|---|---|
| [lobsters/lobsters](https://github.com/lobsters/lobsters) | BSD-3-Clause | yes (Ruby — port ideas) | Smallest real forum to read end to end: `db/schema.rb`, moderation log, invitation tree |
| [umputun/remark42](https://github.com/umputun/remark42) (API) | MIT | yes | Comment API shape, anti-spam scoring, admin UI |
| [posativ/isso](https://github.com/posativ/isso) (API) | MIT | yes | Moderation queue, hashed-IP spam checks |
| [djyde/cusdis](https://github.com/djyde/cusdis) (API) | MIT | yes | A small approval dashboard |
| [giscus/giscus](https://github.com/giscus/giscus) (API) | MIT | yes | Widget/theme sync (we keep comments first-party; ideas only) |
| [ArtalkJS/Artalk](https://github.com/ArtalkJS/Artalk) (API) | MIT | yes | Notification and admin panel patterns |
| [flarum/flarum](https://github.com/flarum/flarum) (API) | MIT | yes | Permission and notification architecture |
| [apache/answer](https://github.com/apache/answer) (API) | Apache-2.0 | yes | Reputation and ranking service (stage 3) |
| [LemmyNet/lemmy](https://github.com/LemmyNet/lemmy) | AGPL-3.0 | **no — read only** | `crates/db_schema`: community vs site moderators, ban scopes, mod log |
| [discuitnet/discuit](https://github.com/discuitnet/discuit) | AGPL-3.0 | **no — read only** | Closest small Reddit-alternative schema |
| [discourse/discourse](https://github.com/discourse/discourse) | GPL-2.0 | **no — read only** | Flagging and trust levels for new accounts |
| [misago/misago](https://github.com/misago/misago), [MbinOrg/mbin](https://github.com/MbinOrg/mbin), [getfider/fider](https://github.com/getfider/fider), [walinejs/waline](https://github.com/walinejs/waline), [NodeBB/NodeBB](https://github.com/NodeBB/NodeBB) | GPL / AGPL | **no — read only** | Permissions, report queues, reactions |
| [logchimp/logchimp](https://github.com/logchimp/logchimp) (API) | unclear | **no** | Postgres schema for posts, votes, comments |

No maintained small *Next.js* forum worth copying was found — tutorial clones
only. We build our own on the schema lessons above.

## 4. Repositories — auth, abuse, uploads

| Repo | Licence | Copy code? | Learn |
|---|---|---|---|
| [better-auth/better-auth](https://github.com/better-auth/better-auth) | MIT | yes | `/demo` app: two-factor, passkeys, admin plugin wiring; **test-utils plugin** |
| [salmanshahriar/Next-Elite](https://github.com/salmanshahriar/Next-Elite) (API) | MIT | yes | Next 16 + Better Auth + RBAC + Vitest + Playwright in one repo — closest stack match |
| [ezeparziale/nextjs-better-auth-template](https://github.com/ezeparziale/nextjs-better-auth-template), [daveyplate/better-auth-nextjs-starter](https://github.com/daveyplate/better-auth-nextjs-starter) | UNVERIFIED | **no until checked** | RBAC, admin, 2FA, passkeys together |
| [animir/node-rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible) (API) | ISC | yes | Postgres-backed limiter |
| [arcjet/arcjet-js](https://github.com/arcjet/arcjet-js) (API) | Apache-2.0 | yes | Bot detection shape (hosted service — ideas only, VISION §8) |
| [lovell/sharp](https://github.com/lovell/sharp) (API) | Apache-2.0 | dependency | Re-encode pipeline; strips metadata by default |
| [sindresorhus/file-type](https://github.com/sindresorhus/file-type) (API) | MIT | dependency | Magic-byte sniffing before trusting an upload |
| [jo3-l/obscenity](https://github.com/jo3-l/obscenity) (API) | MIT | dependency, if needed | Evasion-aware word matching |
| [davodm/nextjs-turnstile](https://github.com/davodm/nextjs-turnstile) (API) | MIT | yes | Minimal server verify for Turnstile |

## 5. Repositories — games

| Repo | Licence | Copy code? | Learn |
|---|---|---|---|
| [colyseus/colyseus](https://github.com/colyseus/colyseus) (API) | MIT | yes | Room matchmaking and reconnection (`packages/core/src/MatchMaker.ts`) |
| [boardgameio/boardgame.io](https://github.com/boardgameio/boardgame.io) | MIT | yes | Turn-based state sync and lobby API |
| [heroiclabs/nakama](https://github.com/heroiclabs/nakama) (API) | Apache-2.0 | yes | Leaderboard and match-history design at scale (read, don't adopt) |
| [lichess-org/lila](https://github.com/lichess-org/lila) | AGPL-3.0 | **no — read only** | Profiles, game history, lobby UX |
| [fbeaufume/keybout](https://github.com/fbeaufume/keybout) (API) | GPL-3.0 | **no — read only** | Spring Boot WebSocket game lifecycle |
| [tomrick99/Uno-web-game](https://github.com/tomrick99/Uno-web-game) (API) | none | **no** | Closest analogue to our Spring lobby |
| [YoYoGames/GameMaker-HTML5](https://github.com/YoYoGames/GameMaker-HTML5) (API) | unclear | **no** | The actual HTML5 runtime — how init and canvas hooks work |

**Here to Slay** is a commercial card game by Unstable Games / TeeTurtle; its
name and card art are theirs. Our tabletop stays a private-room tool for
friends, `noindex`, never listed as a public product, and its art never appears
in marketing images. A case study may describe the engineering. (Owner queue:
decide whether to contact the publisher or re-skin with original art.)

## 6. Repositories — hosting, testing, CSS

| Repo | Licence | Copy code? | Learn |
|---|---|---|---|
| [leerob/next-self-host](https://github.com/leerob/next-self-host) (API) | none | **no** | Self-host layout for Next + Postgres; deploy script shape |
| [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma) (API) | MIT | run it | Status monitoring on the homelab |
| [umami-software/umami](https://github.com/umami-software/umami) (API) | MIT | run it | Later, if Cloudflare Web Analytics is not enough |
| GlitchTip (gitlab.com/glitchtip) | MIT (UNVERIFIED) | run it | Sentry-compatible error tracking in ~512 MB |
| [basecamp/kamal](https://github.com/basecamp/kamal), [coollabsio/coolify](https://github.com/coollabsio/coolify), [Dokploy/dokploy](https://github.com/Dokploy/dokploy) | MIT / Apache / none | — | Alternatives we chose **not** to adopt (PROPOSALS §3) |
| [ixartz/Next-js-Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) (API) | MIT | yes | `playwright.config.ts`, Vitest setup, CI workflow |
| [evilmartians/lefthook](https://github.com/evilmartians/lefthook) (API) | MIT | dependency | Hooks that work on Windows |
| [webpro-nl/knip](https://github.com/webpro-nl/knip) (API) | ISC | dependency | Dead code and unused dependencies |
| [stylelint/stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) (API) | MIT | dependency | Base ruleset for our CSS rules |
| [argyleink/open-props](https://github.com/argyleink/open-props) | MIT (UNVERIFIED file) | yes after check | Token naming and scales |
| [sindresorhus/modern-normalize](https://github.com/sindresorhus/modern-normalize) (API) | MIT | yes | The reset layer |
| [picocss/pico](https://github.com/picocss/pico) (API) | MIT | yes | Classless base element styling |
| utopia.fyi / [trys/utopia-core](https://github.com/trys/utopia-core) | none | **no** (the clamp maths is public knowledge) | Fluid type and space scales |
| [radix-ui/primitives](https://github.com/radix-ui/primitives) | MIT | dependency, per component | The fallback when `<dialog>`/Popover cannot pass a test (PROPOSALS D-4) |
| [adobe/react-spectrum](https://github.com/adobe/react-spectrum) (React Aria), [mui/base-ui](https://github.com/mui/base-ui), [chakra-ui/ark](https://github.com/chakra-ui/ark) | Apache-2.0 / MIT | — | Considered; Radix preferred for data-attribute styling with hand CSS |

## 7. Articles, docs and threads

**Official docs (authoritative — read before building the matching row):**
Next.js [self-hosting](https://nextjs.org/docs/app/guides/self-hosting),
[CSP](https://nextjs.org/docs/app/guides/content-security-policy),
[Vitest](https://nextjs.org/docs/app/guides/testing/vitest),
[view transitions](https://nextjs.org/docs/app/guides/view-transitions),
[v16 upgrade](https://nextjs.org/docs/app/guides/upgrading/version-16) (no `next lint`; Turbopack builds by default; `proxy.ts`),
[typed routes](https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes) ·
Better Auth [test utils](https://better-auth.com/docs/plugins/test-utils) ·
Playwright [auth](https://playwright.dev/docs/auth) ·
Cloudflare [Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/),
[service tokens](https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/),
[rate limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/) ·
GitHub [Actions hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) (why no self-hosted runner on a public repo) ·
Google [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page), schema.org [VideoGame](https://schema.org/VideoGame) ·
[sharp on Linux memory](https://sharp.pixelplumbing.com/install#linux-memory-allocator) ·
[Core Web Vitals thresholds](https://www.corewebvitals.io/core-web-vitals).

**Practitioner threads that shaped a decision:**

| Thread | Takeaway | Used in |
|---|---|---|
| [Ask HN: What makes a great personal website?](https://news.ycombinator.com/item?id=23694414) | Fast, intentional, little JavaScript beats flashy | VISION §1.2, L-2 |
| [Ask HN: Share your personal website (2026)](https://news.ycombinator.com/item?id=46618714) | RSS, webrings and visible tinkering read as "real" | P-4, W-4 |
| [Ask HN: Well-designed developer personal sites](https://news.ycombinator.com/item?id=29816607) | Examples list | P-1 |
| [Blind: do recruiters look at your site?](https://www.teamblind.com/post/do-faang-recruiters-look-at-your-github-personal-website-eqtvthlb) | Recruiters skim; managers dig only if the CV points at a project | P-2, P-3 |
| [Immich discussion: the 100 MB tunnel cap](https://github.com/immich-app/immich/discussions/13175) | Cloudflare caps request bodies at 100 MB; LAN traffic should bypass the tunnel | O-6, W-3 |
| [Cloudflare community: error 1033](https://community.cloudflare.com/t/error-1033-cloudflare-tunnel-down-for-all-hostnames-cannot-access-tunnel-manage/888966) | `cloudflared` died silently; needs a supervised service | G-2, O-2 |
| [Ask HN: why Discord instead of a forum?](https://news.ycombinator.com/item?id=36390647) | Chat is unsearchable and unarchived — keep community on-site | VISION §5 |
| [OpenStreetMap: rate-limit signups](https://lists.openstreetmap.org/pipermail/rails-dev/2023-August/027281.html) | Limit signups by IP and email before the spam wave, not after | C-2, O-5 |
| [GameMaker forum: HTML5 export performance](https://forum.gamemaker.io/index.php?threads/performances-and-issues-with-html5-export.63472/) | Off-screen collision checks and software rendering cripple browsers | H-6 |
| Leaderboard cheating write-ups (console `submitScore()`) | Never accept a client-reported score | VISION §6, H-7 |
| [Using AGENTS.md to counter agent drift](https://amattn.com/p/using_agentsmd_or_claudemd_to_counteract_agent_drift.html) | "Pattern pollution" and duplicate-function drift are the failure modes of agent-built code | AGENTS Rule 3, review prompt |
| Portfolio guides: [Codecademy](https://www.codecademy.com/resources/blog/what-to-include-in-a-junior-developer-portfolio), [webportfolios.dev](https://www.webportfolios.dev/blog/junior-developer-portfolio-guide-2025) | 3–5 real projects with problem → outcome write-ups; contact easy to find | P-2 |
| [Lobsters: about](https://lobste.rs/about), [Unusual VC: cold start](https://www.unusual.vc/field-guide/solving-the-cold-start-problem/) | Small on purpose; an empty room repels | VISION §1.4, §5 |

**Still to gather (owner or a later session):** Reddit threads from r/webdev,
r/cscareerquestions, r/selfhosted, r/homelab, r/nextjs. They cannot be fetched
from an agent session. If Migui pastes links or text into
`docs/reference-notes/`, a session can fold them in here.

## 8. Code actually copied

| What | From | Licence | Where it lives |
|---|---|---|---|
| Autopilot runner and its decision library | Migui's own `rpg-gm` repository | owner's code | `scripts/autopilot*.mjs` |

Nothing else yet. Add a row in the same commit as any copied code.
