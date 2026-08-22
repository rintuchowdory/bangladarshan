import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { addBookmark, deleteBookmark, listBookmarks, listFavoriteBookIds, listListeningHistory, saveListeningHistory, toggleFavoriteBook } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  library: router({
    favorites: protectedProcedure.query(({ ctx }) => listFavoriteBookIds(ctx.user.id)),
    toggleFavorite: protectedProcedure.input(z.object({ bookId: z.string().min(1).max(120) })).mutation(({ ctx, input }) => toggleFavoriteBook(ctx.user.id, input.bookId)),
    history: protectedProcedure.query(({ ctx }) => listListeningHistory(ctx.user.id)),
    saveHistory: protectedProcedure.input(z.object({ bookId: z.string().min(1).max(120), chapterId: z.number().int().positive(), progress: z.number().int().min(0).max(100), positionSeconds: z.number().int().min(0) })).mutation(({ ctx, input }) => saveListeningHistory(ctx.user.id, input)),
    bookmarks: protectedProcedure.input(z.object({ bookId: z.string().min(1).max(120) })).query(({ ctx, input }) => listBookmarks(ctx.user.id, input.bookId)),
    addBookmark: protectedProcedure.input(z.object({ bookId: z.string().min(1).max(120), chapterId: z.number().int().positive(), positionSeconds: z.number().int().min(0), note: z.string().max(500).optional() })).mutation(({ ctx, input }) => addBookmark(ctx.user.id, input)),
    deleteBookmark: protectedProcedure.input(z.object({ bookmarkId: z.number().int().positive() })).mutation(({ ctx, input }) => deleteBookmark(ctx.user.id, input.bookmarkId)),
  }),
});

export type AppRouter = typeof appRouter;
