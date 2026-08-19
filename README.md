# Claude Code Skills

A personal library of [Claude Code skills](https://code.claude.com/docs/en/skills) I reuse
across projects. The `cc-skills` CLI copies them into a project or into `~/.claude/skills/`.

## Structure

- `skills/` holds the skills themselves. Each subdirectory is either a skill (a leaf folder with one `SKILL.md`) or a group of sibling skills (a folder with no `SKILL.md` of its own, for example a hypothetical `foo/` holding `foo/bar/`). Every skill here is flat today, like `plan-research` or `improve-jsdoc`, but the CLI's discovery logic handles groups.
- `src/` holds the `cc-skills` CLI: skill discovery, copy, and scaffold logic, plus tests.
- `main.ts` is the CLI entry point.

## `deno task cli`

Launches an interactive menu so you don't have to remember the subcommand names. Pick "Copy skills" or "New skill" and it hands off to the matching subcommand below.

```
$ deno task cli
? What do you want to do?
❯ List skills — List every skill in this library with its name and description.
  Copy skills — Copy skills from this library into a project or global skills directory.
  New skill — Scaffold a new skill under this project's local .claude/skills/ directory.
  Help — Show usage for every command
```

## `deno task cli list`

Prints every skill as a table with its name and description, both read from `SKILL.md`
frontmatter. The description column wraps to fit your terminal width, so the table below is
narrower than what you get on a wide terminal.

```
$ deno task cli list
┌────────────────────────────┬─────────────────────────────────────────────────────────────────────┐
│ Name                       │ Description                                                         │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ bro                        │ Restate the last message in plain human language, with no jargon.   │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ commit                     │ Analyze working-tree changes and produce clean, atomic git commits  │
│                            │ in Conventional Commits format. Use when the user asks to commit,   │
│                            │ "make a commit", "commit my changes", "stage and commit", "wrap up  │
│                            │ my changes", "save my progress", or before any push operation.      │
├────────────────────────────┼─────────────────────────────────────────────────────────────────────┤
... plus the rest of the library
```

## `deno task cli new [name]`

Scaffolds a new skill's `SKILL.md` under the current project's local `.claude/skills/`. The `new-skill` skill (`skills/new-skill/`) documents the authoring conventions this scaffolder follows.

- **Name for the new skill.** Skipped when you pass `[name]`. Without an argument, the command prompts for it.
- Validates the name, then checks whether any parent of the target path already holds a `SKILL.md`. That enforces the repo's rule that a directory is either a skill or a group of skills, never both.
- **Overwrite its SKILL.md?** Asked only when the skill already exists, so you don't clobber existing work.

```
$ deno task cli new my-skill
Created /Users/you/my-project/.claude/skills/my-skill/SKILL.md
```

## `deno task cli copy`

Copies skills from this library's `skills/` into another project's `.claude/skills/` directory, or your global one.

- **Which skills do you want to copy?** All, or choose. Choosing opens a second prompt, **Select skills to copy**, for picking them one by one.
- **Destination folder.** A plain path to a project root or to your home directory. The CLI appends `.claude/skills/` itself, so the same prompt covers project-local and global installs.
- **Prefix to prepend to copied skill names.** Use it when the destination already holds a skill with the same name. My global install uses `cc-`, so `plan-full` lands as `cc-plan-full`.
- When the destination folder already exists, the CLI asks whether to overwrite every conflict or decide one by one, then prints the full copy plan for confirmation before writing anything.

```
$ deno task cli copy
? Which skills do you want to copy? › All skills
? Destination folder (a .claude/skills/ folder will be found or created inside it) › ../other-project
? Prefix to prepend to copied skill names (leave empty for none) › 

About to copy:
  new-skill -> ../other-project/.claude/skills/new-skill
  plan-research -> ../other-project/.claude/skills/plan-research
Prefix: (none)
Destination: ../other-project/.claude/skills
? Proceed? › Yes
Copied new-skill -> ../other-project/.claude/skills/new-skill
Copied plan-research -> ../other-project/.claude/skills/plan-research
```
