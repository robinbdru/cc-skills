import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverSkills, targetDirName } from "./skills.ts";

async function makeFixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));

  // Standalone skill.
  await mkdir(join(root, "commit"), { recursive: true });
  await writeFile(join(root, "commit", "SKILL.md"), "---\n---\n");

  // Group with one nested skill.
  await mkdir(join(root, "plan", "research"), { recursive: true });
  await writeFile(join(root, "plan", "research", "SKILL.md"), "---\n---\n");

  // Empty placeholder directory — neither a skill nor a populated group.
  await mkdir(join(root, "build"), { recursive: true });

  return root;
}

test("discoverSkills finds leaf skills and skips groups and empty placeholders", async () => {
  const root = await makeFixture();
  try {
    const skills = await discoverSkills(root);
    expect(skills.map((s) => s.name)).toEqual(["commit", "plan/research"]);
    expect(skills[0].dir).toEqual(join(root, "commit"));
    expect(skills[1].dir).toEqual(join(root, "plan", "research"));
  } finally {
    await rm(root, { recursive: true });
  }
});

test("targetDirName with no options returns the skill's own name", () => {
  expect(targetDirName({ name: "commit", dir: "/unused" })).toEqual("commit");
  expect(targetDirName({ name: "plan/research", dir: "/unused" })).toEqual("research");
});

test("targetDirName prepends the prefix", () => {
  expect(targetDirName({ name: "commit", dir: "/unused" }, { prefix: "rb" })).toEqual("rb-commit");
  expect(targetDirName({ name: "plan/research", dir: "/unused" }, { prefix: "rb" })).toEqual("rb-research");
});
