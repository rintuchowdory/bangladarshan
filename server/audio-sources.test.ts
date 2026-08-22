import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("audio sources", () => {
  it("uses spoken freely licensed sources for all catalog books", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain("upload.wikimedia.org/wikipedia/commons/6/6b/Spoken_Wikipedia_-_M-105.ogg");
    expect(home).toContain("archive.org/download/philosophy_2501_librivox/philosophy_02_russell_64kb.mp3");
    expect(home).toContain("archive.org/download/philosophy_2501_librivox/philosophy_03_russell_64kb.mp3");
    expect(home).not.toContain("soundhelix.com");
  });
});
