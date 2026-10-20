import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { copySkillTo, expandHome } from "./copy.ts";
import { exists } from "./fs.ts";

test("expandHome expands a leading ~ using HOME", () => {
  const original = process.env.HOME;
  process.env.HOME = "/home/testuser";
  try {
    expect(expandHome("~")).toEqual("/home/testuser");
    expect(expandHome("~/.claude/skills")).toEqual("/home/testuser/.claude/skills");
  } finally {
    if (original === undefined) delete process.env.HOME;
    else process.env.HOME = original;
  }
});

test("expandHome leaves other paths unchanged", () => {
  expect(expandHome("./dest")).toEqual("./dest");
  expect(expandHome("/abs/dest")).toEqual("/abs/dest");
  expect(expandHome("~user/dest")).toEqual("~user/dest");
});

test("expandHome throws when HOME is unset", () => {
  const original = process.env.HOME;
  delete process.env.HOME;
  try {
    expect(() => expandHome("~/foo")).toThrow("HOME");
  } finally {
    if (original !== undefined) process.env.HOME = original;
  }
});

test("copySkillTo copies a fresh directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    const source = join(root, "source");
    const target = join(root, "target");
    await mkdir(source);
    await writeFile(join(source, "SKILL.md"), "hello");

    await copySkillTo(source, target, { overwrite: false });

    expect(await readFile(join(target, "SKILL.md"), "utf8")).toEqual("hello");
  } finally {
    await rm(root, { recursive: true });
  }
});

test("copySkillTo with overwrite removes stale files instead of merging", async () => {
  const root = await mkdtemp(join(tmpdir(), "cc-skills-"));
  try {
    const source = join(root, "source");
    const target = join(root, "target");
    await mkdir(source);
    await writeFile(join(source, "SKILL.md"), "updated");

    // Pre-existing target has a file the new source no longer has.
    await mkdir(target);
    await writeFile(join(target, "SKILL.md"), "old");
    await writeFile(join(target, "stale.md"), "leftover");

    await copySkillTo(source, target, { overwrite: true });

    expect(await readFile(join(target, "SKILL.md"), "utf8")).toEqual("updated");
    expect(await exists(join(target, "stale.md"))).toEqual(false);
  } finally {
    await rm(root, { recursive: true });
  }
});
