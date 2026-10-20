import { join } from "node:path";
import { select } from "@inquirer/prompts";
import { Command } from "commander";
import { copyCommand, runCopyWizard } from "./src/commands/copy.ts";
import { newCommand, runNewWizard } from "./src/commands/new.ts";
import { listCommand, runList } from "./src/commands/list.ts";

const SKILLS_ROOT = join(import.meta.dir, "skills");
const PROJECT_ROOT = process.cwd();

/** Exit code a shell reports for a process stopped by Ctrl+C (128 + SIGINT). */
const SIGINT_EXIT_CODE = 130;

if (import.meta.main) {
  const listCmd = listCommand(SKILLS_ROOT);
  const copyCmd = copyCommand(SKILLS_ROOT);
  const newCmd = newCommand(PROJECT_ROOT);

  const cli = new Command()
    .name("cc-skills")
    .version("0.1.0")
    .description("Manage skills from this personal library.")
    .action(async () => {
      const choice = await select({
        message: "What do you want to do?",
        choices: [
          {
            name: `List skills — ${listCmd.description()}`,
            value: "list",
          },
          {
            name: `Copy skills — ${copyCmd.description()}`,
            value: "copy",
          },
          { name: `New skill — ${newCmd.description()}`, value: "new" },
          { name: "Help — Show usage for every command", value: "help" },
        ],
      });
      if (choice === "list") await runList(SKILLS_ROOT);
      else if (choice === "copy") await runCopyWizard(SKILLS_ROOT);
      else if (choice === "new") await runNewWizard(PROJECT_ROOT);
      else cli.outputHelp();
    })
    // Commander only adds an implicit `help` subcommand when the root has no action of its own.
    .helpCommand(true)
    .addCommand(listCmd)
    .addCommand(copyCmd)
    .addCommand(newCmd);

  try {
    await cli.parseAsync(process.argv);
  } catch (error) {
    // Inquirer rejects every pending prompt with ExitPromptError on Ctrl+C;
    // exit quietly instead of printing its stack trace.
    if (error instanceof Error && error.name === "ExitPromptError") process.exit(SIGINT_EXIT_CODE);
    throw error;
  }
}
