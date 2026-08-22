import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("library access control", () => {
  it("requires an authenticated user for favorites", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.library.favorites()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires an authenticated user for bookmarks", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.library.bookmarks({ bookId: "Philosophy 101" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
