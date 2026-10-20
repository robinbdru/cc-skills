import Table from "cli-table3";
import { Command } from "commander";
import { isNotFound } from "../fs.ts";
import { listSkills, type SkillInfo } from "../list.ts";

const FALLBACK_WIDTH = 100;
const MIN_DESCRIPTION_WIDTH = 20;
// Outer left and right borders plus the one separator between the two columns.
const BORDER_CHARS = 3;
// cli-table3 counts its default one-space left and right padding inside each column width.
const CELL_PADDING = 2;

/** Terminal width, or a sane fallback when stdout isn't a TTY (e.g. piped). */
function terminalWidth(): number {
  return process.stdout.columns ?? FALLBACK_WIDTH;
}

/**
 * Prints every skill's name and description as a table. Exits the process
 * if the skills root doesn't exist, matching the copy/new commands'
 * convention.
 */
export async function runList(skillsRoot: string): Promise<void> {
  let skills: SkillInfo[];
  try {
    skills = await listSkills(skillsRoot);
  } catch (error) {
    if (isNotFound(error)) {
      console.error(`Skills folder not found: ${skillsRoot}`);
      process.exit(1);
    }
    throw error;
  }

  if (skills.length === 0) {
    console.log(`No skills found under ${skillsRoot}`);
    return;
  }

  // The name column never shrinks; the description column takes the rest of
  // the terminal and wraps, down to a minimum width.
  const nameWidth = Math.max("Name".length, ...skills.map((skill) => skill.name.length)) + CELL_PADDING;
  const descriptionWidth = Math.max(MIN_DESCRIPTION_WIDTH, terminalWidth() - nameWidth - BORDER_CHARS);

  const table = new Table({
    head: ["Name", "Description"],
    colWidths: [nameWidth, descriptionWidth],
    wordWrap: true,
    style: { head: [], border: [] },
  });
  table.push(...skills.map((skill) => [skill.name, skill.description || "(no description)"]));
  console.log(table.toString());
}

/** Builds the `list` subcommand, wired to print every skill under `skillsRoot`. */
export function listCommand(skillsRoot: string): Command {
  return new Command("list")
    .description("List every skill in this library with its name and description.")
    .action(() => runList(skillsRoot));
}
