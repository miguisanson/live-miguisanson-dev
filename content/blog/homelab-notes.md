---
title: "What I use a Linux home server for"
date: "2026-05-10"
summary: "A mini PC running Proxmox, an Ubuntu VM, and a Cloudflare Tunnel — what it actually taught me about hosting, networking, and failure."
tags: Linux, Hosting, Homelab, Proxmox, Cloudflare
---

Everything on this site is served from a mini PC sitting in my room. Not a VPS, not
Vercel — an actual machine I can unplug. This post is about why that turned out to be
the most useful thing I have built for learning, and what it cost me to find that out.

## The setup

The physical layer is deliberately unglamorous:

- A mini PC running **Proxmox** as the hypervisor
- An **Ubuntu Server VM** on top of it, running the website
- An **8 TB 3.5" hard drive** in a USB enclosure for bulk storage
- A **Cloudflare Tunnel** connecting it to the public internet

Proxmox matters more than it looks. Running the OS bare-metal would have been simpler,
but a hypervisor means I can snapshot a VM before doing something reckless, and roll
back in seconds when it goes wrong. That safety net is what makes experimenting cheap
enough to actually do.

## Why a tunnel instead of port forwarding

The default answer to "how do I put a home server on the internet" is to forward ports
80 and 443 on the router. I did not do that, for three reasons.

**It exposes your home IP address.** Every visitor learns roughly where you live.
Cloudflare sits in front, so the origin address is never published.

**Residential ISPs fight you.** Many block inbound 80 and 443 outright, and a dynamic
IP means your DNS record is wrong every time the lease renews.

**A forwarded port is an open door you have to defend yourself.** A tunnel makes only
*outbound* connections — the server dials out to Cloudflare and holds the connection
open. There is no inbound port to find, so the entire class of "someone port-scanned
my home network" simply does not apply.

The trade is that you now depend on Cloudflare being up, and that a misconfigured
tunnel fails in ways that look like DNS problems but are not. Which brings me to the
part that actually taught me something.

## What actually broke

The useful lessons did not come from the setup. They came from the failures.

### DNS lies to you

I spent an evening convinced a deployment was broken because the site would not update.
The application was fine. Cloudflare was serving a cached copy of the page with a very
long `s-maxage`, so every change I shipped was invisible while the origin was serving
the new version perfectly.

The lesson: when something looks wrong in the browser, find out **which layer** you are
actually talking to before you start debugging the code. `curl` against the origin
directly, then through the CDN, and compare. Most "it did not deploy" problems are
"it deployed and you are looking at a cache".

### USB storage is not the same as storage

The 8 TB drive is connected over USB, and that is a genuine architectural weakness
rather than a detail. USB-SATA bridge chips reset under sustained load. Many enclosures
implement UAS badly enough that the standard fix is forcing the kernel to fall back to
the older `usb-storage` driver. Some do not pass SMART data through at all, so the disk
can be failing with no warning whatsoever.

I found this out the interesting way, recovering data from an 8 TB WD Red that had
started throwing errors. The recovery worked. The lesson stuck harder than the recovery
did:

> A single drive is capacity, not redundancy. It does not matter how large it is.

### Services fail in ways that look like nothing

The failure mode I was least prepared for is the one where nothing crashes. A service
is running, the port is open, the process is alive — and it is quietly not doing its
job. A queue that stopped draining. A cron that has been failing silently since a path
changed. A disk at 100% that made writes fail but not loudly.

Reading logs became a habit rather than a last resort. `journalctl -u <service> -f` is
the command I type most.

## What it teaches that a managed host cannot

Deploying to a managed platform is a solved problem, and that is exactly why it teaches
you so little. The platform handles TLS, the reverse proxy, process supervision,
restarts, and log aggregation, and you never find out those things existed.

Running it yourself, you have to answer questions the platform normally answers for you:

- **What happens on reboot?** Does the app come back on its own, or did it only ever
  start because you typed the command? (This is what systemd units are actually for.)
- **Where do logs go, and who deletes them?** An unbounded log file will fill a disk,
  and a full disk breaks things that have nothing to do with logging.
- **What is the database doing?** Running Postgres yourself means confronting
  connection limits, backups, and the difference between "the query is slow" and "you
  are opening a new pool on every request".
- **How do you get back?** Not "is there a backup" but "have you restored one". An
  untested backup is a belief, not a backup.

## The deployment discipline it forced

Because nothing is automatic, the deploy sequence has to be deliberate. The rule I
settled on, after breaking the live site once by doing it in the wrong order:

**Build before you restart.** If the build fails, the previous version is still running
and serving traffic. If you restart first and then build, a compile error takes the site
down until you fix it.

That is one line in a shell script, and it is the difference between a bad deploy being
a non-event and a bad deploy being an outage.

## What I would tell someone starting one

Start smaller than this. You do not need Proxmox, a hypervisor, or a tunnel on day one.

1. **Put one thing on it** and get that thing to survive a reboot unattended.
2. **Break it deliberately.** Kill the process, fill the disk, pull the network. Watch
   what happens, then make it recover.
3. **Add a second copy of anything you would be upset to lose** — before you start
   relying on it, not after.
4. **Only then** add the hypervisor, the tunnel, the monitoring, and the rest.

The value is not in having a server. It is in having somewhere the consequences are
real but the blast radius is small.
