import { join } from "@std/path";
import { discoverSkills, type SkillEntry } from "./skills.ts";

/** A skill entry enriched with its parsed description. */
export interface SkillInfo extends SkillEntry {
  description: string;
}

const FRONTMATTER_FIELD = /^([\w-]+):\s*(.*)$/;

/**
 * Extracts a single field from a SKILL.md's YAML frontmatter.
 *
 * Only handles flat `key: value` scalars on a single line, which is the
 * only form used anywhere in this repo's skills (no lists, no block
 * scalars).
 */
function parseFrontmatterField(content: string, field: string): string | undefined {
  if (!content.startsWith("---")) return undefined;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return undefined;
  const block = content.slice(3, end);

  for (const line of block.split("\n")) {
    const match = line.match(FRONTMATTER_FIELD);
    if (match && match[1] === field) return match[2].trim();
  }
  return undefined;
}

/** Reads a skill's description from its SKILL.md, or "" if absent/unparsable. */
export async function readSkillDescription(skillDir: string): Promise<string> {
  const content = await Deno.readTextFile(join(skillDir, "SKILL.md"));
  return parseFrontmatterField(content, "description") ?? "";
}

/** Discovers every skill under `skillsRoot` and attaches its description. */
export async function listSkills(skillsRoot: string): Promise<SkillInfo[]> {
  const skills = await discoverSkills(skillsRoot);
  return await Promise.all(
    skills.map(async (skill) => ({
      ...skill,
      description: await readSkillDescription(skill.dir),
    })),
  );
}
