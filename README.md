# Claude Code Skills

A personal library of [Claude Code skills](https://code.claude.com/docs/en/skills), built up over time and reused across projects.

## Structure

- `skills/` — each subdirectory is either a **skill** (a leaf folder with one `SKILL.md`) or a **group** of sibling skills (a folder with no `SKILL.md` of its own, e.g. `plan/` holding `plan/research/`)
- `src/` — source for the `cc-skills` CLI (skill discovery, copy, and scaffold logic, plus tests)
- `main.ts` — entry point for the `cc-skills` CLI

## `deno task cli`

Launches an interactive menu so you don't need to remember the subcommand names — pick "Copy skills" or "New skill" and it hands off to the matching subcommand below.

```
$ deno task cli
? What do you want to do?
❯ Copy skills
  New skill
  Help
```

## `deno task cli new [name]`

Scaffolds a new skill's `SKILL.md` under the current project's local `.claude/skills/`. The `new-skill` skill (`skills/new-skill/`) documents the authoring conventions this scaffolder follows.

- **Name for the new skill** (skipped if you passed `[name]`) — asked so you can also run this without an argument and get prompted interactively.
- Validates the name and checks whether the target path already contains a `SKILL.md` further up the tree — this enforces the repo's rule that a directory is either a skill or a group of skills, never both.
- **Overwrite its SKILL.md?** — only asked if the skill already exists, so you don't silently clobber existing work.

```
$ deno task cli new my-skill
Created /Users/you/my-project/.claude/skills/my-skill/SKILL.md
```

## `deno task cli copy`

Copies skills from this library's `skills/` into another project's or your global `.claude/skills/` directory.

- **Which skills do you want to copy?** (all vs. choose) then, if choosing, **Select skills to copy** — lets you grab the whole library or just the ones you need.
- **Destination folder** — a plain path to a project root or your home directory; the CLI appends `.claude/skills/` itself, so the same prompt works for project-local and global installs.
- **Prefix to prepend to copied skill names** — useful when the destination already has a skill with the same name, or you want to namespace skills from this library.
- **Include each skill's group folder name in the copied name?** — only asked when at least one selected skill belongs to a group (e.g. `plan/research`); lets you flatten the group into the prefix instead of recreating the folder structure.
- If a destination folder already exists, you're asked whether to overwrite all conflicts or decide one by one, then asked to confirm the full copy plan before anything is written.

```
$ deno task cli copy
? Which skills do you want to copy? › All skills
? Destination folder (a .claude/skills/ folder will be found or created inside it) › ../other-project
? Prefix to prepend to copied skill names (leave empty for none) › 
? Include each skill's group folder name in the copied name? › No

About to copy:
  new-skill -> ../other-project/.claude/skills/new-skill
  plan/research -> ../other-project/.claude/skills/research
Prefix: (none)
Include group folder: no
Destination: ../other-project/.claude/skills
? Proceed? › Yes
Copied new-skill -> ../other-project/.claude/skills/new-skill
Copied plan/research -> ../other-project/.claude/skills/research
```
