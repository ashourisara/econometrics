#!/usr/bin/env node
import db from "../src/lib/db";

interface CountResult {
  count: number;
}

interface FixedIncomeRecord {
  id: number;
  title: string;
  volume: string;
  value: string;
  buy: string;
  sell: string;
  ratio: string;
  transfer: string;
  created_at: string;
}

interface SchemaResult {
  sql: string;
}

console.log("Checking database...");

// Count records with proper typing
const count = db
  .prepare("SELECT COUNT(*) as count FROM fixed_income")
  .get() as CountResult;
console.log(`Records in fixed_income: ${count.count}`);

// Show first 5 records with proper typing
const data = db
  .prepare("SELECT * FROM fixed_income LIMIT 5")
  .all() as FixedIncomeRecord[];
console.log("Sample data:", data);

// Verify table structure with proper typing
const schema = db
  .prepare("SELECT sql FROM sqlite_master WHERE name='fixed_income'")
  .get() as SchemaResult;
console.log("Table schema:", schema?.sql);
