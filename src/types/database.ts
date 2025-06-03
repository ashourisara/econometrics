export interface DatabaseResult {
  changes: number;
  lastInsertRowid: number;
}

export interface TableInfo {
  name: string;
  type: string;
  sql?: string;
}

export interface SchemaInfo {
  sql: string;
}

export interface FixedIncomeRecord {
  id: number;
  title: string;
  volume: string;
  value: string;
  buy: string;
  sell: string;
  ratio: string;
  transfer: string;
  created_at: string;
}
