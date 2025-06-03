import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "scraped.db");
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS fixed_income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    volume TEXT,
    value TEXT,
    buy TEXT,
    sell TEXT,
    ratio TEXT,
    transfer TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
