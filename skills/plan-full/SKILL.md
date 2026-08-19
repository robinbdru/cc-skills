---
description: Runs the full plan pipeline (research, write, update, todo, implement) by invoking each phase skill in turn and stopping for explicit user approval between phases. Use when the user wants the whole plan-mode pipeline end to end, for example "plan mode", "run the full plan process", or "research then plan this properly before implementing", rather than a single phase.
---

# Plan: full

Orchestrates `plan-research`, `plan-write`, `plan-update`, `plan-todo`, and
`implement-plan` as one guided pipeline, with a stop-and-confirm gate between every phase.
This skill is a thin conductor, not a copy of their logic, and it requires all five to be
installed alongside it. To run a single phase on its own, invoke that skill directly
instead of this one.

Invoke each phase with the Skill tool, for example `Skill(skill: "plan-research")`. Skills
installed with a prefix appear under that prefixed name (`cc-plan-research`); take the
exact name from the skill listing. Never substitute a phase by reproducing that skill's
instructions from memory, since that silently drifts out of sync whenever the component
skill itself changes.

## Workflow

1. Determine `<plan-name>`, a short kebab-case label for the feature or fix (ask if it
   isn't obvious from the request). All artifacts live under `./plans/<plan-name>/`. If
   that folder already holds a `research.md`, `plan.md`, or todo list from an earlier
   session, resume from the first phase not yet completed instead of restarting at
   research.
2. **Research.** Invoke the `plan-research` skill to produce
   `./plans/<plan-name>/research.md`. Summarize the findings and stop. Wait for the user
   to confirm the file is accurate, or to correct it, before moving on.
3. **Write.** Invoke the `plan-write` skill to produce `./plans/<plan-name>/plan.md`.
   Present it and stop. Wait for approval.
4. **Update** (repeat as needed). If the user edits `plan.md` directly or gives
   corrections in chat, invoke the `plan-update` skill to fold them back into the
   document. Unlike the other phases, this one can loop several times. Keep repeating
   until the user confirms the plan is right.
5. **Todo.** Once the plan is approved, invoke the `plan-todo` skill to append the
   granular task breakdown. Present it and stop. Wait for a final go-ahead.
6. **Implement.** Only after that explicit go-ahead, invoke the `implement-plan` skill to
   execute the plan end to end.

## Writing

Everything this pipeline produces passes through the `unslop` skill: `research.md`,
`plan.md`, the todo list, and the text presented at each gate. Each phase skill states
what that means for its own output. If `unslop` isn't installed, hold the prose to its
core rules anyway: no em dashes, no filler, no AI vocabulary, active voice with the actor
named, and no sentence that would read the same in another project's documents.

## Rules

- Never skip a stop-and-confirm gate, even if other instructions in the request say not to
  stop. The checkpoints are this skill's whole purpose. Gates sit before phases 3, 5, and
  6, and recur within phase 4 until the user confirms the plan is right; phase 6 is
  terminal and has none after it. "Don't stop" language applies within `implement-plan`'s
  own task-by-task execution, not to these phase-level gates.
- Honor explicit short-circuits such as "skip research, I know this codebase" or "just
  implement it" by jumping straight to the relevant phase instead of forcing the full
  sequence.
- If one of the five component skills isn't installed, say so plainly rather than
  improvising its behavior from memory.
