import { Command } from "@cliffy/command";
import { HelpCommand } from "@cliffy/command/help";
import { Select } from "@cliffy/prompt";
import { dirname, fromFileUrl, join } from "@std/path";
import { copyCommand, runCopyWizard } from "./src/commands/copy.ts";
import { newCommand, runNewWizard } from "./src/commands/new.ts";

const SKILLS_ROOT = join(dirname(fromFileUrl(import.meta.url)), "skills");
const PROJECT_ROOT = Deno.cwd();

if (import.meta.main) {
  const cli = new Command()
    .name("cc-skills")
    .version("0.1.0")
    .description("Manage skills from this personal library.")
    .action(async function () {
      const choice = await Select.prompt({
        message: "What do you want to do?",
        options: [
          { name: "Copy skills", value: "copy" },
          { name: "New skill", value: "new" },
          { name: "Help", value: "help" },
        ],
      });
      if (choice === "copy") await runCopyWizard(SKILLS_ROOT);
      else if (choice === "new") await runNewWizard(PROJECT_ROOT);
      else this.showHelp();
    })
    .command("help", new HelpCommand()).global()
    .command("copy", copyCommand(SKILLS_ROOT))
    .command("new", newCommand(PROJECT_ROOT));

  await cli.parse(Deno.args);
}
