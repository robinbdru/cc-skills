import { assertEquals } from "@std/assert";
import { join } from "@std/path";
import { listSkills, readSkillDescription } from "./list.ts";

Deno.test("readSkillDescription extracts description from frontmatter", async () => {
  const root = await Deno.makeTempDir();
  try {
    await Deno.writeTextFile(
      join(root, "SKILL.md"),
      "---\ndescription: Does the thing.\nallowed-tools: Read Write\n---\nBody.\n",
    );
    assertEquals(await readSkillDescription(root), "Does the thing.");
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("readSkillDescription returns empty string for an empty SKILL.md", async () => {
  const root = await Deno.makeTempDir();
  try {
    await Deno.writeTextFile(join(root, "SKILL.md"), "");
    assertEquals(await readSkillDescription(root), "");
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("readSkillDescription returns empty string for frontmatter with no description", async () => {
  const root = await Deno.makeTempDir();
  try {
    await Deno.writeTextFile(join(root, "SKILL.md"), "---\n---\n");
    assertEquals(await readSkillDescription(root), "");
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("listSkills combines discovery with parsed descriptions, sorted by name", async () => {
  const root = await Deno.makeTempDir();
  try {
    await Deno.mkdir(join(root, "commit"), { recursive: true });
    await Deno.writeTextFile(
      join(root, "commit", "SKILL.md"),
      "---\ndescription: Make commits.\n---\n",
    );
    await Deno.mkdir(join(root, "plan", "research"), { recursive: true });
    await Deno.writeTextFile(join(root, "plan", "research", "SKILL.md"), "");

    const result = await listSkills(root);
    assertEquals(result, [
      { name: "commit", dir: join(root, "commit"), description: "Make commits." },
      { name: "plan/research", dir: join(root, "plan", "research"), description: "" },
    ]);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});
