import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { Bookmark, bookmarks, InsertUser, listeningHistory, userFavorites, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listFavoriteBookIds(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ bookId: userFavorites.bookId }).from(userFavorites).where(eq(userFavorites.userId, userId));
}

export async function toggleFavoriteBook(userId: number, bookId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(userFavorites).where(and(eq(userFavorites.userId, userId), eq(userFavorites.bookId, bookId))).limit(1);
  if (existing.length) {
    await db.delete(userFavorites).where(eq(userFavorites.id, existing[0].id));
    return { bookId, isFavorite: false };
  }
  await db.insert(userFavorites).values({ userId, bookId });
  return { bookId, isFavorite: true };
}

export async function listListeningHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(listeningHistory).where(eq(listeningHistory.userId, userId)).orderBy(desc(listeningHistory.lastListenedAt)).limit(20);
}

export async function saveListeningHistory(userId: number, input: { bookId: string; chapterId: number; progress: number; positionSeconds: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const positionSeconds = Math.max(0, Math.round(input.positionSeconds));
  await db.insert(listeningHistory).values({ userId, bookId: input.bookId, chapterId: input.chapterId, progress: Math.round(input.progress), positionSeconds, lastListenedAt: new Date() }).onDuplicateKeyUpdate({ set: { chapterId: input.chapterId, progress: Math.round(input.progress), positionSeconds, lastListenedAt: new Date() } });
  return { success: true, positionSeconds } as const;
}

export async function listBookmarks(userId: number, bookId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookmarks).where(and(eq(bookmarks.userId, userId), eq(bookmarks.bookId, bookId))).orderBy(desc(bookmarks.createdAt));
}

export async function addBookmark(userId: number, input: { bookId: string; chapterId: number; positionSeconds: number; note?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(bookmarks).values({ userId, bookId: input.bookId, chapterId: input.chapterId, positionSeconds: Math.round(input.positionSeconds), note: input.note || null });
  return { success: true } as const;
}

export async function deleteBookmark(userId: number, bookmarkId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(bookmarks).where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId)));
  return { success: true } as const;
}
