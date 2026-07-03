import { assertEquals, assertThrows } from "@std/assert";
import { join } from "@std/path";
import { findSkillConflict, scaffoldSkill, skillExists, skillStub, validateSkillName } from "./new.ts";

Deno.test("validateSkillName accepts hyphenated lowercase names, with or without a group", () => {
  validateSkillName("new-skill");
  validateSkillName("group/new-skill");
});

Deno.test("validateSkillName rejects invalid segments", () => {
  for (const name of ["New-Skill", "new_skill", "new skill", "", "group//skill", "/skill", "skill/", "..", "."]) {
    assertThrows(() => validateSkillName(name), Error, "Invalid skill name");
  }
});

Deno.test("scaffoldSkill creates the directory and a SKILL.md stub", async () => {
  const root = await Deno.makeTempDir();
  try {
    const dir = await scaffoldSkill(root, "new-skill");
    assertEquals(dir, join(root, "new-skill"));
    const content = await Deno.readTextFile(join(dir, "SKILL.md"));
    assertEquals(content.startsWith("---\nname: new-skill"), true);
    assertEquals(content.includes("Your skill instructions here..."), true);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("skillStub fills in the name field from the template and keeps the rest", async () => {
  const stub = await skillStub("new-skill");
  assertEquals(stub.startsWith("---\nname: new-skill"), true);
  assertEquals(stub.includes("description:"), true);
  assertEquals(stub.includes("Your skill instructions here..."), true);
});

Deno.test("skillStub uses the leaf name for a grouped skill", async () => {
  const stub = await skillStub("group/new-skill");
  assertEquals(stub.startsWith("---\nname: new-skill"), true);
});

Deno.test("scaffoldSkill creates nested group directories", async () => {
  const root = await Deno.makeTempDir();
  try {
    const dir = await scaffoldSkill(root, "group/new-skill");
    assertEquals(dir, join(root, "group", "new-skill"));
    assertEquals(await skillExists(root, "group/new-skill"), true);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("scaffoldSkill overwrites an existing SKILL.md", async () => {
  const root = await Deno.makeTempDir();
  try {
    await scaffoldSkill(root, "new-skill");
    await Deno.writeTextFile(join(root, "new-skill", "SKILL.md"), "stale content");

    await scaffoldSkill(root, "new-skill");

    const content = await Deno.readTextFile(join(root, "new-skill", "SKILL.md"));
    assertEquals(content.includes("stale content"), false);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("skillExists is false when there's no SKILL.md yet", async () => {
  const root = await Deno.makeTempDir();
  try {
    assertEquals(await skillExists(root, "new-skill"), false);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("findSkillConflict detects an ancestor that's already a skill", async () => {
  const root = await Deno.makeTempDir();
  try {
    await scaffoldSkill(root, "existing-skill");
    assertEquals(await findSkillConflict(root, "existing-skill/nested"), "existing-skill");
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});

Deno.test("findSkillConflict returns undefined for a fresh group or top-level name", async () => {
  const root = await Deno.makeTempDir();
  try {
    assertEquals(await findSkillConflict(root, "new-skill"), undefined);
    assertEquals(await findSkillConflict(root, "group/new-skill"), undefined);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
});
