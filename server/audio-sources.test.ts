import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("audio sources", () => {
  it("uses real spoken-word audiobook chapters for every catalog book", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain("https://archive.org/download/philosophy_2501_librivox/philosophy_01_russell_128kb.mp3");
    expect(home).toContain("https://archive.org/download/philosophy_2501_librivox/philosophy_02_russell_128kb.mp3");
    expect(home).toContain("https://archive.org/download/philosophy_2501_librivox/philosophy_03_russell_128kb.mp3");
    expect(home).not.toContain("bangladarshan-philosophy-voice_d5d3ce87.wav");
    expect(home).not.toContain("bangladarshan-philosophy-clear-en_b1fb6d31.wav");
    expect(home).not.toContain("soundhelix.com");
    expect(home).not.toContain("archive.org/download/philosophy_2501_librivox/Philosophy_2501_librivox_64kb.mp3");
  });
});
