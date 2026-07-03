import { Command } from "@cliffy/command";
import { HelpCommand } from "@cliffy/command/help";
import { Select } from "@cliffy/prompt";
import { dirname, fromFileUrl, join } from "@std/path";
import { copyCommand, runCopyWizard } from "./src/commands/copy.ts";

const SKILLS_ROOT = join(dirname(fromFileUrl(import.meta.url)), "skills");

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
          { name: "Help", value: "help" },
        ],
      });
      if (choice === "copy") await runCopyWizard(SKILLS_ROOT);
      else this.showHelp();
    })
    .command("help", new HelpCommand()).global()
    .command("copy", copyCommand(SKILLS_ROOT));

  await cli.parse(Deno.args);
}
