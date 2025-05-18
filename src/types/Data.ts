// types/Quote.ts

export type FixedIncomeData = {
  title: string;
  volume: string;
  value: string;
  buy: string;
  sell: string;
  ratio: string;
  transfer: string;
};

export type Data = {
  title?: string;
  fixedIncomeData?: FixedIncomeData;
  error?: string;
};
