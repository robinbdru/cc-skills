---
description: Resolves every open decision with the user before any work starts — each unknown presented as options with argued pros and cons and a justified recommendation, then nothing is built until all of them are answered. Use before starting any non-trivial task (a feature, refactor, design, integration, migration, or ambiguous fix) whenever scope, requirements, technical approach, or trade-offs are not fully pinned down by the request. Do NOT trigger for fully-specified or trivial requests (a one-line fix, a rename, a question about existing code, an explicit step-by-step instruction).
---

# Clarify first

Every decision the request leaves open is the user's to make, not one to quietly resolve
with a default. Surface each one, argue it, and wait.

## When to skip

Skip entirely — don't ask, just do the work — when the request is trivial, mechanical, or
already fully specified, or when the user has said to stop asking and decide. A trivial
task interrogated is worse than a trivial task done wrong.

## Workflow

1. **Exhaust the codebase first.** Read the files, types, config, tests, and conventions
   that bear on the task. Anything the repository already answers is not a question — it's
   research not yet done. Asking about it wastes the user's turn and reads as laziness.
2. **List what remains open.** Sweep the [decision checklist](#decision-checklist) and keep
   only unknowns that would actually change the work. If a wrong guess would produce the
   same output either way, it isn't a decision.
3. **Argue each one** in the [format below](#argumentation-format) — real alternatives,
   concrete consequences, and a recommendation with its reasoning.
4. **Ask for the picks** with `AskUserQuestion`, recommended option first, labelled
   `(Recommended)`. Batch up to 4 decisions per call, most consequential first; issue a
   second call if more remain. Never drip one question per turn.
5. **Wait.** Produce no work product until every question has an answer — no files
   written, no code, no mutating commands. Further reading and exploration are fine and
   encouraged while waiting. If the answers only cover part of the set, re-ask the
   remainder before starting.
6. **Restate the resolved brief** in a few lines — what will be built, under which
   decisions — then execute.

If more than ~8 decisions are open, the request is under-specified a level up. Ask about
the goal and the definition of done first, then re-derive the rest from the answers.

## Decision checklist

Scan these; ask only what's genuinely unresolved:

- **Goal and done-ness** — what problem this solves, what "finished" looks like, how it
  gets verified
- **Scope boundaries** — what is explicitly out, what gets deferred
- **Callers and consumers** — who or what uses this, and what they're allowed to assume
- **Data** — shape, source of truth, validation, persistence, migration of what exists
- **Technical choices with no single right answer** — library, pattern, storage, sync vs.
  async, new module vs. extending an existing one
- **Integration points** — what to reuse, what to replace, what must keep working
- **Edge behavior** — empty, invalid, missing, concurrent, offline, partial failure
- **Non-functional constraints** — performance budget, security and access, backwards
  compatibility
- **Preferences not inferable from the repo** — naming, file layout, abstraction level
- **Delivery** — tests expected, docs, commit, anything the user wants to review first

## Argumentation format

Write the analysis as text — `AskUserQuestion` option descriptions are too short to hold a
real argument. One block per decision:

```
### <the decision, as a question>

- **A — <short name>**
  Pros: <what this buys, concretely, in this task>
  Cons: <what it costs or forecloses>
- **B — <short name>**
  Pros: … Cons: …

**Recommendation: A** — <why, tied to this project's constraints, not to general rules>
```

Rules that make the block worth reading:

- **Real alternatives only.** Two phrasings of the same approach is one option, not two.
  If there's genuinely only one sane path, say so and don't stage a fake vote.
- **Consequences, not maxims.** "Blocks the request thread on a 400ms disk read" helps a
  decision; "separation of concerns is good practice" does not.
- **Always recommend.** A question with no recommendation hands the analysis back to the
  user. State a position and defend it; being overruled is fine and expected.
- **Name the cost of the recommendation.** Every choice gives something up — say what.

Then present the picks via `AskUserQuestion`, keeping option labels aligned with the names
used in the text so the two read as one thing.

## Anti-patterns

Don't: ask what the code answers; ask questions whose answer changes nothing; offer
options without a recommendation; pad pros and cons with generic best-practice lines;
re-ask a decision already settled earlier in the session; start building "while waiting";
or narrow, widen, or reshape the request instead of asking about it.
