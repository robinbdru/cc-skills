---
description: Deeply research a codebase area — and how the wider industry solves the problem when the design isn't settled by the code — then write findings to ./plans/<name>/research.md before any planning or coding starts. Use as the first step of a build — when asked to plan, design, or implement something non-trivial and no research.md exists yet for it.
---

# Plan: research

Read the relevant part of the codebase deeply and write findings to
`./plans/<plan-name>/research.md` — `<plan-name>` is a short kebab-case label for the
feature or fix (e.g. `./plans/cursor-pagination/`). Create the folder if it doesn't
exist.

Surface-level reading isn't acceptable here — read the actual implementation, not just
file names or docstrings, and verify claims about how the system behaves rather than
inferring them. The same standard applies to anything the code can't answer: look up how
the problem is solved elsewhere rather than proposing a design from memory. For the same grounding discipline applied to ad-hoc (non-plan-pipeline)
work, see the `plan-refine` skill.

## Workflow

1. Identify the area to study from the request (a folder, a flow, a subsystem).
2. Read it in depth: entry points, data flow, edge cases, existing conventions, and
   anything relevant to the upcoming change.
3. If genuine open questions surface — ambiguous scope, missing business context, a
   design choice the code itself doesn't resolve — ask the user directly. Don't guess
   or silently record an assumption in the file in place of an answer.
4. Check whether the change hinges on a design decision the codebase can't answer on its
   own — an auth or permission scheme, a pagination or sync protocol, a data model, a
   migration or rollout strategy, a caching or retry policy, a public API shape. If it
   does, research how the problem is solved outside this repo before any approach is
   proposed: official engineering documentation, specs and RFCs, engineering write-ups
   from teams running the pattern at scale, and reference open-source implementations.
   Two or three sources covering the trade-off axis are enough — stop once the options
   and their trade-offs are clear, not when the sources run out. Skip this entirely when
   the answer is already in the code (a bug fix, a rename, following an existing
   convention).
5. Record any external findings in their own section of `research.md` — "How others solve
   this" — never blended into the description of what this codebase does, with a link and
   the date consulted for each source. For each practice worth borrowing, state the scale
   it was designed for and whether that fits this project; an approach that's right for a
   system with millions of users is often the wrong call here. Name the trade-off instead
   of importing the practice wholesale.
6. If `./plans/<plan-name>/research.md` already exists, read it first and extend or
   update it with new findings rather than overwriting blindly — unless the user asks
   to start over.
7. Write `./plans/<plan-name>/research.md` covering what the code actually does, its
   specificities, and (if asked to look for bugs) a list of concrete issues found —
   don't stop at the first one.
8. Never substitute a chat summary for the file — `research.md` is the reviewable
   artifact the next phase (`plan-write`) and the user both depend on.

## Example prompt this responds to

> Study the notification system in great detail, understand its intricacies, and write
> a detailed research.md in ./plans/notification-refactor/ with everything there is to
> know about how it works.
