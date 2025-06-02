import type { NextApiRequest, NextApiResponse } from "next";
import ExcelJS from "exceljs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Fetch fresh data from your scrape endpoint
    const scrapeRes = await fetch(`http://${req.headers.host}/api/scrape`);
    if (!scrapeRes.ok) throw new Error("Failed to fetch scrape data");

    const { fixedIncomeData } = await scrapeRes.json();

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fixed Income Data");

    // Add headers
    worksheet.columns = [
      { header: "", key: "title", width: 20 },
      //   { header: "Volume", key: "volume", width: 15 },
      //   { header: "Value", key: "value", width: 15 },
      { header: "خرید", key: "buy", width: 15 },
      { header: "فروش", key: "sell", width: 15 },
      //   { header: "Ratio", key: "ratio", width: 15 },
      { header: "ورود پول", key: "transfer", width: 15 },
    ];

    // Add data row
    worksheet.addRow(fixedIncomeData);

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=fixed_income_data.xlsx"
    );

    // Write to buffer and send
    const buffer = await workbook.xlsx.writeBuffer();
    res.write(Buffer.from(buffer));
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({
      error: `Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
}
