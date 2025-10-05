// Initialize default admin user
import { storage } from "./storage";
import { hashPassword } from "./auth";

const DEFAULT_ADMIN_USERNAME = process.env.DEFAULT_ADMIN_USERNAME || "admin";

export async function initializeAdmin() {
  try {
    const existingAdmin = await storage.getAdminByUsername(DEFAULT_ADMIN_USERNAME);
    
    if (!existingAdmin) {
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
      
      if (!adminPassword) {
        console.error("❌ DEFAULT_ADMIN_PASSWORD environment variable is not set. Cannot create admin user.");
        console.error("   Please set DEFAULT_ADMIN_PASSWORD in Replit Secrets.");
        return;
      }
      
      const hashedPassword = await hashPassword(adminPassword);
      await storage.createAdmin({
        username: DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
      });
      console.log(`✅ Default admin user created: username="${DEFAULT_ADMIN_USERNAME}"`);
      console.log("⚠️  Please change the default password after first login!");
    } else {
      console.log("✓ Admin user already exists");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
}
