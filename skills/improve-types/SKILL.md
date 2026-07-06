---
description: Audit and fix TypeScript types across a project — find missing/implicit `any` types, centralize scattered type definitions, and deduplicate. Use when asked to find missing types, centralize types/interfaces, clean up implicit `any`, or audit a codebase's type structure.
---

# Types audit

Inspect the codebase, identify type issues, and fix them without altering any logic.

## Workflow

1. **Discover the project's conventions** before changing anything: where types
   currently live (dedicated folder, co-located, mixed), naming conventions in use
   (`PascalCase`, `I`-prefix, `T`-prefix), whether a central types folder already exists
   (`src/types/`, `types/`, `shared/types/`), and the import style (path aliases,
   `npm:`/`jsr:` specifiers for Deno).
2. **Find missing types**: symbols used but not defined, implicit `any` that should be
   typed, inline object shapes repeated across files (extract to a named type).
3. **Centralize scattered types**: move only types reused across more than one file into
   the established types folder — types local to a single file stay put. Update every
   affected import after moving. If no types folder exists yet, stop and ask the user
   where new shared types should live rather than inventing a location.
4. **Deduplicate**: before creating or moving a type, check whether an equivalent
   already exists; prefer extending/reusing over introducing a parallel type.
5. **Validate**: confirm all imports resolve, run `deno check` / `tsc --noEmit` if
   available (or state explicitly what needs manual verification), and list every file
   touched.

## Rules

- Never modify logic — types and imports only
- Follow existing naming conventions, don't introduce new ones
- No duplicate types — always check before creating
