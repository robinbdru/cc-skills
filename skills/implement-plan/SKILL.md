---
description: Implement an approved ./plans/<name>/plan.md end to end, marking off its todo list as work completes, without stopping for confirmation mid-flow. Use once a plan is fully approved and the user says to implement, build, or execute it.
---

# Implement plan

Execute an approved `./plans/<plan-name>/plan.md` in full. By this point every decision
has been made — implementation should be boring, not exploratory. For the grounding
discipline this phase still relies on (verify names/types/call sites against the real
code, don't invent APIs), see `plan-refine`.

## Workflow

1. Work through the plan's phases and tasks in order. Don't cherry-pick — implement
   everything in scope unless the user has explicitly trimmed it.
2. Mark each task/phase complete in `plan.md`'s todo list as it's finished, if one
   exists — the plan file is the source of truth for progress, not a separate summary.
   If `plan.md` has no todo list, work through its phases/tasks directly without adding
   one unprompted.
3. Don't stop for confirmation between tasks or phases; keep going until everything in
   the plan is done.
4. Run the narrowest relevant validation continuously as you go (typecheck first, then
   targeted tests) — catch type errors and regressions immediately, not at the end.
5. No speculative additions: don't add comments, JSDoc, or types beyond what the plan
   and the project's existing conventions call for.

## Feedback during implementation

Corrections from the user during this phase are usually terse ("you didn't implement
`X`", "this belongs in the admin app, move it", "still cropped") — apply them directly
rather than asking for elaboration. For layout/visual corrections, check existing
reference implementations before guessing ("should look exactly like the users table").

When something goes wrong badly enough that patching won't fix it, don't keep patching —
revert and ask the user to re-scope from a clean state.

## Staying in control

The user can redirect scope or technical choices at any point via `plan.md` itself:
cherry-picking between proposed options, trimming a feature out, freezing a function
signature so only its callers adapt, or mandating a specific library method over a
custom one. Treat the plan document as authoritative over any earlier general guidance.
