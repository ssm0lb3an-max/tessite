import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type UserRole = "public_relations" | "directors_office" | "public_relations_lead" | "none";

export const accessKeys = pgTable("access_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  role: text("role").notNull(),
  used: boolean("used").notNull().default(false),
  assignedTo: text("assigned_to"),
  username: text("username"),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyId: varchar("key_id").notNull().references(() => accessKeys.id),
  password: text("password").notNull(),
  role: text("role").notNull(),
});

export const photoSections = pgTable("photo_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  photo: text("photo").notNull(),
  category: text("category").notNull().default("Events"),
  createdBy: varchar("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`now()`),
});

export const pageContent = pgTable("page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  page: text("page").notNull(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  content: text("content").notNull(),
  updatedBy: varchar("updated_by").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`now()`),
});

export const insertAccessKeySchema = createInsertSchema(accessKeys).omit({
  id: true,
});

export const insertUserSchema = z.object({
  keyId: z.string(),
  password: z.string().min(6),
});

export const insertPhotoSectionSchema = createInsertSchema(photoSections).omit({
  id: true,
  createdBy: true,
  createdAt: true,
}).extend({
  title: z.string().min(1),
  description: z.string().min(1),
  photo: z.string().min(1),
  category: z.enum(["All", "Operations", "Training", "Patrol", "Medical", "Team", "Events"]).default("Events"),
});

export const insertPageContentSchema = z.object({
  page: z.string().min(1),
  section: z.string().min(1),
  key: z.string().min(1),
  content: z.string().min(1),
});

export type InsertAccessKey = z.infer<typeof insertAccessKeySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPhotoSection = z.infer<typeof insertPhotoSectionSchema>;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type AccessKey = typeof accessKeys.$inferSelect;
export type User = typeof users.$inferSelect;
export type PhotoSection = typeof photoSections.$inferSelect;
export type PageContent = typeof pageContent.$inferSelect;
