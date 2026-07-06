---
description: Append a granular, phase-by-phase todo list to ./plans/<name>/plan.md so implementation has a concrete progress tracker. Use once a plan.md is fully approved and before implementation starts.
---

# Plan: todo

Break the approved `plan.md` into a granular, checkable task list appended to the same
file — this becomes the progress tracker `implement-plan` marks off as it works.

## Workflow

1. Read the finished `./plans/<plan-name>/plan.md`.
2. Break it into phases matching the plan's own structure. If the plan doesn't already
   delineate phases, group the tasks into logical phases yourself. Within each phase, list
   individual concrete tasks (small enough that "done" is unambiguous).
3. Append the list to `plan.md` under a `## Todo` heading, as markdown checkboxes.
4. Don't implement — this phase only produces the checklist.

## Example prompt this responds to

> Add a detailed todo list to the plan, with all phases and individual tasks needed to
> complete it. Don't implement yet.
