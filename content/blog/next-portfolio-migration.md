---
title: "Moving miguisanson.dev toward a Next.js tech hub"
date: "2026-05-15"
summary: "Notes on migrating from a compact Hugo resume site into a portfolio app that can grow into projects, demos, and writing."
tags: Next.js, Portfolio, Migration
---

## Why migrate

The Hugo site worked well as a lightweight resume page, but the next version needs more room for project case studies, interactive demos, and future AI experiments.

## Current approach

- Keep the site static-first and fast.
- Use typed data files for repeatable cards.
- Use Markdown for posts and project writeups.
- Keep prototypes as static bundles until they need real APIs.

## Future upgrade path

Authentication, Prisma, PostgreSQL, Supabase, Neon, and LLM routes should only be introduced when the site needs persisted user data or live AI features.
