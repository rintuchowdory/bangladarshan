import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("audio sources", () => {
  it("uses local clear speech assets for every catalog book", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain("/manus-storage/bangladarshan-philosophy-voice_d5d3ce87.wav");
    expect(home).toContain("/manus-storage/bangladarshan-river-voice_bc8b7ca4.wav");
    expect(home).toContain("/manus-storage/bangladarshan-attention-voice_4c80f226.wav");
    expect(home).not.toContain("soundhelix.com");
    expect(home).not.toContain("archive.org/download/philosophy_2501_librivox");
  });
});
