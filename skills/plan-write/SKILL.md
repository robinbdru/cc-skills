---
description: Write a detailed implementation plan to ./plans/<name>/plan.md based on validated research — approach, code snippets, file paths, and trade-offs. Use once research.md exists (or the change is small enough not to need one) and before any code is written for a non-trivial feature or fix.
---

# Plan: write

Turn validated research into `./plans/<plan-name>/plan.md`. If `./plans/<plan-name>/research.md`
doesn't exist yet and the change touches more than a couple of files, run `plan-research`
first — a plan built on unverified assumptions produces a wrong implementation.

## The plan must include

- Explanation of the approach and why it was chosen over alternatives
- Code snippets showing the actual changes, based on the real files (read them first,
  don't invent APIs or signatures)
- Every file path that will be touched
- Trade-offs and considerations worth the user's attention

## Workflow

1. Read `research.md` if present. If it's missing and the change touches more than a
   couple of files, run `plan-research` first when that skill is available; otherwise
   read the relevant source directly yourself before drafting.
2. Create `./plans/<plan-name>/` if it doesn't exist yet, then draft `plan.md` with the
   sections above.
3. End every planning response with **"don't implement yet"** unless the user has
   already explicitly approved the plan in this conversation — implementation only
   starts after an explicit go-ahead (see `implement-plan`).

## Example prompt this responds to

> The list endpoint should support cursor-based pagination. Write a detailed plan.md in
> ./plans/cursor-pagination/. Base the plan on the actual codebase — read source files
> first.
