import db from "../src/lib/db";

const testData = [
  {
    title: "Test Bond 1",
    volume: "1,000",
    value: "100.50",
    buy: "99.75",
    sell: "101.25",
    ratio: "5.2%",
    transfer: "T+2",
  },
  // Add more samples if needed
];

testData.forEach((data) => {
  db.prepare(
    `
    INSERT INTO fixed_income (title, volume, value, buy, sell, ratio, transfer)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
  ).run(
    data.title,
    data.volume,
    data.value,
    data.buy,
    data.sell,
    data.ratio,
    data.transfer
  );
});

console.log(`Added ${testData.length} test records`);
