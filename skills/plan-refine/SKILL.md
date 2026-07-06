---
description: Grounds any design, refactor, implementation, debugging, or review task in the actual codebase instead of assumptions. Use for ad-hoc coding work where you want every step verified against real files, types, and tests before and after changes — not memory-based guesses about APIs, file names, or conventions.
---

# Plan: refine

Keep every step of a task grounded in what the repository actually contains, not in
assumptions. For a full research → plan → update → implement pipeline with persisted
artifacts and phase-by-phase approval, use the `plan-full` skill instead (or its
component phases — `plan-research`, `plan-write`, `plan-update`, `plan-todo`,
`implement-plan` — individually) — this skill is the lightweight, always-applicable
version of the same discipline.

## Workflow

1. **Establish real context** before proposing anything: read `package.json`,
   TypeScript/build/test config, lint config, and the modules/types/utilities directly
   related to the change. For TypeScript, explicitly check module system, path aliases,
   strictness settings, existing types, error-handling and async conventions.
2. **Validate every step against the codebase**: the target file/module exists, the
   symbols named exist, the integration point is real, the change is compatible with
   existing types and tests, and there isn't already an implementation to extend instead
   of duplicating. Mark anything unverifiable and go inspect more code rather than
   guessing.
3. **Confirm concrete details before editing**: exact names, parameter/return types,
   exported vs. internal APIs, state management and side-effect patterns, env vars,
   feature flags, API contracts, persistence shape. Don't say "we can just add X" until
   you've confirmed where X fits today.
4. **Implement conservatively**: smallest change that fits current architecture, reuse
   existing helpers, preserve local style, avoid speculative refactors, keep types as
   strict as the project already expects.
5. **Verify after changes**: review impacted call sites, check types and imports/exports,
   update tests where appropriate, run the narrowest relevant validation first
   (typecheck → targeted tests → lint → broader checks). State plainly what couldn't be
   run.

## When presenting a plan or summary

Distinguish verified facts from assumptions, name the files/symbols checked, justify why
the chosen integration point is correct, and call out risks and unknowns. Revise earlier
conclusions the moment code evidence contradicts them.

## Anti-patterns

Don't: plan from memory alone, assume a framework pattern without checking the repo,
invent files or symbols, duplicate logic that already exists, introduce new abstractions
before checking current conventions, or claim a change is safe without checking call
sites. TypeScript types are not proof of runtime behavior.
