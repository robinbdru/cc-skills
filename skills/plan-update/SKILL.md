---
description: Apply the user's inline notes/annotations in ./plans/<name>/plan.md back into the document, then leave it for further review. Use when the user says they've added notes, comments, or corrections directly into a plan file and asks to address or incorporate them.
---

# Plan: update

The user edits `plan.md` directly, adding inline notes: domain knowledge Claude didn't
have, corrections to wrong assumptions, rejected approaches, added constraints, or
redirected sections. Read the whole file to find every note before changing anything —
they're often scattered, not just at the top.

## Workflow

1. Read the current `./plans/<plan-name>/plan.md` in full.
2. Find every inline note. A note breaks the plan's expository voice — it reads as a
   short, imperative or contrastive aside addressed to Claude, not as a continuation of
   the plan's own prose. Look for parentheticals, `NOTE:`-style markers, and lines that
   argue with the surrounding text rather than extend it (often starting with "no",
   "wait", "actually"). For example:
   - Domain knowledge Claude lacked: "use drizzle:generate for migrations, not raw SQL"
   - A correction: "no -- this should be a PATCH, not a PUT"
   - A rejected approach: "remove this section, we don't need caching here"
   - An added constraint: "the queue consumer already handles retries, remove this retry logic"
   - A redirected section: "this is wrong -- visibility needs to be on the list, not on items. restructure accordingly"

   If the user says they added notes but none of the above is found, say so rather than
   silently leaving the plan unchanged.
3. Resolve each one: update the affected section so the plan reflects it, and remove the
   note itself once applied (the plan should read as clean prose afterward, not as a
   diff of comments). If a note poses a genuine open question or is too ambiguous to
   resolve confidently, don't guess — surface it back to the user instead of silently
   picking an answer.
4. Don't implement — this phase only updates the document. Output ends with the revised
   `plan.md`; expect another annotation round or a move to `plan-todo` /
   `implement-plan`.

## Example prompt this responds to

> I added a few notes to the document. Address all notes and update the document
> accordingly. Don't implement yet.
