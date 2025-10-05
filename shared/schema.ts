import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, timestamp, int, json, char, boolean, serial } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Admin users table
export const admins = mysqlTable("admins", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Products table
export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  category: varchar("category", { length: 50 }).notNull(), // 'blinds', 'curtains', 'commercial'
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 500 }),
  features: json("features"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Portfolio table
export const portfolio = mysqlTable("portfolio", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  client: varchar("client", { length: 255 }),
  location: varchar("location", { length: 255 }),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPortfolioSchema = createInsertSchema(portfolio).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolio.$inferSelect;

// Leads table
export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  projectDetails: text("project_details"),
  status: varchar("status", { length: 20 }).default("new").notNull(), // 'new', 'contacted', 'converted', 'archived'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// SEO Settings table
export const seoSettings = mysqlTable("seo_settings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  page: varchar("page", { length: 50 }).notNull().unique(), // 'home', 'about', 'products', 'portfolio', 'contact'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  ogTitle: varchar("og_title", { length: 255 }),
  ogDescription: text("og_description"),
  keywords: json("keywords"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;

// Page Views table for analytics
export const pageViews = mysqlTable("page_views", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  page: varchar("page", { length: 255 }).notNull(),
  userAgent: text("user_agent"),
  referrer: varchar("referrer", { length: 500 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  timestamp: true,
});

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

// Brochures table
export const brochures = mysqlTable("brochures", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  pdfPath: varchar("pdf_path", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBrochureSchema = createInsertSchema(brochures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBrochure = z.infer<typeof insertBrochureSchema>;
export type Brochure = typeof brochures.$inferSelect;
