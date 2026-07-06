import { join } from "@std/path";

/** A leaf skill directory: contains a SKILL.md, never nested skills. */
export interface SkillEntry {
  /** Path relative to the skills root, slash-joined (e.g. "new-skill" or "plan/research"). */
  name: string;
  /** Absolute path to the directory containing SKILL.md. */
  dir: string;
}

/**
 * Whether `entry` (found in `dir`) is a directory, following symlinks —
 * `Deno.DirEntry.isDirectory` is false for a symlink even when it points at
 * a directory. A broken symlink is treated as "not a directory".
 */
async function isDirectory(dir: string, entry: Deno.DirEntry): Promise<boolean> {
  if (entry.isDirectory) return true;
  if (!entry.isSymlink) return false;
  try {
    return (await Deno.stat(join(dir, entry.name))).isDirectory;
  } catch {
    return false;
  }
}

/**
 * Walks a skills root and returns every leaf skill directory.
 *
 * A directory is either a skill (has SKILL.md, not walked further) or a
 * group (no SKILL.md, only ever holds sibling skill directories).
 */
export async function discoverSkills(skillsRoot: string): Promise<SkillEntry[]> {
  const found: SkillEntry[] = [];

  async function walk(dir: string, relParts: string[]): Promise<void> {
    let hasSkillMd = false;
    const subdirs: string[] = [];

    for await (const entry of Deno.readDir(dir)) {
      if (entry.isFile && entry.name === "SKILL.md") {
        hasSkillMd = true;
      } else if (await isDirectory(dir, entry)) {
        subdirs.push(entry.name);
      }
    }

    if (hasSkillMd) {
      found.push({ name: relParts.join("/"), dir });
      return;
    }

    for (const sub of subdirs.sort()) {
      await walk(join(dir, sub), [...relParts, sub]);
    }
  }

  for await (const entry of Deno.readDir(skillsRoot)) {
    if (await isDirectory(skillsRoot, entry)) {
      await walk(join(skillsRoot, entry.name), [entry.name]);
    }
  }

  found.sort((a, b) => a.name.localeCompare(b.name));
  return found;
}

export interface NamingOptions {
  /** Prepended first, e.g. "rb". */
  prefix?: string;
}

/**
 * Resolves the directory name a skill gets at the destination: its own leaf
 * name (any group segments are dropped), optionally prefixed.
 *
 * "plan/research" + { prefix: "rb" } -> "rb-research"
 * "new-skill"     + { prefix: "rb" } -> "rb-new-skill"
 * "new-skill"     + {}               -> "new-skill"
 */
export function targetDirName(skill: SkillEntry, options: NamingOptions = {}): string {
  const leaf = skill.name.split("/").at(-1)!;
  return options.prefix ? `${options.prefix}-${leaf}` : leaf;
}
