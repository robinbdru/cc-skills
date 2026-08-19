---
name: how
description: 'Use for "how does X work", code walkthroughs before changing something, and placement / ownership / layering questions ("where should this live", "which package owns this", "is this the right layer"). Explains subsystem architecture, runtime flow, onboarding mental models. Can critique architecture. Use why for motivation.'
---

# How

Answer "how does X work?" by exploring the codebase yourself and explaining it at the level of a senior engineer onboarding onto a subsystem. Enough to build a working mental model, not annotated source code.

Do the work in a single pass. No subagents, no parallel explorers, no multi-model panels.

Two modes:

1. **Explain** (default)
2. **Critique**: explain first, then assess the architecture

## Explain

### 1. Frame the question

Identify the scope:

- a subsystem ("how does the rate limiter work?")
- a feature flow ("how do we handle billing for on-demand usage?")
- an architectural overview ("how is the auth service structured?")
- a runtime trace ("walk me through what happens when a user submits a form")

If ambiguous, state your best-guess interpretation and proceed. Don't ask; let the user redirect.

### 2. Explore

- Start broad: Glob for relevant directories, Grep for key types, interfaces, class names.
- Pick an entry point and trace the call chain: callers, callees, data flow, type definitions.
- Read the actual code. Never infer behavior from file names.
- Cover the subsystem in slices (data model, request path, configuration/metrics) one after another, so nothing important is skipped.
- Stop when you can describe the full path from input to output (or trigger to effect) without hand-waving any step.
- Note anything surprising, non-obvious, or that a newcomer would get wrong.

Scale the effort to the question: a small utility needs a few reads; a cross-cutting subsystem needs a wider sweep before you write anything. Use the `references/exploration-guide.md` for guidance.

### 3. Write

Apply the **unslop** skill to everything you write here: no filler, no restating the question back, no hedging padding, no summary paragraph that repeats what was just said.

Follow the structure below and the reference guide (`references/writing-guide.md`), adapted to the question. Not every section is needed every time.

**Overview.** 1-2 paragraphs. What it is, what it does, why it exists. Enough to decide whether to keep reading.

**Key Concepts.** The types, services, or abstractions needed to understand the rest. Brief definitions, not an inventory.

**How It Works.** The core. What triggers it, what happens step by step, where data goes, the decision points. Prose, not pseudocode. Reference specific files and functions so the reader can go look; no code blocks unless a snippet is genuinely necessary.

**Where Things Live.** A short map of the files/directories needed to start working in this area.

**Gotchas.** Sharp edges, surprising behavior, historical context that explains why something looks weird.

## Critique

Triggered when the user asks for architectural issues, problems, or improvements, not just understanding.

1. Run the explain flow first. You can't critique what you don't understand.
2. Review the architecture against the rubric in `references/critique-guide.md`, rereading code where a concern is specific enough to verify.
3. Categorize findings as a pragmatic lead, not an aggregator:
   - **Act on.** Worth fixing now.
   - **Consider.** Real, but cost/benefit unclear.
   - **Noted.** Valid, low priority.
   - **Dismissed.** Wrong, missing context, or style preference.

Write the verdict with the **unslop** skill applied too. Present the explanation first, then the verdict below it. The explanation must stand on its own; someone who only wants to understand the system shouldn't wade through critique.
