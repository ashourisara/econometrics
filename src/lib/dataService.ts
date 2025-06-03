import db from "./db";

export const saveScrapedData = (data: any) => {
  // First delete existing data for this title to prevent duplicates
  db.prepare(`DELETE FROM fixed_income WHERE title = ?`).run(data.title);

  // Then insert fresh data
  const stmt = db.prepare(`
    INSERT INTO fixed_income (title, volume, value, buy, sell, ratio, transfer)
    VALUES (@title, @volume, @value, @buy, @sell, @ratio, @transfer)
  `);
  return stmt.run(data);
};

export const getLatestData = () => {
  return db
    .prepare(
      `
    SELECT * FROM fixed_income 
    WHERE id IN (
      SELECT MAX(id) 
      FROM fixed_income 
      GROUP BY title
    )
    ORDER BY created_at DESC
  `
    )
    .all();
};
