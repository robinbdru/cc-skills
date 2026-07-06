import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { listSkills } from "../list.ts";

const FALLBACK_WIDTH = 100;

/** Terminal width, or a sane fallback when stdout isn't a TTY (e.g. piped). */
function terminalWidth(): number {
  try {
    return Deno.consoleSize().columns;
  } catch {
    return FALLBACK_WIDTH;
  }
}

/**
 * Prints every skill's name and description as a table. Exits the process
 * if the skills root doesn't exist, matching the copy/new commands'
 * convention.
 */
export async function runList(skillsRoot: string): Promise<void> {
  let skills;
  try {
    skills = await listSkills(skillsRoot);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`Skills folder not found: ${skillsRoot}`);
      Deno.exit(1);
    }
    throw error;
  }

  if (skills.length === 0) {
    console.log(`No skills found under ${skillsRoot}`);
    return;
  }

  new Table()
    .header(["Name", "Description"])
    .body(skills.map((skill) => [skill.name, skill.description || "(no description)"]))
    .border()
    .maxWidth(terminalWidth())
    .minColWidth([0, 20])
    .flexShrink([0, 1])
    .render();
}

/** Builds the `list` subcommand, wired to print every skill under `skillsRoot`. */
export function listCommand(skillsRoot: string) {
  return new Command()
    .description("List every skill in this library with its name and description.")
    .action(() => runList(skillsRoot));
}
