---
description: Runs the full plan pipeline (research, write, update, todo, implement) by dispatching each phase skill to a subagent on Sonnet or Opus and stopping for explicit user approval between phases. Use when the user wants the whole plan-mode pipeline end to end, for example "plan mode", "run the full plan process", or "research then plan this properly before implementing", rather than a single phase.
---

# Plan: full

Orchestrates `plan-research`, `plan-write`, `plan-update`, `plan-todo`, and
`implement-plan` as one guided pipeline, with a stop-and-confirm gate between every phase.
This skill is a thin conductor, not a copy of their logic, and it requires all five to be
installed alongside it. To run a single phase on its own, invoke that skill directly
instead of this one.

The session running this skill is the orchestrator. It talks to the user and holds the
gates. Each phase runs in a subagent on the model and effort the orchestrator picks for
it, so the phases that only read, record, or execute don't pay Opus rates.

## Dispatching a phase

Launch each phase with the Agent tool and set `model` and `effort` on every call. Leave
`subagent_type` unset or use `general-purpose`. Never use `fork`, because a fork ignores
the `model` override. The prompt gives the subagent:

- The exact skill name to invoke with the Skill tool. Skills installed with a prefix
  appear under that prefixed name (`cc-plan-research`), so take it from the skill listing.
- `<plan-name>` and its folder, `./plans/<plan-name>/`.
- The user's request, verbatim.
- Every decision or correction from earlier gates that the files don't record yet.
- The report to return: the file written, a summary for the gate, and the open questions,
  or "none".

Never paste a skill's instructions or a file's contents into the prompt. The subagent
loads the skill and reads the files itself. A pasted copy pays for the same tokens twice
and drifts out of sync whenever the component skill changes.

When a subagent returns open questions, put them to the user, then send the answers to
that same subagent with SendMessage. It keeps what it already read, where a fresh dispatch
reads everything again.

The orchestrator does no phase work. It reads an artifact only as far as its gate needs
and never reads source files on a phase's behalf. If the Agent tool isn't available, for
example because this skill itself runs inside a subagent, invoke each phase inline with
the Skill tool and tell the user that every phase ran on the current model.

## Model and effort

Choose `sonnet` or `opus` only. Pass the alias, not a versioned model ID: each alias
resolves to the latest version. Set `effort` to `high` or `xhigh` only.

| Skill            | Model    | Effort  |
| ---------------- | -------- | ------- |
| `plan-research`  | `sonnet` | `high`  |
| `plan-write`     | `opus`   | `xhigh` |
| `plan-update`    | `sonnet` | `high`  |
| `plan-todo`      | `sonnet` | `high`  |
| `implement-plan` | `sonnet` | `high`  |

These are defaults, and the choice belongs to the orchestrator. Spend Opus where a phase
has to choose between designs. Give Sonnet the phases that read, record, or carry out
decisions already made. Typical deviations:

- Research on `opus` when it has to settle a design decision the code can't answer, such
  as an auth scheme or a sync protocol.
- An update round on `opus` when a note redirects the approach rather than fixing a
  detail.
- Write on `sonnet` when the change touches a couple of files and follows an existing
  convention.
- Implement on `opus` when the plan leaves subtle code to write, such as concurrency,
  auth, or a data migration.
- A rerun on `opus` when the user rejects a Sonnet phase's output at its gate for a
  reasoning error. A missing fact calls for a rerun with that fact, not a bigger model.

Use `xhigh` for a phase that weighs competing designs and `high` for the rest. State the
model and effort in one line before each dispatch, so the user can override them.

## Workflow

1. Determine `<plan-name>`, a short kebab-case label for the feature or fix (ask if it
   isn't obvious from the request). All artifacts live under `./plans/<plan-name>/`. If
   that folder already holds a `research.md`, `plan.md`, or todo list from an earlier
   session, resume from the first phase not yet completed instead of restarting at
   research.
2. **Research.** Dispatch `plan-research` to produce `./plans/<plan-name>/research.md`.
   Relay the subagent's summary and stop. Wait for the user to confirm the file is
   accurate, or to correct it, before moving on.
3. **Write.** Dispatch `plan-write` to produce `./plans/<plan-name>/plan.md`. Relay its
   summary with the path and stop. Wait for approval.
4. **Update** (repeat as needed). If the user edits `plan.md` directly or gives
   corrections in chat, dispatch `plan-update` to fold them back into the document.
   Unlike the other phases, this one can loop several times. Keep repeating until the
   user confirms the plan is right.
5. **Todo.** Once the plan is approved, dispatch `plan-todo` to append the granular task
   breakdown. Relay its summary and stop. Wait for a final go-ahead.
6. **Implement.** Only after that explicit go-ahead, dispatch `implement-plan` to execute
   the plan end to end.

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
