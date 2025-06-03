"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var better_sqlite3_1 = require("better-sqlite3");
var path_1 = require("path");
var dbPath = path_1.default.join(process.cwd(), "data", "scraped.db");
var db = new better_sqlite3_1.default(dbPath);
// Initialize database
db.exec("\n  CREATE TABLE IF NOT EXISTS fixed_income (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    title TEXT,\n    volume TEXT,\n    value TEXT,\n    buy TEXT,\n    sell TEXT,\n    ratio TEXT,\n    transfer TEXT,\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n  )\n");
exports.default = db;
