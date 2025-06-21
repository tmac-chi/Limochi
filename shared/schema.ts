import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Filter types for sentence generation
export const filterCategories = z.enum(["level", "category", "tool", "style"]);

export const filterSelectionSchema = z.object({
  level: z.string(),
  category: z.array(z.string()).min(1).max(3),
  tool: z.union([z.string(), z.array(z.string())]).optional(),
  style: z.string().optional(),
  mood: z.string().optional(),
});

export type FilterSelection = z.infer<typeof filterSelectionSchema>;

// Photo data from Unsplash
export const photoSchema = z.object({
  id: z.string(),
  urls: z.object({
    small: z.string(),
    regular: z.string(),
  }),
  alt_description: z.string().nullable(),
  user: z.object({
    name: z.string(),
  }),
});

export type Photo = z.infer<typeof photoSchema>;

// Sentence generation request/response
export const generateContentSchema = z.object({
  filters: filterSelectionSchema,
});

export const generatedContentSchema = z.object({
  sentence: z.string(),
  photos: z.array(photoSchema),
  keywords: z.array(z.string()),
});

export type GenerateContentRequest = z.infer<typeof generateContentSchema>;
export type GeneratedContent = z.infer<typeof generatedContentSchema>;