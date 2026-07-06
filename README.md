# Claude Code Skills

A personal library of [Claude Code skills](https://code.claude.com/docs/en/skills), built up over time and reused across projects.

## Structure

- `skills/` — each subdirectory is either a **skill** (a leaf folder with one `SKILL.md`) or a **group** of sibling skills (a folder with no `SKILL.md` of its own, e.g. a hypothetical `foo/` holding `foo/bar/`). No skill here currently uses grouping — every skill is flat (`plan-research`, `improve-jsdoc`, etc.) — but the CLI's discovery logic still supports it.
- `src/` — source for the `cc-skills` CLI (skill discovery, copy, and scaffold logic, plus tests)
- `main.ts` — entry point for the `cc-skills` CLI

## `deno task cli`

Launches an interactive menu so you don't need to remember the subcommand names — pick "Copy skills" or "New skill" and it hands off to the matching subcommand below.

```
$ deno task cli
? What do you want to do?
❯ List skills — List every skill in this library with its name and description.
  Copy skills — Copy skills from this library into a project or global skills directory.
  New skill — Scaffold a new skill under this project's local .claude/skills/ directory.
  Help — Show usage for every command
```

## `deno task cli list`

Prints every skill in this library as a table, with its name and description
(pulled from `SKILL.md` frontmatter) — the description column wraps to fit
your terminal width.

```
$ deno task cli list
┌──────────────────────┬───────────────────────────────────────────────────────────────────────────┐
│ Name                 │ Description                                                               │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ ask-mode             │ Read-only exploration and Q&A mode for understanding an unfamiliar or     │
│                      │ half-known codebase. Use when the user asks to "enter ask mode", to       │
│                      │ understand the codebase, or to explore a repo before touching it — this   │
│                      │ runs full exploration and produces a concise state-of-play first, then    │
│                      │ answers follow-up questions by systematically verifying against the code  │
│                      │ (never from assumption). For a single ad hoc architecture/behavior        │
│                      │ question mid-session, skip straight to the verified Q&A loop instead of   │
│                      │ repeating the full state-of-play.                                         │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ commit               │ Analyze working-tree changes and produce clean, atomic git commits in     │
│                      │ Conventional Commits format. Use when the user asks to commit, "make a    │
│                      │ commit", "commit my changes", "stage and commit", "wrap up my changes",   │
│                      │ "save my progress", or before any push operation.                         │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ implement-plan       │ Implement an approved ./plans/<name>/plan.md end to end, marking off its  │
│                      │ todo list as work completes, without stopping for confirmation mid-flow.  │
│                      │ Use once a plan is fully approved and the user says to implement, build,  │
│                      │ or execute it.                                                            │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ improve-architecture │ Reviews a TypeScript or JavaScript codebase's architecture and proposes   │
│                      │ concrete, prioritized improvements. Use when asked to review, audit,      │
│                      │ refactor, or improve the quality of .ts/.tsx/.js/.jsx code — not for      │
│                      │ plain bug fixes or explanations.                                          │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ improve-jsdoc        │ Add or update JSDoc comments on TypeScript/JavaScript files without       │
│                      │ touching logic. Use when asked to document, add JSDoc, annotate, or       │
│                      │ improve code comments on .ts/.tsx/.js/.jsx files.                         │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ improve-types        │ Audit and fix TypeScript types across a project — find missing/implicit   │
│                      │ `any` types, centralize scattered type definitions, and deduplicate. Use  │
│                      │ when asked to find missing types, centralize types/interfaces, clean up   │
│                      │ implicit `any`, or audit a codebase's type structure.                     │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ new-skill            │ Scaffolds a new Claude Code skill in this repo's skills/ library, with    │
│                      │ minimal frontmatter and a concise body that pushes detail into supporting │
│                      │ files only when needed. Use when asked to create, add, write, or scaffold │
│                      │ a new skill, or to turn a repeated prompt/procedure into a reusable skill │
│                      │ for this collection.                                                      │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ plan-full            │ Runs the full plan pipeline — research, write, update, todo, implement —  │
│                      │ invoking each phase skill in turn and stopping for explicit user approval │
│                      │ between phases. Use when the user wants the whole plan-mode pipeline end  │
│                      │ to end (e.g. "plan mode", "run the full plan process", "research then     │
│                      │ plan this properly before implementing") rather than a single phase.      │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ plan-refine          │ Grounds any design, refactor, implementation, debugging, or review task   │
│                      │ in the actual codebase instead of assumptions. Use for ad-hoc coding work │
│                      │ where you want every step verified against real files, types, and tests   │
│                      │ before and after changes — not memory-based guesses about APIs, file      │
│                      │ names, or conventions.                                                    │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ plan-research        │ Deeply research a codebase area and write findings to                     │
│                      │ ./plans/<name>/research.md before any planning or coding starts. Use as   │
│                      │ the first step of a build — when asked to plan, design, or implement      │
│                      │ something non-trivial and no research.md exists yet for it.               │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ plan-todo            │ Append a granular, phase-by-phase todo list to ./plans/<name>/plan.md so  │
│                      │ implementation has a concrete progress tracker. Use once a plan.md is     │
│                      │ fully approved and before implementation starts.                          │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ plan-update          │ Apply the user's inline notes/annotations in ./plans/<name>/plan.md back  │
│                      │ into the document, then leave it for further review. Use when the user    │
│                      │ says they've added notes, comments, or corrections directly into a plan   │
│                      │ file and asks to address or incorporate them.                             │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ plan-write           │ Write a detailed implementation plan to ./plans/<name>/plan.md based on   │
│                      │ validated research — approach, code snippets, file paths, and trade-offs. │
│                      │ Use once research.md exists (or the change is small enough not to need    │
│                      │ one) and before any code is written for a non-trivial feature or fix.     │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ refine-skill         │ Audit an existing skill's SKILL.md (and its supporting files) for blind   │
│                      │ spots, contradictions, ambiguity, imprecision, or convention violations,  │
│                      │ and report findings. Use when asked to review, audit, refine, critique,   │
│                      │ or "find problems in" a skill, or to check a skill for issues before      │
│                      │ shipping it.                                                              │
└──────────────────────┴───────────────────────────────────────────────────────────────────────────┘
```

## `deno task cli new [name]`

Scaffolds a new skill's `SKILL.md` under the current project's local `.claude/skills/`. The `new-skill` skill (`skills/new-skill/`) documents the authoring conventions this scaffolder follows.

- **Name for the new skill** (skipped if you passed `[name]`) — asked so you can also run this without an argument and get prompted interactively.
- Validates the name and checks whether the target path already contains a `SKILL.md` further up the tree — this enforces the repo's rule that a directory is either a skill or a group of skills, never both.
- **Overwrite its SKILL.md?** — only asked if the skill already exists, so you don't silently clobber existing work.

```
$ deno task cli new my-skill
Created /Users/you/my-project/.claude/skills/my-skill/SKILL.md
```

## `deno task cli copy`

Copies skills from this library's `skills/` into another project's or your global `.claude/skills/` directory.

- **Which skills do you want to copy?** (all vs. choose) then, if choosing, **Select skills to copy** — lets you grab the whole library or just the ones you need.
- **Destination folder** — a plain path to a project root or your home directory; the CLI appends `.claude/skills/` itself, so the same prompt works for project-local and global installs.
- **Prefix to prepend to copied skill names** — useful when the destination already has a skill with the same name, or you want to namespace skills from this library.
- If a destination folder already exists, you're asked whether to overwrite all conflicts or decide one by one, then asked to confirm the full copy plan before anything is written.

```
$ deno task cli copy
? Which skills do you want to copy? › All skills
? Destination folder (a .claude/skills/ folder will be found or created inside it) › ../other-project
? Prefix to prepend to copied skill names (leave empty for none) › 

About to copy:
  new-skill -> ../other-project/.claude/skills/new-skill
  plan-research -> ../other-project/.claude/skills/plan-research
Prefix: (none)
Destination: ../other-project/.claude/skills
? Proceed? › Yes
Copied new-skill -> ../other-project/.claude/skills/new-skill
Copied plan-research -> ../other-project/.claude/skills/plan-research
```
