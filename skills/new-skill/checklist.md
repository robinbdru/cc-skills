# Skill checklist

Before finishing a new or edited skill, verify:

- [ ] `description` states what it does + when to use it, third person, key terms first
- [ ] Directory name is short, lowercase-hyphenated, canonical (no destination-specific prefix)
- [ ] Placement respects the skill/group split: the folder either has a `SKILL.md` (a skill) or only holds sibling skill folders (a group) — never both
- [ ] Frontmatter has only the fields the skill actually uses — no empty leftover keys
- [ ] Body assumes Claude already knows common concepts; every paragraph earns its token cost
- [ ] Degrees of freedom match task fragility (loose guidance vs. exact commands)
- [ ] No time-sensitive statements ("as of 2026...") — use a collapsible "old patterns" section instead if history matters
- [ ] Terminology is consistent throughout (one term per concept)
- [ ] References are one level deep from `SKILL.md` — no `SKILL.md → a.md → b.md` chains
- [ ] Reference files over ~100 lines start with a table of contents
- [ ] `SKILL.md` body stays under ~500 lines; overflow moved to supporting files
- [ ] Scripts (if any) handle errors explicitly and justify constants — no "voodoo constants", no punting failures to Claude
- [ ] Tested once end-to-end: invoke it and confirm the output matches intent
