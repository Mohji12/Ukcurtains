import { defineConfig } from "drizzle-kit";

// Use the provided MySQL connection string
const DATABASE_URL = "mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior";

// Convert the URL to MySQL2 format for Drizzle
const connectionString = DATABASE_URL.replace('mysql+pymysql://', 'mysql://');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
