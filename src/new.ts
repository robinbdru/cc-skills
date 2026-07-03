import { ensureDir, exists } from "@std/fs";
import { join } from "@std/path";

const SEGMENT_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Validates a skill name or path like "new-skill" or "group/new-skill":
 * each "/"-separated segment must be non-empty, lowercase letters/digits/hyphens only.
 * Throws with a descriptive message otherwise.
 */
export function validateSkillName(name: string): void {
  const segments = name.split("/");
  if (segments.some((segment) => !SEGMENT_PATTERN.test(segment))) {
    throw new Error(
      `Invalid skill name "${name}" — use lowercase letters, digits and hyphens, e.g. "new-skill" or "group/new-skill".`,
    );
  }
}

/** Turns a hyphenated segment like "new-skill" into a heading like "New Skill". */
function titleCase(segment: string): string {
  return segment.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

/** Minimal `SKILL.md` stub: empty description placeholder and a heading from the skill's leaf name. */
export function skillStub(name: string): string {
  const leaf = name.split("/").at(-1)!;
  return `---\ndescription: \n---\n\n# ${titleCase(leaf)}\n\nTODO\n`;
}

/**
 * Whether `name` or one of its ancestor group segments already exists as a skill
 * (has its own `SKILL.md`) under `skillsRoot` — a skill can't also be a group.
 * Returns the conflicting ancestor's name, or undefined if there's no conflict.
 */
export async function findSkillConflict(skillsRoot: string, name: string): Promise<string | undefined> {
  const segments = name.split("/");
  for (let i = 1; i < segments.length; i++) {
    const ancestor = segments.slice(0, i).join("/");
    if (await exists(join(skillsRoot, ancestor, "SKILL.md"))) return ancestor;
  }
  return undefined;
}

/** Whether `name` already exists as a skill (has a `SKILL.md`) under `skillsRoot`. */
export function skillExists(skillsRoot: string, name: string): Promise<boolean> {
  return exists(join(skillsRoot, name, "SKILL.md"));
}

/** Creates `skillsRoot/<name>/SKILL.md` with minimal stub content, overwriting any existing file. Returns the skill's directory. */
export async function scaffoldSkill(skillsRoot: string, name: string): Promise<string> {
  const dir = join(skillsRoot, ...name.split("/"));
  await ensureDir(dir);
  await Deno.writeTextFile(join(dir, "SKILL.md"), skillStub(name));
  return dir;
}
