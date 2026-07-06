import { Command } from "@cliffy/command";
import { HelpCommand } from "@cliffy/command/help";
import { Select } from "@cliffy/prompt";
import { dirname, fromFileUrl, join } from "@std/path";
import { copyCommand, runCopyWizard } from "./src/commands/copy.ts";
import { newCommand, runNewWizard } from "./src/commands/new.ts";
import { listCommand, runList } from "./src/commands/list.ts";

const SKILLS_ROOT = join(dirname(fromFileUrl(import.meta.url)), "skills");
const PROJECT_ROOT = Deno.cwd();

if (import.meta.main) {
  const listCmd = listCommand(SKILLS_ROOT);
  const copyCmd = copyCommand(SKILLS_ROOT);
  const newCmd = newCommand(PROJECT_ROOT);

  const cli = new Command()
    .name("cc-skills")
    .version("0.1.0")
    .description("Manage skills from this personal library.")
    .action(async function () {
      const choice = await Select.prompt({
        message: "What do you want to do?",
        options: [
          { name: `List skills — ${listCmd.getShortDescription()}`, value: "list" },
          { name: `Copy skills — ${copyCmd.getShortDescription()}`, value: "copy" },
          { name: `New skill — ${newCmd.getShortDescription()}`, value: "new" },
          { name: "Help — Show usage for every command", value: "help" },
        ],
      });
      if (choice === "list") await runList(SKILLS_ROOT);
      else if (choice === "copy") await runCopyWizard(SKILLS_ROOT);
      else if (choice === "new") await runNewWizard(PROJECT_ROOT);
      else this.showHelp();
    })
    .command("help", new HelpCommand()).global()
    .command("list", listCmd)
    .command("copy", copyCmd)
    .command("new", newCmd);

  await cli.parse(Deno.args);
}
