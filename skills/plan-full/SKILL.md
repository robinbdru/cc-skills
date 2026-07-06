---
description: Runs the full plan pipeline — research, write, update, todo, implement — invoking each phase skill in turn and stopping for explicit user approval between phases. Use when the user wants the whole plan-mode pipeline end to end (e.g. "plan mode", "run the full plan process", "research then plan this properly before implementing") rather than a single phase.
---

# Plan: full

Orchestrates `plan-research`, `plan-write`, `plan-update`, `plan-todo`, and
`implement-plan` as one guided pipeline, with a stop-and-confirm gate between every
phase. This skill is a thin conductor, not a copy of their logic — it requires all five
to be installed alongside it. For a single phase on its own, invoke that skill directly
instead of this one.

Each phase below is invoked with the Skill tool (e.g. `Skill(skill: "plan-research")`) —
never substitute a phase by reproducing that skill's instructions from memory, since
that silently drifts out of sync whenever the component skill itself changes.

## Workflow

1. Determine `<plan-name>` — a short kebab-case label for the feature or fix (ask if it
   isn't obvious from the request). All artifacts live under `./plans/<plan-name>/`. If
   that folder already has a `research.md`, `plan.md`, or todo list from an earlier
   session, resume from the first phase not yet completed instead of restarting at
   Research.
2. **Research**: invoke the `plan-research` skill to produce `./plans/<plan-name>/research.md`.
   Summarize the findings and stop — wait for the user to confirm it's accurate (or to
   correct it) before moving on.
3. **Write**: invoke the `plan-write` skill to produce `./plans/<plan-name>/plan.md`.
   Present it and stop — wait for approval.
4. **Update** (repeat as needed): if the user edits `plan.md` directly or gives
   corrections in chat, invoke the `plan-update` skill to fold them back into the
   document. Unlike the other phases, this one can loop multiple times — keep repeating
   until the user confirms the plan is right.
5. **Todo**: once the plan is approved, invoke the `plan-todo` skill to append the
   granular task breakdown. Present it and stop — wait for a final go-ahead.
6. **Implement**: only after that explicit go-ahead, invoke the `implement-plan` skill
   to execute the plan end to end.

## Rules

- Never skip a stop-and-confirm gate, even if other instructions in the request say not
  to stop — the checkpoints are this skill's whole purpose. Gates sit before phases 3, 5,
  and 6, and recur within phase 4 until the user confirms the plan is right; phase 6 is
  terminal and has none after it. "Don't stop" language applies within `implement-plan`'s
  own task-by-task execution, not to these phase-level gates.
- Honor explicit short-circuits — "skip research, I know this codebase" or "just
  implement it" — by jumping straight to the relevant phase instead of forcing the full
  sequence.
- If one of the five component skills isn't installed, say so plainly rather than
  attempting to improvise its behavior from memory.
