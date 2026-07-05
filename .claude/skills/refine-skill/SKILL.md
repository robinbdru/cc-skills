---
description: Audit an existing skill's SKILL.md (and its supporting files) for blind spots, contradictions, ambiguity, imprecision, or convention violations, and report findings. Use when asked to review, audit, refine, critique, or "find problems in" a skill, or to check a skill for issues before shipping it.
argument-hint: [skill-name-or-path]
---

# Refine Skill

Analyze one skill for quality issues and report what's wrong — don't rewrite it unless asked to.

## Workflow

1. **Resolve the target.** If given a name or path, find its `SKILL.md` (e.g. `skills/<name>/SKILL.md` or `skills/<group>/<name>/SKILL.md`). If none was given or the name is ambiguous, list `skills/` and ask which one to audit.
2. **Read everything the skill touches**: `SKILL.md` plus every file it links to (references, templates, scripts). A skill's quality includes what it delegates to those files, not just the top-level body.
3. **Evaluate against each dimension below.** Skip dimensions that plainly don't apply (e.g. a skill with no scripts has nothing to check for error handling).
4. **Report findings** (format below), ranked most-severe first. Severe = actively misleads Claude or produces wrong behavior; minor = wastes tokens or reads awkwardly.
5. Only edit the skill if the user asks for fixes after seeing the report. If they do, apply them and re-list what changed.

## Dimensions to check

- **Frontmatter accuracy**: every field present is actually used; no empty leftover keys. `description` leads with what it does + when to use it, front-loads key terms. `disable-model-invocation` is set only if the skill has side effects (writes, sends, deploys) — flag it if a destructive skill is missing it, or a read-only one has it needlessly.
- **Self-containment**: the skill doesn't silently depend on another skill's files being installed alongside it — anything it needs must live inside its own folder, since skills can be installed individually.
- **Contradictions**: instructions that conflict with each other, or that promise something in `description`/intro that the body never actually does.
- **Ambiguity / imprecision**: steps vague enough that two readings would produce different behavior, especially around fragile or destructive operations that should instead give an exact command.
- **Blind spots**: edge cases, error states, or common variations of the task that the skill doesn't address at all.
- **Placement**: the folder is correctly a leaf skill (one `SKILL.md`) or a pure group (no `SKILL.md`, only sibling skill folders) — never both.
- **Structure**: links from `SKILL.md` go one level deep only (no `SKILL.md → a.md → b.md` chains); large reference files have a table of contents.
- **Redundancy / verbosity**: repeated content, filler, or explanations of things Claude already knows.
- **Terminology consistency**: one term per concept throughout, no drift between sections.
- **Length**: `SKILL.md` under ~500 lines; content that's grown past ~150-200 lines and should have been pushed into a supporting file.
- **Staleness**: time-sensitive claims ("as of 2026...", specific version numbers) that will silently rot.

## Report format

For each finding:

```
[severity] <file>: <what's wrong>
Why it matters: <concrete consequence — what Claude would do wrong because of this>
Suggested fix: <specific change>
```

If nothing survives scrutiny, say so plainly rather than inventing minor nitpicks to fill space.
