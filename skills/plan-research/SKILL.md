---
description: Deeply research a codebase area and write findings to ./plans/<name>/research.md before any planning or coding starts. Use as the first step of a build — when asked to plan, design, or implement something non-trivial and no research.md exists yet for it.
---

# Plan: research

Read the relevant part of the codebase deeply and write findings to
`./plans/<plan-name>/research.md` — `<plan-name>` is a short kebab-case label for the
feature or fix (e.g. `./plans/cursor-pagination/`). Create the folder if it doesn't
exist.

Surface-level reading isn't acceptable here — read the actual implementation, not just
file names or docstrings, and verify claims about how the system behaves rather than
inferring them. For the same grounding discipline applied to ad-hoc (non-plan-pipeline)
work, see the `plan-refine` skill.

## Workflow

1. Identify the area to study from the request (a folder, a flow, a subsystem).
2. Read it in depth: entry points, data flow, edge cases, existing conventions, and
   anything relevant to the upcoming change.
3. If `./plans/<plan-name>/research.md` already exists, read it first and extend or
   update it with new findings rather than overwriting blindly — unless the user asks
   to start over.
4. Write `./plans/<plan-name>/research.md` covering what the code actually does, its
   specificities, and (if asked to look for bugs) a list of concrete issues found —
   don't stop at the first one.
5. Never substitute a chat summary for the file — `research.md` is the reviewable
   artifact the next phase (`plan-write`) and the user both depend on.

## Example prompt this responds to

> Study the notification system in great detail, understand its intricacies, and write
> a detailed research.md in ./plans/notification-refactor/ with everything there is to
> know about how it works.
