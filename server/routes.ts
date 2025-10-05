import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, requireAdmin } from "./auth";
import { 
  insertProductSchema, 
  insertPortfolioSchema, 
  insertLeadSchema,
  insertSeoSettingsSchema,
  insertPageViewSchema,
  insertBrochureSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication - creates /api/admin/login, /api/admin/logout, /api/admin/me
  setupAuth(app);

  // Public routes
  
  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  
  // Track page views (public)
  app.post("/api/pageview", async (req, res) => {
    try {
      const data = insertPageViewSchema.parse(req.body);
      await storage.createPageView(data);
      res.sendStatus(200);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  // Get products (public)
  app.get("/api/products", async (req, res) => {
    const { category } = req.query;
    const products = category 
      ? await storage.getProductsByCategory(category as string)
      : await storage.getAllProducts();
    res.json(products);
  });

  // Get portfolio (public)
  app.get("/api/portfolio", async (req, res) => {
    const items = await storage.getAllPortfolio();
    res.json(items);
  });

  // Submit lead from contact form (public)
  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(data);
      res.json(lead);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  // Get SEO settings by page (public)
  app.get("/api/seo/:page", async (req, res) => {
    const settings = await storage.getSeoSettingsByPage(req.params.page);
    if (!settings) {
      return res.status(404).send("SEO settings not found");
    }
    res.json(settings);
  });

  // Get brochures (public)
  app.get("/api/brochures", async (req, res) => {
    const brochures = await storage.getAllBrochures();
    res.json(brochures);
  });

  // Protected admin routes
  
  // Products management
  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const productData = {
        ...data,
        features: data.features || [],
        image: data.image || null,
      };
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertProductSchema.partial().parse(req.body);
      // Ensure image defaults to null if empty string
      const productData = {
        ...data,
        image: data.image === "" ? null : data.image,
      };
      const product = await storage.updateProduct(req.params.id, productData);
      res.json(product);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).send(error.message);
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.sendStatus(200);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).send(error.message);
    }
  });

  // Portfolio management
  app.get("/api/admin/portfolio", requireAdmin, async (req, res) => {
    const items = await storage.getAllPortfolio();
    res.json(items);
  });

  app.post("/api/admin/portfolio", requireAdmin, async (req, res) => {
    try {
      const data = insertPortfolioSchema.parse(req.body);
      // Ensure image defaults to null if empty string
      const portfolioData = {
        ...data,
        image: data.image || null,
      };
      const item = await storage.createPortfolioItem(portfolioData);
      res.json(item);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  app.put("/api/admin/portfolio/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertPortfolioSchema.partial().parse(req.body);
      // Ensure image defaults to null if empty string
      const portfolioData = {
        ...data,
        image: data.image === "" ? null : data.image,
      };
      const item = await storage.updatePortfolioItem(req.params.id, portfolioData);
      res.json(item);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).send(error.message);
    }
  });

  app.delete("/api/admin/portfolio/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePortfolioItem(req.params.id);
      res.sendStatus(200);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).send(error.message);
    }
  });

  // Leads management
  app.get("/api/admin/leads", requireAdmin, async (req, res) => {
    const { status } = req.query;
    const leads = status
      ? await storage.getLeadsByStatus(status as string)
      : await storage.getAllLeads();
    res.json(leads);
  });

  app.put("/api/admin/leads/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      // Validate status is one of the allowed values
      const validStatuses = ["new", "contacted", "converted", "archived"];
      if (!validStatuses.includes(status)) {
        return res.status(400).send(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      }
      const lead = await storage.updateLeadStatus(req.params.id, status);
      res.json(lead);
    } catch (error: any) {
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).send(error.message);
    }
  });

  app.delete("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteLead(req.params.id);
      res.sendStatus(200);
    } catch (error: any) {
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).send(error.message);
    }
  });

  // SEO management
  app.get("/api/admin/seo", requireAdmin, async (req, res) => {
    const settings = await storage.getAllSeoSettings();
    res.json(settings);
  });

  app.get("/api/admin/seo/:page", requireAdmin, async (req, res) => {
    const settings = await storage.getSeoSettingsByPage(req.params.page);
    if (!settings) {
      return res.json({ page: req.params.page, title: "", description: "", keywords: "", ogImage: "" });
    }
    res.json(settings);
  });

  app.post("/api/admin/seo", requireAdmin, async (req, res) => {
    try {
      const data = insertSeoSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateSeoSettings(data);
      res.json(settings);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  app.put("/api/admin/seo/:page", requireAdmin, async (req, res) => {
    try {
      const existing = await storage.getSeoSettingsByPage(req.params.page);
      if (!existing) {
        return res.status(404).send("SEO settings not found");
      }
      
      const data = insertSeoSettingsSchema.partial().extend({
        page: z.string().optional(),
      }).parse({ ...req.body, page: req.params.page });
      
      const merged = {
        page: req.params.page,
        title: data.title ?? existing.title,
        description: data.description ?? existing.description,
        ogTitle: data.ogTitle ?? existing.ogTitle,
        ogDescription: data.ogDescription ?? existing.ogDescription,
        keywords: data.keywords ?? existing.keywords,
      };
      
      const settings = await storage.createOrUpdateSeoSettings(merged);
      res.json(settings);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  // Brochure management
  app.get("/api/admin/brochures", requireAdmin, async (req, res) => {
    const brochures = await storage.getAllBrochures();
    res.json(brochures);
  });

  app.post("/api/admin/brochures", requireAdmin, async (req, res) => {
    try {
      const data = insertBrochureSchema.parse(req.body);
      const brochure = await storage.createBrochure(data);
      res.json(brochure);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  app.put("/api/admin/brochures/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertBrochureSchema.partial().parse(req.body);
      const brochure = await storage.updateBrochure(req.params.id, data);
      res.json(brochure);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).send(error.message);
    }
  });

  app.delete("/api/admin/brochures/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBrochure(req.params.id);
      res.sendStatus(200);
    } catch (error: any) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).send(error.message);
    }
  });

  // Analytics
  app.get("/api/analytics/stats", async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalProducts = (await storage.getAllProducts()).length;
    const totalPortfolio = (await storage.getAllPortfolio()).length;
    const allLeads = await storage.getAllLeads();
    const newLeads = allLeads.filter((lead: any) => lead.status === "new").length;
    const pageViews30Days = await storage.getPageViewsCount(thirtyDaysAgo);
    const uniqueVisitors = await storage.getUniqueVisitorsCount(thirtyDaysAgo);
    
    res.json({
      totalProducts,
      totalPortfolio,
      newLeads,
      pageViews30Days,
      uniqueVisitors,
    });
  });

  app.get("/api/analytics/page-views", async (req, res) => {
    const views = await storage.getRecentPageViews(50);
    res.json(views);
  });

  app.get("/api/admin/analytics/overview", requireAdmin, async (req, res) => {
    const { since } = req.query;
    const sinceDate = since ? new Date(since as string) : undefined;
    
    const totalViews = await storage.getPageViewsCount(sinceDate);
    const topPages = await storage.getTopPages(10, sinceDate);
    const totalLeads = (await storage.getAllLeads()).length;
    
    res.json({
      totalViews,
      topPages,
      totalLeads,
    });
  });

  app.get("/api/admin/analytics/pageviews", requireAdmin, async (req, res) => {
    const { page, since } = req.query;
    const sinceDate = since ? new Date(since as string) : undefined;
    
    if (page) {
      const views = await storage.getPageViewsByPage(page as string, sinceDate);
      res.json(views);
    } else {
      const topPages = await storage.getTopPages(20, sinceDate);
      res.json(topPages);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
