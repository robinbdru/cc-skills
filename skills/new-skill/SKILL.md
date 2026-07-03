---
description: Scaffolds a new Claude Code skill in this repo's skills/ library, with minimal frontmatter and a concise body that pushes detail into supporting files only when needed. Use when asked to create, add, write, or scaffold a new skill, or to turn a repeated prompt/procedure into a reusable skill for this collection.
allowed-tools: Write Edit Read Bash(mkdir *)
---

# New skill

Scaffold a new skill under `skills/`, following this repo's conventions: a directory is either a **skill** (a leaf folder holding one `SKILL.md`) or a **group** (a folder with no `SKILL.md` of its own that only holds sibling skill folders, e.g. `plan/` holding `plan/research/`) — never both. Keep the body lean and push detail into supporting files only when they earn their token cost.

A future CLI will let users pick skills to install into a project or globally, and optionally suffix their names on install. Directory names in this repo are the canonical, unsuffixed source — don't bake install-time naming into them.

## Workflow

1. Clarify anything you can't infer from the request:
   - What the skill does and when it should trigger
   - Directory name — short, hyphenated, canonical (no destination-specific suffix)
   - Placement: does this join an existing group, start a new group, or stand alone? List `skills/` and check whether the target directory already has a `SKILL.md` (it's a skill — do not add another) or already groups sibling skills (add a new sibling skill folder inside it, don't put a `SKILL.md` directly in the group)
   - Whether Claude should auto-invoke it or only the user via `/name` (`disable-model-invocation: true`) — reserve this for skills with side effects (writes, sends, deploys)
   - Whether it needs scripts, references, or a template, or plain instructions are enough

2. Create `skills/<name>/SKILL.md`, or `skills/<group>/<name>/SKILL.md` when it belongs in a group.

3. Fill frontmatter using [./template.md](./template.md) as the field reference. Copy over only the fields this skill actually uses — `description` is nearly always needed, most others are not. Never leave unused fields as empty keys in the final file.

4. Write the body:
   - Third person, no filler — assume Claude already knows common concepts, every line should earn its cost
   - `description`: what it does + when to use it, key terms first (truncated at 1536 chars in the skill listing)
   - State what to do, not how or why, unless the why is a non-obvious constraint
   - Match degrees of freedom to task fragility: loose steps for judgment calls, exact commands for fragile or repeatable operations
   - If the body is approaching ~150-200 lines, move detail into a supporting file (`reference.md`, `examples.md`, `scripts/...`) and link it from `SKILL.md` — keep links one level deep, no `SKILL.md → a.md → b.md` chains
   - Hard limit: keep `SKILL.md` itself under 500 lines

5. Before finishing, verify against [checklist.md](checklist.md).

## Additional resources

- Full frontmatter field reference: [./template.md](./template.md)
- Pre-flight checklist: [checklist.md](checklist.md)
