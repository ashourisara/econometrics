#!/usr/bin/env ts-node
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import path from "path";

interface FixedIncomeData {
  title: string;
  volume: string;
  value: string;
  buy: string;
  sell: string;
  ratio: string;
  transfer: string;
}

async function scrapeData(): Promise<FixedIncomeData> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto("https://tradersarena.ir", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await page.waitForSelector("#fixedz", { timeout: 5000 });

    return await page.evaluate(() => {
      const extractText = (id: string) =>
        document.querySelector(id)?.textContent?.trim() || "";

      return {
        title: extractText("#title_fixedz"),
        volume: extractText("#volume_fixedz"),
        value: extractText("#value_fixedz"),
        buy: extractText("#buy_fixedz"),
        sell: extractText("#sell_fixedz"),
        ratio: extractText("#ratio_fixedz"),
        transfer: extractText("#transfer_fixedz"),
      };
    });
  } finally {
    if (browser) await browser.close();
  }
}

async function exportToExcel() {
  try {
    // Scrape the data
    const data = await scrapeData();

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fixed Income Data");

    // Add headers and data
    worksheet.columns = [
      { header: "Title", key: "title", width: 20 },
      { header: "Volume", key: "volume", width: 15 },
      { header: "Value", key: "value", width: 15 },
      { header: "Buy", key: "buy", width: 15 },
      { header: "Sell", key: "sell", width: 15 },
      { header: "Ratio", key: "ratio", width: 15 },
      { header: "Transfer", key: "transfer", width: 15 },
    ];

    worksheet.addRow(data);

    // Save to file
    const exportPath = path.join(
      process.cwd(),
      "exports",
      "fixed_income_export.xlsx"
    );
    await workbook.xlsx.writeFile(exportPath);

    console.log(`Successfully exported to ${exportPath}`);
  } catch (error) {
    console.error("Export failed:", error);
    process.exit(1);
  }
}

exportToExcel();
