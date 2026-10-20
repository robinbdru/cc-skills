import { cp, rm } from "node:fs/promises";
import { join } from "node:path";
import { exists } from "./fs.ts";

/**
 * Expands a leading `~` to the user's home directory; returns other paths
 * unchanged. Throws if a `~`-prefixed path is given but HOME isn't set.
 */
export function expandHome(path: string): string {
  if (path !== "~" && !path.startsWith("~/")) return path;
  const home = process.env.HOME;
  if (!home) throw new Error("Cannot expand '~' — the HOME environment variable is not set.");
  return path === "~" ? home : join(home, path.slice(2));
}

/**
 * Copies a skill's directory tree into `targetDir`.
 *
 * When `overwrite` is set and `targetDir` already exists, it's removed first
 * so the result matches the source exactly — `node:fs` cp() merges into an
 * existing directory rather than replacing it, which would otherwise leave
 * stale files behind from a previous copy.
 */
export async function copySkillTo(sourceDir: string, targetDir: string, options: { overwrite: boolean }): Promise<void> {
  if (options.overwrite && await exists(targetDir)) {
    await rm(targetDir, { recursive: true });
  }
  await cp(sourceDir, targetDir, { recursive: true });
}

/** Whether `name` already exists directly under `destinationRoot`. */
export function targetExists(destinationRoot: string, name: string): Promise<boolean> {
  return exists(join(destinationRoot, name));
}
