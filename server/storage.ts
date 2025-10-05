import { 
  type User, type InsertUser,
  type Admin, type InsertAdmin,
  type Product, type InsertProduct,
  type Portfolio, type InsertPortfolio,
  type Lead, type InsertLead,
  type SeoSettings, type InsertSeoSettings,
  type PageView, type InsertPageView,
  type Brochure, type InsertBrochure,
  admins, products, portfolio, leads, seoSettings, pageViews, brochures
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import session from "express-session";
import MemoryStore from "memorystore";

export interface IStorage {
  sessionStore: session.Store;
  
  // Admin methods
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Portfolio methods
  getAllPortfolio(): Promise<Portfolio[]>;
  getPortfolioItem(id: string): Promise<Portfolio | undefined>;
  createPortfolioItem(item: InsertPortfolio): Promise<Portfolio>;
  updatePortfolioItem(id: string, item: Partial<InsertPortfolio>): Promise<Portfolio>;
  deletePortfolioItem(id: string): Promise<void>;

  // Lead methods
  getAllLeads(): Promise<Lead[]>;
  getLeadsByStatus(status: string): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLeadStatus(id: string, status: string): Promise<Lead>;
  deleteLead(id: string): Promise<void>;

  // SEO methods
  getAllSeoSettings(): Promise<SeoSettings[]>;
  getSeoSettingsByPage(page: string): Promise<SeoSettings | undefined>;
  createOrUpdateSeoSettings(settings: InsertSeoSettings): Promise<SeoSettings>;

  // Analytics methods
  createPageView(view: InsertPageView): Promise<PageView>;
  getRecentPageViews(limit: number): Promise<PageView[]>;
  getPageViewsByPage(page: string, since?: Date): Promise<PageView[]>;
  getPageViewsCount(since?: Date): Promise<number>;
  getUniqueVisitorsCount(since?: Date): Promise<number>;
  getTopPages(limit: number, since?: Date): Promise<{ page: string; count: number }[]>;

  // Brochure methods
  getAllBrochures(): Promise<Brochure[]>;
  getBrochure(id: string): Promise<Brochure | undefined>;
  createBrochure(brochure: InsertBrochure): Promise<Brochure>;
  updateBrochure(id: string, brochure: Partial<InsertBrochure>): Promise<Brochure>;
  deleteBrochure(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new (MemoryStore(session))({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // Admin methods
  async getAdmin(id: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    // First check if product exists
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Update the product
    await db.update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, id));
    
    // Return the updated product
    const updatedProduct = await this.getProduct(id);
    if (!updatedProduct) {
      throw new Error("Failed to retrieve updated product");
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    // First check if product exists
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Delete the product
    await db.delete(products).where(eq(products.id, id));
  }

  // Portfolio methods
  async getAllPortfolio(): Promise<Portfolio[]> {
    return await db.select().from(portfolio).orderBy(desc(portfolio.createdAt));
  }

  async getPortfolioItem(id: string): Promise<Portfolio | undefined> {
    const [item] = await db.select().from(portfolio).where(eq(portfolio.id, id));
    return item || undefined;
  }

  async createPortfolioItem(insertItem: InsertPortfolio): Promise<Portfolio> {
    const [item] = await db.insert(portfolio).values(insertItem).returning();
    return item;
  }

  async updatePortfolioItem(id: string, updateData: Partial<InsertPortfolio>): Promise<Portfolio> {
    // First check if portfolio item exists
    const existingItem = await this.getPortfolioItem(id);
    if (!existingItem) {
      throw new Error("Portfolio item not found");
    }

    // Update the portfolio item
    await db.update(portfolio)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(portfolio.id, id));
    
    // Return the updated portfolio item
    const updatedItem = await this.getPortfolioItem(id);
    if (!updatedItem) {
      throw new Error("Failed to retrieve updated portfolio item");
    }
    return updatedItem;
  }

  async deletePortfolioItem(id: string): Promise<void> {
    // First check if portfolio item exists
    const existingItem = await this.getPortfolioItem(id);
    if (!existingItem) {
      throw new Error("Portfolio item not found");
    }

    // Delete the portfolio item
    await db.delete(portfolio).where(eq(portfolio.id, id));
  }

  // Lead methods
  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await db.select().from(leads)
      .where(eq(leads.status, status))
      .orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async updateLeadStatus(id: string, status: string): Promise<Lead> {
    // First check if lead exists
    const existingLead = await this.getLead(id);
    if (!existingLead) {
      throw new Error("Lead not found");
    }

    // Update the lead status
    await db.update(leads)
      .set({ status })
      .where(eq(leads.id, id));
    
    // Return the updated lead
    const updatedLead = await this.getLead(id);
    if (!updatedLead) {
      throw new Error("Failed to retrieve updated lead");
    }
    return updatedLead;
  }

  async deleteLead(id: string): Promise<void> {
    // First check if lead exists
    const existingLead = await this.getLead(id);
    if (!existingLead) {
      throw new Error("Lead not found");
    }

    // Delete the lead
    await db.delete(leads).where(eq(leads.id, id));
  }

  // SEO methods
  async getAllSeoSettings(): Promise<SeoSettings[]> {
    return await db.select().from(seoSettings);
  }

  async getSeoSettingsByPage(page: string): Promise<SeoSettings | undefined> {
    const [settings] = await db.select().from(seoSettings).where(eq(seoSettings.page, page));
    return settings || undefined;
  }

  async createOrUpdateSeoSettings(insertSettings: InsertSeoSettings): Promise<SeoSettings> {
    const existing = await this.getSeoSettingsByPage(insertSettings.page);
    
    if (existing) {
      await db.update(seoSettings)
        .set({ ...insertSettings, updatedAt: new Date() })
        .where(eq(seoSettings.page, insertSettings.page));
      
      // Return the updated settings
      const updated = await this.getSeoSettingsByPage(insertSettings.page);
      if (!updated) {
        throw new Error("Failed to retrieve updated SEO settings");
      }
      return updated;
    } else {
      const [created] = await db.insert(seoSettings).values(insertSettings).returning();
      return created;
    }
  }

  // Analytics methods
  async createPageView(insertView: InsertPageView): Promise<PageView> {
    // For MySQL, we need to handle the insert differently
    const [result] = await db.insert(pageViews).values(insertView);
    // Get the inserted record by selecting the most recent one with matching data
    const [view] = await db.select().from(pageViews)
      .where(eq(pageViews.page, insertView.page))
      .orderBy(desc(pageViews.timestamp))
      .limit(1);
    return view;
  }

  async getRecentPageViews(limit: number): Promise<PageView[]> {
    return await db.select().from(pageViews)
      .orderBy(desc(pageViews.timestamp))
      .limit(limit);
  }

  async getPageViewsByPage(page: string, since?: Date): Promise<PageView[]> {
    const conditions = [eq(pageViews.page, page)];
    if (since) {
      conditions.push(gte(pageViews.timestamp, since));
    }
    return await db.select().from(pageViews)
      .where(and(...conditions))
      .orderBy(desc(pageViews.timestamp));
  }

  async getPageViewsCount(since?: Date): Promise<number> {
    const conditions = since ? [gte(pageViews.timestamp, since)] : [];
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(pageViews)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return Number(result[0]?.count || 0);
  }

  async getUniqueVisitorsCount(since?: Date): Promise<number> {
    const conditions = since ? [gte(pageViews.timestamp, since)] : [];
    const result = await db.select({ count: sql<number>`count(distinct user_agent)` })
      .from(pageViews)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return Number(result[0]?.count || 0);
  }

  async getTopPages(limit: number, since?: Date): Promise<{ page: string; count: number }[]> {
    const conditions = since ? [gte(pageViews.timestamp, since)] : [];
    const result = await db.select({
      page: pageViews.page,
      count: sql<number>`count(*)`,
    })
    .from(pageViews)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(pageViews.page)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
    
    return result.map(r => ({ page: r.page, count: Number(r.count) }));
  }

  // Brochure methods
  async getAllBrochures(): Promise<Brochure[]> {
    return await db.select().from(brochures).orderBy(desc(brochures.createdAt));
  }

  async getBrochure(id: string): Promise<Brochure | undefined> {
    const [brochure] = await db.select().from(brochures).where(eq(brochures.id, id));
    return brochure || undefined;
  }

  async createBrochure(insertBrochure: InsertBrochure): Promise<Brochure> {
    const [brochure] = await db.insert(brochures).values(insertBrochure).returning();
    return brochure;
  }

  async updateBrochure(id: string, updateData: Partial<InsertBrochure>): Promise<Brochure> {
    // First check if brochure exists
    const existingBrochure = await this.getBrochure(id);
    if (!existingBrochure) {
      throw new Error("Brochure not found");
    }

    // Update the brochure
    await db.update(brochures)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(brochures.id, id));
    
    // Return the updated brochure
    const updatedBrochure = await this.getBrochure(id);
    if (!updatedBrochure) {
      throw new Error("Failed to retrieve updated brochure");
    }
    return updatedBrochure;
  }

  async deleteBrochure(id: string): Promise<void> {
    // First check if brochure exists
    const existingBrochure = await this.getBrochure(id);
    if (!existingBrochure) {
      throw new Error("Brochure not found");
    }

    // Delete the brochure
    await db.delete(brochures).where(eq(brochures.id, id));
  }
}

export const storage = new DatabaseStorage();
