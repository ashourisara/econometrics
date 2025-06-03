#!/usr/bin/env node
import db from "../src/lib/db";
import path from "path";
import {
  TableInfo,
  SchemaInfo,
  FixedIncomeRecord,
} from "../src/types/database";

async function inspectDatabase() {
  console.log("=== Database Inspection ===");

  // Database metadata
  // console.log("\n📁 Database Path:", path.resolve(db.name));
  // console.log("🔍 Connection Status:", db.open ? "Connected" : "Closed");

  // List all tables
  // try {
  //   const tables = db
  //     .prepare(
  //       `
  //     SELECT name, type, sql
  //     FROM sqlite_master
  //     WHERE type IN ('table', 'view')
  //   `
  //     )
  //     .all() as TableInfo[];

  //   console.log("\n📊 Database Objects:");
  //   tables.forEach((table) => {
  //     console.log(`- ${table.type.toUpperCase()}: ${table.name}`);
  //     if (table.sql) console.log(`  ${table.sql}`);
  //   });
  // } catch (error) {
  //   console.error(
  //     "\n Failed to list tables:",
  //     error instanceof Error ? error.message : String(error)
  //   );
  // }

  // Check fixed_income table specifically
  try {
    const schema = db
      .prepare(
        `
      SELECT sql 
      FROM sqlite_master 
      WHERE name = 'fixed_income' AND type = 'table'
    `
      )
      .get() as SchemaInfo | undefined;

    // console.log("\n🔧 fixed_income Schema:", schema?.sql || "Table not found");

    if (schema) {
      const count = db
        .prepare("SELECT COUNT(*) as count FROM fixed_income")
        .get() as { count: number };
      // console.log(`\n🔢 Record Count: ${count.count}`);

      if (count.count > 0) {
        const sample = db
          .prepare(
            `
          SELECT * FROM fixed_income 
          ORDER BY created_at DESC 
          LIMIT 3
        `
          )
          .all() as FixedIncomeRecord[];

        // console.log("\n📝 Sample Data:");
        console.table(sample);
      }
    }
  } catch (error) {
    console.error(
      "\n fixed_income inspection failed:",
      error instanceof Error ? error.message : String(error)
    );
  }

  console.log("\n=== Inspection Complete ===");
  db.close();
}

inspectDatabase().catch(console.error);
