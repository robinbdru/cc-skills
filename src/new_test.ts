import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findSkillConflict, scaffoldSkill, skillExists, skillStub, validateSkillName } from "./new.ts";

test("validateSkillName accepts hyphenated lowercase names, with or without a group", () => {
  validateSkillName("new-skill");
  validateSkillName("group/new-skill");
});

test("validateSkillName rejects invalid segments", () => {
  for (const name of ["New-Skill", "new_skill", "new skill", "", "group//skill", "/skill", "skill/", "..", "."]) {
    expect(() => validateSkillName(name)).toThrow("Invalid skill name");
  }
});

test("scaffoldSkill creates the directory and a SKILL.md stub", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    const dir = await scaffoldSkill(root, "new-skill");
    expect(dir).toEqual(join(root, "new-skill"));
    const content = await readFile(join(dir, "SKILL.md"), "utf8");
    expect(content.startsWith("---\nname: new-skill")).toEqual(true);
    expect(content.includes("Your skill instructions here...")).toEqual(true);
  } finally {
    await rm(root, { recursive: true });
  }
});

test("skillStub fills in the name field from the template and keeps the rest", async () => {
  const stub = await skillStub("new-skill");
  expect(stub.startsWith("---\nname: new-skill")).toEqual(true);
  expect(stub.includes("description:")).toEqual(true);
  expect(stub.includes("Your skill instructions here...")).toEqual(true);
});

test("skillStub uses the leaf name for a grouped skill", async () => {
  const stub = await skillStub("group/new-skill");
  expect(stub.startsWith("---\nname: new-skill")).toEqual(true);
});

test("scaffoldSkill creates nested group directories", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    const dir = await scaffoldSkill(root, "group/new-skill");
    expect(dir).toEqual(join(root, "group", "new-skill"));
    expect(await skillExists(root, "group/new-skill")).toEqual(true);
  } finally {
    await rm(root, { recursive: true });
  }
});

test("scaffoldSkill overwrites an existing SKILL.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    await scaffoldSkill(root, "new-skill");
    await writeFile(join(root, "new-skill", "SKILL.md"), "stale content");

    await scaffoldSkill(root, "new-skill");

    const content = await readFile(join(root, "new-skill", "SKILL.md"), "utf8");
    expect(content.includes("stale content")).toEqual(false);
  } finally {
    await rm(root, { recursive: true });
  }
});

test("skillExists is false when there's no SKILL.md yet", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    expect(await skillExists(root, "new-skill")).toEqual(false);
  } finally {
    await rm(root, { recursive: true });
  }
});

test("findSkillConflict detects an ancestor that's already a skill", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    await scaffoldSkill(root, "existing-skill");
    expect(await findSkillConflict(root, "existing-skill/nested")).toEqual("existing-skill");
  } finally {
    await rm(root, { recursive: true });
  }
});

test("findSkillConflict returns undefined for a fresh group or top-level name", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    expect(await findSkillConflict(root, "new-skill")).toBeUndefined();
    expect(await findSkillConflict(root, "group/new-skill")).toBeUndefined();
  } finally {
    await rm(root, { recursive: true });
  }
});
