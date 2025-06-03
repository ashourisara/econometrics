import db from "./db";

export const saveScrapedData = (data: any) => {
  // First delete existing entry to prevent duplicates
  db.prepare(`DELETE FROM fixed_income WHERE title = ?`).run(data.title);

  // Then insert fresh data
  return db
    .prepare(
      `
    INSERT INTO fixed_income (
      title, volume, value, buy, sell, ratio, transfer
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `
    )
    .run(
      data.title,
      data.volume,
      data.value,
      data.buy,
      data.sell,
      data.ratio,
      data.transfer
    );
};

export const getAllData = () => {
  return db
    .prepare(
      `
    SELECT * FROM fixed_income 
    ORDER BY created_at DESC
  `
    )
    .all();
};
