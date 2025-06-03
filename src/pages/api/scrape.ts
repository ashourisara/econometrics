import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import db from "@/lib/db";
import { debugDb } from "@/lib/dbDebug";

interface ScrapeResponse {
  success: boolean;
  error?: string;
  insertedId?: number;
  data?: Record<string, string>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScrapeResponse>
) {
  debugDb();
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Scrape data
    await page.goto("https://tradersarena.ir", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await page.waitForSelector("#fixedz", { timeout: 5000 });

    const scrapedData = await page.evaluate(() => ({
      title: document.querySelector("#title_fixedz")?.textContent?.trim() || "",
      volume:
        document.querySelector("#volume_fixedz")?.textContent?.trim() || "",
      value: document.querySelector("#value_fixedz")?.textContent?.trim() || "",
      buy: document.querySelector("#buy_fixedz")?.textContent?.trim() || "",
      sell: document.querySelector("#sell_fixedz")?.textContent?.trim() || "",
      ratio: document.querySelector("#ratio_fixedz")?.textContent?.trim() || "",
      transfer:
        document.querySelector("#transfer_fixedz")?.textContent?.trim() || "",
    }));

    // Verify data
    if (!scrapedData.title) {
      throw new Error("Scraped data is incomplete");
    }

    // save to SQLite with transaction and error handling
    const stmt = db.prepare(`
      INSERT INTO fixed_income (title, volume, value, buy, sell, ratio, transfer)
      VALUES (@title, @volume, @value, @buy, @sell, @ratio, @transfer)
    `);

    const transaction = db.transaction(() => {
      const result = stmt.run(scrapedData);
      console.log("SQLite insertion result:", result); // Debug log
      return result;
    });

    const result = transaction();

    // Verify insertion
    if (!result.lastInsertRowid) {
      throw new Error("Failed to insert into database");
    }

    // Return success
    res.status(200).json({
      success: true,
      insertedId: Number(result.lastInsertRowid),
      data: scrapedData,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Database save failed",
    });
  } finally {
    if (browser) await browser.close();
  }
}
