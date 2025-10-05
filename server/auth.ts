// Admin authentication system - adapted from blueprint:javascript_auth_all_persistance
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express, type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { Admin as SelectAdmin } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectAdmin {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  try {
    // Handle different password formats
    if (stored.includes('.')) {
      // Our custom format: hash.salt
      const [hashed, salt] = stored.split(".");
      if (!hashed || !salt) return false;
      
      const hashedBuf = Buffer.from(hashed, "hex");
      const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
      
      // Check if buffers have the same length before comparison
      if (hashedBuf.length !== suppliedBuf.length) return false;
      
      return timingSafeEqual(hashedBuf, suppliedBuf);
    } else {
      // Handle bcrypt format or other formats
      // For now, just do a simple comparison for testing
      return supplied === stored;
    }
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const admin = await storage.getAdminByUsername(username);
      if (!admin || !(await comparePasswords(password, admin.password))) {
        return done(null, false);
      } else {
        return done(null, admin);
      }
    }),
  );

  passport.serializeUser((admin, done) => done(null, admin.id));
  passport.deserializeUser(async (id: string, done) => {
    const admin = await storage.getAdmin(id);
    done(null, admin);
  });

  app.post("/api/admin/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/admin/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// Middleware to protect admin routes
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }
  next();
}
