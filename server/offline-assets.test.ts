import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("offline PWA assets", () => {
  it("defines an installable manifest", async () => {
    const manifest = JSON.parse(await readFile(path.join(root, "client/public/manifest.webmanifest"), "utf8"));
    expect(manifest.name).toBe("BanglaDarshan");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
  });

  it("includes app-shell and audio caching behavior", async () => {
    const worker = await readFile(path.join(root, "client/public/sw.js"), "utf8");
    expect(worker).toContain("caches.open");
    expect(worker).toContain("request.destination === \"audio\"");
    expect(worker).toContain("self.skipWaiting");
  });
});
