---
description: Read-only exploration and Q&A mode for understanding an unfamiliar or half-known codebase. Use when the user asks to "enter ask mode", to understand the codebase, or to explore a repo before touching it — this runs full exploration and produces a concise state-of-play first, then answers follow-up questions by systematically verifying against the code (never from assumption). For a single ad hoc architecture/behavior question mid-session, skip straight to the verified Q&A loop instead of repeating the full state-of-play.
disallowed-tools: Write, Edit, NotebookEdit
---

# Ask Mode

Read-only working mode: no file modifications. Goal: understand a codebase and answer questions reliably, with everything verified.

## Absolute rule

Never assert a fact about the code without having verified it in the actual files (read, grep, read-only commands) during the current session. If something can't be verified, say so explicitly rather than guessing.

## Step 1 — Initial exploration

Run this full exploration when entering ask mode fresh or starting on an unfamiliar codebase. If the user asks a single one-off question mid-session, skip to Step 3 and verify only what's needed to answer it.

Before answering anything, explore seriously, even if it takes time:

1. **Existing docs**: check README, CLAUDE.md, docs/ first for orientation — but verify claims against the code, since docs can be stale.
2. **General structure**: directory tree, languages/frameworks, package manager, monorepo or not.
3. **Entry points**: main, server, CLI, API routes.
4. **Key dependencies**: manifest files (package.json, pyproject.toml, go.mod, etc.), notable versions.
5. **Architecture**: module/layer breakdown, recurring patterns (MVC, hexagonal, monolith, microservices...), main data flow.
6. **Config & build**: build/test/deploy scripts, env vars, CI.
7. **Tests**: presence, framework, apparent coverage.
8. **Risk areas / visible tech debt**: TODO/FIXME, obvious duplication, inconsistencies.
9. **Database** (if present): DBMS type, schema (tables/collections, key relations), migrations, ORM/query builder used. Verify via migration files, schema files (e.g. `schema.sql`, `schema.prisma`, `models/`) or connection config — never infer the structure without reading it.

Use real reading tools (list dir, grep, read file) — never rely on filenames alone or on assumptions carried over from similar projects seen before. On a very large codebase, sample representative modules breadth-first rather than reading everything, or ask the user to scope the area of interest first.

## Step 2 — State of play (expected output)

Once exploration is done, produce a **concise** summary (not an exhaustive report), always structured the same way:

- **In one sentence**: what the project does.
- **Monorepo / multi-project**: if the repo contains several independent subprojects, enumerate each one separately (one-sentence description, stack, architecture) instead of forcing one unified summary.
- **Stack**: languages, frameworks, main tools.
- **Architecture**: 3-6 bullets max on the overall organization.
- **Key modules/files to know**: short list with path + one-line role.
- **Database** (if present): DBMS used, list of main tables/collections with their role, key relations, whether migrations exist.
- **Points of attention**: inconsistencies, debt, unclear areas spotted.
- **Topics to dig into**: propose 3-5 themes worth exploring further (e.g. "error handling", "auth flow", "testing strategy").

Stay concise: short bullets over paragraphs. Don't detail everything — give enough to steer the conversation that follows.

## Step 3 — Q&A loop

For each question asked next:

1. Identify what needs verifying to answer correctly.
2. Re-read/grep the relevant code (even if something seems already known from step 1 — verify the exact detail being asked).
3. Answer citing the specific files/paths (and lines when relevant) the answer relies on.
4. If the question goes beyond what's verifiable in the code (business intent, history, undocumented architecture decisions), say so clearly and distinguish "what the code says" from "hypothesis".

## What this mode doesn't do

- Never modifies, creates, or deletes any file.
- Doesn't propose refactors or fixes unless explicitly asked — if so, step out of ask mode for that request, then return.
- Doesn't answer from memory about frameworks/libraries when this codebase's actual usage could differ (see Absolute rule).
