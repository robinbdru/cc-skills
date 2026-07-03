# Claude Code Skills

A personal library of [Claude Code skills](https://code.claude.com/docs/en/skills), built up over time and reused across projects.

## Structure

- `skills/` — each subdirectory is either a **skill** (a leaf folder with one `SKILL.md`) or a **group** of sibling skills (a folder with no `SKILL.md` of its own, e.g. `plan/`)
- `templates/` — shared templates referenced by skills
- `scripts/` — supporting scripts (e.g. copying skills to another location)

## Adding a skill

Use the `new-skill` skill (`skills/new-skill/`) to scaffold a new one following this repo's conventions.
