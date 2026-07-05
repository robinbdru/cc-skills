---
description: Analyze working-tree changes and produce clean, atomic git commits in Conventional Commits format. Use when the user asks to commit, "make a commit", "commit my changes", "stage and commit", "wrap up my changes", "save my progress", or before any push operation.
---

# Commit

Turn the current working-tree changes into one or more atomic, well-formed commits.

## Workflow

1. Run `git status`, `git diff`, and `git diff --cached` to see the full scope of changes.
2. Group changes into atomic commits — one coherent intent each. Split by concern (different features, unrelated files); combine when one purpose spans many files.
3. Stage precisely what belongs in each commit: `git add <file>...` for whole files, `git add -p <file>` when a file mixes concerns. Never `git add -A` or `git add .`.
4. Commit each group with a Conventional Commits message:
   ```
   <type>(<scope>): <summary>

   [optional body: why, not what]
   ```
   - Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`, `ci`
   - Summary ≤72 chars, imperative mood ("add" not "added")
   - Body only when the diff doesn't already make the *why* obvious
5. Run `git log --oneline -5` to confirm the result.

## Edge cases

- Nothing staged or unstaged: report there's nothing to commit.
- Untracked files: confirm with the user before staging them.
- Sensitive files (`.env`, keys, credentials): never stage — flag them instead.
- Large diff with unclear grouping: ask the user how to split it before committing.
