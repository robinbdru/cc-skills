import { assertEquals } from "@std/assert";
import { join } from "@std/path";
import { discoverSkills, targetDirName } from "./skills.ts";

async function makeFixture(): Promise<string> {
  const root = await Deno.makeTempDir();

  // Standalone skill.
  await Deno.mkdir(join(root, "commit"), { recursive: true });
  await Deno.writeTextFile(join(root, "commit", "SKILL.md"), "---\n---\n");

  // Group with one nested skill.
  await Deno.mkdir(join(root, "plan", "research"), { recursive: true });
  await Deno.writeTextFile(join(root, "plan", "research", "SKILL.md"), "---\n---\n");

  // Empty placeholder directory — neither a skill nor a populated group.
  await Deno.mkdir(join(root, "build"), { recursive: true });

  return root;
}

Deno.test("discoverSkills finds leaf skills and skips groups and empty placeholders", async () => {
  const root = await makeFixture();
  try {
    const skills = await discoverSkills(root);
    assertEquals(skills.map((s) => s.name), ["commit", "plan/research"]);
    assertEquals(skills[0].dir, join(root, "commit"));
    assertEquals(skills[1].dir, join(root, "plan", "research"));
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("targetDirName with no options returns the skill's own name", () => {
  assertEquals(targetDirName({ name: "commit", dir: "/unused" }), "commit");
  assertEquals(targetDirName({ name: "plan/research", dir: "/unused" }), "research");
});

Deno.test("targetDirName prepends the prefix", () => {
  assertEquals(targetDirName({ name: "commit", dir: "/unused" }, { prefix: "rb" }), "rb-commit");
  assertEquals(targetDirName({ name: "plan/research", dir: "/unused" }, { prefix: "rb" }), "rb-research");
});
