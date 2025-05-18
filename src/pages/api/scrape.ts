import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { Data } from '@/types/Quote';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Set user agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate with longer timeout
    await page.goto('https://tradersarena.ir', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const title = await page.title();

    // Wait specifically for the fixedz row to be present
    await page.waitForSelector('#fixedz', { timeout: 5000 });

    // Extract the specific fixed income data
    const fixedIncomeData = await page.evaluate(() => {
      const extractText = (id: string) => 
        document.querySelector(id)?.textContent?.trim() || '';

      return {
        title: extractText('#title_fixedz'),
        volume: extractText('#volume_fixedz'),
        value: extractText('#value_fixedz'),
        buy: extractText('#buy_fixedz'),
        sell: extractText('#sell_fixedz'),
        ratio: extractText('#ratio_fixedz'),
        transfer: extractText('#transfer_fixedz')
      };
    });

    await browser.close();

    if (!fixedIncomeData.title) {
      return res.status(404).json({ error: 'Fixed income data not found' });
    }

    res.status(200).json({ 
      title,
      fixedIncomeData 
    });
  } catch (error) {
    console.error('Detailed error:', error);
    if (browser) await browser.close();
    res.status(500).json({ 
      error: `Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}