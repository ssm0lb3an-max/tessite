import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

// Check if we're using SQLite or PostgreSQL
const useSQLite = !process.env.DATABASE_URL;

let db: any;

if (useSQLite) {
  // SQLite for cPanel/shared hosting
  const dataDir = path.join(process.cwd(), "data");
  const dbPath = path.join(dataDir, "app.db");
  
  // Ensure data directory exists
  try {
    const fs = require("fs");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (error) {
    console.error("Failed to create data directory:", error);
  }

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  db = drizzle(sqlite);
} else {
  // PostgreSQL for Replit/other platforms
  const { Pool } = require("pg");
  const { drizzle: drizzlePostgres } = require("drizzle-orm/node-postgres");
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  db = drizzlePostgres(pool);
}

export { db };
