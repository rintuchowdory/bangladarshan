import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const userFavorites = mysqlTable("userFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: varchar("bookId", { length: 120 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ userBookUnique: uniqueIndex("userFavorites_userId_bookId_unique").on(table.userId, table.bookId) }));

export const listeningHistory = mysqlTable("listeningHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: varchar("bookId", { length: 120 }).notNull(),
  chapterId: int("chapterId").notNull().default(1),
  progress: int("progress").notNull().default(0),
  lastListenedAt: timestamp("lastListenedAt").defaultNow().notNull(),
}, (table) => ({ userBookUnique: uniqueIndex("listeningHistory_userId_bookId_unique").on(table.userId, table.bookId) }));

export const bookmarks = mysqlTable("bookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: varchar("bookId", { length: 120 }).notNull(),
  chapterId: int("chapterId").notNull(),
  positionSeconds: int("positionSeconds").notNull().default(0),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ userBookmarkUnique: uniqueIndex("bookmarks_userId_bookId_chapterId_position_unique").on(table.userId, table.bookId, table.chapterId, table.positionSeconds) }));

export type UserFavorite = typeof userFavorites.$inferSelect;
export type ListeningHistory = typeof listeningHistory.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;