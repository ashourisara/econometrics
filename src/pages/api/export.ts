import type { NextApiRequest, NextApiResponse } from "next";
import { getLatestData } from "@/lib/dataService";
import ExcelJS from "exceljs";
import { FixedIncomeData } from "@/types/fixedIncome";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Type the returned data explicitly
    const data = getLatestData() as FixedIncomeData[];

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found in database" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fixed Income Data");

    // Add typed columns
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

    // Process data with proper typing
    const uniqueTitles = new Set<string>();
    data.forEach((item: FixedIncomeData) => {
      if (!uniqueTitles.has(item.title)) {
        worksheet.addRow({
          title: item.title,
          volume: item.volume,
          value: item.value,
          buy: item.buy,
          sell: item.sell,
          ratio: item.ratio,
          transfer: item.transfer,
          created_at: new Date(item.created_at).toLocaleString(),
        });
        uniqueTitles.add(item.title);
      }
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=fixed_income.xlsx"
    );

    const buffer = await workbook.xlsx.writeBuffer();
    return res.end(buffer);
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ error: "Export failed" });
  }
}
