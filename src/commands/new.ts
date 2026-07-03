import { Command } from "@cliffy/command";
import { Confirm, Input } from "@cliffy/prompt";
import { join } from "@std/path";
import { findSkillConflict, scaffoldSkill, skillExists, validateSkillName } from "../new.ts";

/**
 * Runs the new-skill wizard: prompts for a name if none was given, validates it,
 * checks for skill/group conflicts under the project's local `.claude/skills/`,
 * confirms before overwriting an existing skill, then scaffolds a minimal `SKILL.md`.
 */
export async function runNewWizard(projectRoot: string, name?: string): Promise<void> {
  const skillsRoot = join(projectRoot, ".claude", "skills");

  let skillName = name?.trim();
  while (!skillName) {
    skillName = (await Input.prompt({
      message: "Name for the new skill (e.g. new-skill or group/new-skill)",
    })).trim();
  }

  try {
    validateSkillName(skillName);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }

  const conflict = await findSkillConflict(skillsRoot, skillName);
  if (conflict) {
    console.error(`"${conflict}" is already a skill (has a SKILL.md) — it can't also contain "${skillName}".`);
    Deno.exit(1);
  }

  if (await skillExists(skillsRoot, skillName)) {
    const overwrite = await Confirm.prompt(
      `"${skillName}" already exists at ${join(skillsRoot, skillName)} — overwrite its SKILL.md?`,
    );
    if (!overwrite) {
      console.log("Aborted.");
      return;
    }
  }

  const dir = await scaffoldSkill(skillsRoot, skillName);
  console.log(`Created ${join(dir, "SKILL.md")}`);
}

/** Builds the `new` subcommand, wired to scaffold a skill under `projectRoot`'s local `.claude/skills/`. */
export function newCommand(projectRoot: string) {
  return new Command()
    .description("Scaffold a new skill under this project's local .claude/skills/ directory.")
    .arguments("[name:string]")
    .action((_options, name) => runNewWizard(projectRoot, name));
}
