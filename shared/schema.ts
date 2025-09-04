import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const urls = pgTable("shortened_urls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalUrl: text("original_url").notNull(),
  shortCode: varchar("short_code", { length: 50 }).notNull().unique(),
  validityMinutes: integer("validity_minutes").default(30),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  clickCount: integer("click_count").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUrlSchema = createInsertSchema(urls).pick({
  originalUrl: true,
  shortCode: true,
  validityMinutes: true,
}).extend({
  originalUrl: z.string().url("Please enter a valid URL"),
  shortCode: z.string().regex(/^[a-zA-Z0-9]+$/, "Short code must be alphanumeric").optional(),
  validityMinutes: z.number().min(1, "Validity must be at least 1 minute").optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type ShortenedUrl = typeof urls.$inferSelect;
