export interface ITransaction {
  id: string; // UUID v7
  name: string;
  description: string;
  categoryId: number; // Foreign key to categories
  accountId: number; // Foreign key to accounts
  amount: number; // REAL - supports decimal (e.g., 10.02)
  time: number; // Unix timestamp (milliseconds)
}
