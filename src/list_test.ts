import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listSkills, readSkillDescription } from "./list.ts";

test("readSkillDescription extracts description from frontmatter", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    await writeFile(
      join(root, "SKILL.md"),
      "---\ndescription: Does the thing.\nallowed-tools: Read Write\n---\nBody.\n",
    );
    expect(await readSkillDescription(root)).toEqual("Does the thing.");
  } finally {
    await rm(root, { recursive: true });
  }
});

test("readSkillDescription returns empty string for an empty SKILL.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    await writeFile(join(root, "SKILL.md"), "");
    expect(await readSkillDescription(root)).toEqual("");
  } finally {
    await rm(root, { recursive: true });
  }
});

test("readSkillDescription returns empty string for frontmatter with no description", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    await writeFile(join(root, "SKILL.md"), "---\n---\n");
    expect(await readSkillDescription(root)).toEqual("");
  } finally {
    await rm(root, { recursive: true });
  }
});

test("listSkills combines discovery with parsed descriptions, sorted by name", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    await mkdir(join(root, "commit"), { recursive: true });
    await writeFile(
      join(root, "commit", "SKILL.md"),
      "---\ndescription: Make commits.\n---\n",
    );
    await mkdir(join(root, "plan", "research"), { recursive: true });
    await writeFile(join(root, "plan", "research", "SKILL.md"), "");

    const result = await listSkills(root);
    expect(result).toEqual([
      { name: "commit", dir: join(root, "commit"), description: "Make commits." },
      { name: "plan/research", dir: join(root, "plan", "research"), description: "" },
    ]);
  } finally {
    await rm(root, { recursive: true });
  }
});
