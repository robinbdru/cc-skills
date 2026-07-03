import { copy, exists } from "@std/fs";
import { join } from "@std/path";

/**
 * Expands a leading `~` to the user's home directory; returns other paths
 * unchanged. Throws if a `~`-prefixed path is given but HOME isn't set.
 */
export function expandHome(path: string): string {
  if (path !== "~" && !path.startsWith("~/")) return path;
  const home = Deno.env.get("HOME");
  if (!home) throw new Error("Cannot expand '~' — the HOME environment variable is not set.");
  return path === "~" ? home : join(home, path.slice(2));
}

/**
 * Copies a skill's directory tree into `targetDir`.
 *
 * When `overwrite` is set and `targetDir` already exists, it's removed first
 * so the result matches the source exactly — `@std/fs` copy() merges into an
 * existing directory rather than replacing it, which would otherwise leave
 * stale files behind from a previous copy.
 */
export async function copySkillTo(sourceDir: string, targetDir: string, options: { overwrite: boolean }): Promise<void> {
  if (options.overwrite && await exists(targetDir)) {
    await Deno.remove(targetDir, { recursive: true });
  }
  await copy(sourceDir, targetDir);
}

/** Whether `name` already exists directly under `destinationRoot`. */
export function targetExists(destinationRoot: string, name: string): Promise<boolean> {
  return exists(join(destinationRoot, name));
}
