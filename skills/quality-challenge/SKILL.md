---
description: Applies a review lens to judge the real quality of a piece of code (any language) and produce a structured critique report instead of a plain opinion. Use whenever the user asks for a code review, a critique, an opinion on quality, "is this well done", "what's wrong with this code", a pre-production audit, or shares existing code (a file, a snippet, a pull request) asking for feedback on it — even without saying "review". Do NOT trigger when the user simply asks to write or fix code without asking for a quality opinion.
disallowed-tools: Write, Edit, NotebookEdit
---

# Quality challenge

## Why this skill exists

Most code feedback stops at style — rename this variable, align these braces. The
costliest problems are almost never there — they're in what the code doesn't say: which
invalid inputs are silently accepted, which errors get swallowed, which assumptions
("this list is never empty", "this price is always positive") are never checked
anywhere.

The goal isn't pedantry or a full rewrite. It's spotting the places where the code can be
wrong without saying so, and naming them clearly enough that the person can decide what
to do about it.

## What this skill produces

A **critique report**, not a rewrite. Someone asking for a review wants to understand
where the risk is, not receive a diff to swallow whole. Don't rewrite the code unless
explicitly asked to, after the report has been seen.

## Review lens

Work through these axes, in this priority order — the earlier ones cost the most in
production:

1. **Silent failures.** What happens on invalid, null, empty, or out-of-range input?
   Does the code raise an explicit error, or continue with a wrong value (a negative
   amount, division by zero, an empty array treated as non-empty)?
2. **Trust boundaries.** Where does external data (user input, an HTTP response, a file,
   a database) enter the system without validation? Once validated, is it typed so the
   rest of the code no longer has to worry about it?
3. **Side effects and mutation.** Are globals or shared objects mutated in place? Can two
   calls to the same function step on each other?
4. **Separation of concerns.** Is business logic mixed with I/O (HTTP, disk, DB)? If so,
   that's a signal the code will be hard to test without mocking half the world.
5. **Real testability.** Not "are there tests" but "can the logic that matters be tested
   without heavy dependencies". If the answer is no, the missing tests are a symptom, not
   the disease.
6. **Precision and sensitive arithmetic.** Money in floats, timezone-less dates,
   float-equality comparisons — these bugs are quiet and expensive.
7. **Naming and readability.** Handle this last. It's real, but it's never what breaks in
   production.

No need to work through all 7 points if the code is short or obviously sound on some of
them — mention what's relevant, state plainly what's already good (that avoids reading
as nitpicking for its own sake), and keep the report focused on what matters.

## Report format

Scale the length to the size of the code, but keep this structure:

```
## What's already good
[1-3 concrete points, not generalities]

## Points of concern
[For each issue: what it is, why it concretely matters (a scenario, not an abstract
rule), and its severity — blocking / fix before prod / possible improvement]

## If you only fix one thing
[The single most cost-effective fix, and why]
```

Phrase each point of concern as a concrete scenario ("if `discount` is 1.5, the total
goes negative") rather than a general rule ("always validate input") — the former helps
someone decide, the latter just asserts.

## When to suggest plan-full

This skill produces a diagnosis, not an action plan. If the report reveals that fixing
the issues requires non-trivial restructuring — touching multiple files, changing an
architecture (e.g. separating a business layer that's tangled with I/O across an entire
API), introducing a new cross-cutting dependency (validation, centralized error
handling) — suggest invoking the **plan-full** skill to plan that implementation before
writing any code.

Don't invoke it without asking: end the critique report with a line like "if you want to
plan this rework before diving in, I can kick off plan-full." It's the user's call
whether the fix is small enough to do directly, or big enough to warrant planning.

Don't suggest plan-full for local, mechanical fixes (adding validation to a function,
typing an object) — only when the scope crosses a file boundary or touches the project's
structure.
