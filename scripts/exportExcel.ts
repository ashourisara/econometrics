#!/usr/bin/env node

import db from "../src/lib/db";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

interface FixedIncomeData {
  id: number;
  title: string;
  volume: number;
  value: number;
  buy: number;
  sell: number;
  ratio: number;
  transfer: number;
  created_at: string;
}

async function exportToExcel() {
  try {
    // Get data from SQLite
    const data = db
      .prepare(
        `
      SELECT 
        id,
        title,
        volume,
        value,
        buy,
        sell,
        ratio,
        transfer,
        datetime(created_at, 'localtime') as created_at
      FROM fixed_income
      ORDER BY created_at DESC
    `
      )
      .all() as FixedIncomeData[];
    //
    console.log(
      "Database path:",
      path.join(process.cwd(), "data", "scraped.db")
    );
    console.log("Data from SQLite:", data);
    //
    if (data.length === 0) {
      console.log("No data found in database");
      return;
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fixed Income Data");

    // Add headers
    worksheet.columns = [
      { header: "Title", key: "title", width: 20 },
      { header: "Volume", key: "volume", width: 15 },
      { header: "Value", key: "value", width: 15 },
      { header: "Buy", key: "buy", width: 15 },
      { header: "Sell", key: "sell", width: 15 },
      { header: "Ratio", key: "ratio", width: 15 },
      { header: "Transfer", key: "transfer", width: 15 },
      { header: "Date", key: "created_at", width: 20 },
    ];

    // Add data rows
    data.forEach((item) => {
      worksheet.addRow({
        title: item.title,
        volume: item.volume,
        value: item.value,
        buy: item.buy,
        sell: item.sell,
        ratio: item.ratio,
        transfer: item.transfer,
        created_at: item.created_at,
      });
    });

    // Ensure exports directory exists
    const exportDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Save file
    const exportPath = path.join(exportDir, "fixed_income_export.xlsx");
    await workbook.xlsx.writeFile(exportPath);
    console.log(
      `✅ Successfully exported ${data.length} records to ${exportPath}`
    );
  } catch (error) {
    console.error("Export failed:", error);
    process.exit(1);
  }
}

exportToExcel();
