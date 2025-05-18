// pages/api/fund-flows.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      "https://tradersarena.ir/industries/fixed-income-funds",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const $ = cheerio.load(response.data);
    const data: {
      name: string;
      inflow: number;
      outflow: number;
      netFlow: number;
    }[] = [];

    $("table tbody tr").each((_, element) => {
      const tds = $(element).find("td");
      const name = $(tds[0]).text().trim();
      const inflow = parseFloat($(tds[1]).text().replace(/,/g, "")) || 0;
      const outflow = parseFloat($(tds[2]).text().replace(/,/g, "")) || 0;
      const netFlow = inflow - outflow;

      data.push({ name, inflow, outflow, netFlow });
    });

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: "خطا در استخراج داده‌ها" });
  }
}
