import { assertEquals, assertThrows } from "@std/assert";
import { exists } from "@std/fs";
import { join } from "@std/path";
import { copySkillTo, expandHome } from "./copy.ts";

Deno.test("expandHome expands a leading ~ using HOME", () => {
  const original = Deno.env.get("HOME");
  Deno.env.set("HOME", "/home/robin");
  try {
    assertEquals(expandHome("~"), "/home/robin");
    assertEquals(expandHome("~/.claude/skills"), "/home/robin/.claude/skills");
  } finally {
    if (original === undefined) Deno.env.delete("HOME");
    else Deno.env.set("HOME", original);
  }
});

Deno.test("expandHome leaves other paths unchanged", () => {
  assertEquals(expandHome("./dest"), "./dest");
  assertEquals(expandHome("/abs/dest"), "/abs/dest");
  assertEquals(expandHome("~user/dest"), "~user/dest");
});

Deno.test("expandHome throws when HOME is unset", () => {
  const original = Deno.env.get("HOME");
  Deno.env.delete("HOME");
  try {
    assertThrows(() => expandHome("~/foo"), Error, "HOME");
  } finally {
    if (original !== undefined) Deno.env.set("HOME", original);
  }
});

Deno.test("copySkillTo copies a fresh directory", async () => {
  const root = await Deno.makeTempDir();
  try {
    const source = join(root, "source");
    const target = join(root, "target");
    await Deno.mkdir(source);
    await Deno.writeTextFile(join(source, "SKILL.md"), "hello");

    await copySkillTo(source, target, { overwrite: false });

    assertEquals(await Deno.readTextFile(join(target, "SKILL.md")), "hello");
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("copySkillTo with overwrite removes stale files instead of merging", async () => {
  const root = await Deno.makeTempDir();
  try {
    const source = join(root, "source");
    const target = join(root, "target");
    await Deno.mkdir(source);
    await Deno.writeTextFile(join(source, "SKILL.md"), "updated");

    // Pre-existing target has a file the new source no longer has.
    await Deno.mkdir(target);
    await Deno.writeTextFile(join(target, "SKILL.md"), "old");
    await Deno.writeTextFile(join(target, "stale.md"), "leftover");

    await copySkillTo(source, target, { overwrite: true });

    assertEquals(await Deno.readTextFile(join(target, "SKILL.md")), "updated");
    assertEquals(await exists(join(target, "stale.md")), false);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});
