#!/usr/bin/env node
import db from "../src/lib/db";

// Delete duplicate records keeping only the latest
db.exec(`
  DELETE FROM fixed_income
  WHERE id NOT IN (
    SELECT MAX(id)
    FROM fixed_income
    GROUP BY title
  )
`);

console.log("Duplicate cleanup completed");
