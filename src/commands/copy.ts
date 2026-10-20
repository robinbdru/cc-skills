import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { Command } from "commander";
import { isNotFound } from "../fs.ts";
import { discoverSkills, targetDirName, type SkillEntry } from "../skills.ts";
import { copySkillTo, expandHome, targetExists } from "../copy.ts";

/**
 * Runs the interactive copy wizard: select skills, choose a destination and
 * naming options, confirm, then copy. Exits the process on unrecoverable
 * setup errors (missing or empty skills root, unresolvable destination).
 */
export async function runCopyWizard(skillsRoot: string): Promise<void> {
  let skills: SkillEntry[];
  try {
    skills = await discoverSkills(skillsRoot);
  } catch (error) {
    if (isNotFound(error)) {
      console.error(`Skills folder not found: ${skillsRoot}`);
      process.exit(1);
    }
    throw error;
  }

  if (skills.length === 0) {
    console.error(`No skills found under ${skillsRoot}`);
    process.exit(1);
  }

  const scope = await select({
    message: "Which skills do you want to copy?",
    choices: [
      { name: "All skills", value: "all" },
      { name: "Choose which skills", value: "choose" },
    ],
  });
  const selectedNames = scope === "all"
    ? skills.map((s) => s.name)
    : await checkbox({
      message: "Select skills to copy",
      choices: skills.map((s) => ({ name: s.name, value: s.name })),
    });
  if (selectedNames.length === 0) {
    console.log("Nothing selected.");
    return;
  }
  const selected = skills.filter((s) => selectedNames.includes(s.name));

  const rawDestination = await input({
    message: "Destination folder (a .claude/skills/ folder will be found or created inside it)",
  });
  let destination: string;
  try {
    destination = join(expandHome(rawDestination), ".claude", "skills");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const prefixInput = await input({
    message: "Prefix to prepend to copied skill names (leave empty for none)",
    default: "",
  });
  const prefix = prefixInput.trim() || undefined;

  const plan = selected.map((skill) => ({
    skill,
    dirName: targetDirName(skill, { prefix }),
  }));

  const dirNames = plan.map((p) => p.dirName);
  const duplicateNames = [...new Set(dirNames.filter((name, i) => dirNames.indexOf(name) !== i))];
  if (duplicateNames.length > 0) {
    console.error("These skills would collide at the destination:");
    for (const dup of duplicateNames) {
      const colliding = plan.filter((p) => p.dirName === dup).map((p) => p.skill.name);
      console.error(`  "${dup}" <- ${colliding.join(", ")}`);
    }
    console.error("Add a prefix or narrow your selection, then try again.");
    return;
  }

  const existsChecks = await Promise.all(plan.map((p) => targetExists(destination, p.dirName)));
  const conflicts = new Set(plan.filter((_, i) => existsChecks[i]).map((p) => p.dirName));

  const overwriteAll = conflicts.size === 0 || (await select({
    message: `${conflicts.size} destination folder(s) already exist (${[...conflicts].join(", ")}). Overwrite?`,
    choices: [
      { name: "Overwrite all", value: "all" },
      { name: "Decide one by one", value: "ask" },
    ],
  })) === "all";

  console.log("\nAbout to copy:");
  for (const { skill, dirName } of plan) {
    console.log(`  ${skill.name} -> ${join(destination, dirName)}`);
  }
  console.log(`Prefix: ${prefix ?? "(none)"}`);
  console.log(`Destination: ${destination}`);
  const proceed = await confirm({ message: "Proceed?", default: false });
  if (!proceed) {
    console.log("Aborted.");
    return;
  }

  await mkdir(destination, { recursive: true });
  for (const { skill, dirName } of plan) {
    const target = join(destination, dirName);
    const conflicted = conflicts.has(dirName);

    let overwrite = overwriteAll;
    if (conflicted && !overwriteAll) {
      overwrite = await confirm({ message: `Overwrite ${dirName}?`, default: false });
      if (!overwrite) {
        console.log(`Skipped ${skill.name}`);
        continue;
      }
    }

    await copySkillTo(skill.dir, target, { overwrite: conflicted && overwrite });
    console.log(`Copied ${skill.name} -> ${target}`);
  }
}

/** Builds the `copy` subcommand, wired to run the interactive wizard against `skillsRoot`. */
export function copyCommand(skillsRoot: string): Command {
  return new Command("copy")
    .description("Copy skills from this library into a project or global skills directory.")
    .action(() => runCopyWizard(skillsRoot));
}
