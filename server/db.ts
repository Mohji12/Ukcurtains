import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// Use the provided MySQL connection string
const DATABASE_URL = "mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior";

// Convert the URL to MySQL2 format
const connectionString = DATABASE_URL.replace('mysql+pymysql://', 'mysql://');

// Set session secret if not already set
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'nowest-interior-session-secret-2024';
}

export const pool = mysql.createPool(connectionString);
export const db = drizzle(pool, { schema, mode: 'default' });
