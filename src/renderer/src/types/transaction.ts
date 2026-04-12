export interface ITransaction {
  id: string; // UUID v7
  name: string;
  description: string;
  categoryId: number; // Foreign key to categories
  categoryName?: string; // Category name (from join)
  accountId: number; // Foreign key to accounts
  accountName?: string; // Account name (from join)
  amount: number; // REAL - supports decimal (e.g., 10.02)
  time: number; // Unix timestamp (milliseconds)
}

export interface TransactionFilterParams {
  name?: string; // Search by name (case-insensitive, diacritics-insensitive)
  categoryId?: number | null; // Filter by category (null = all)
  accountId?: number | null; // Filter by account (null = all)
  startTime?: number | null; // Unix timestamp in milliseconds (inclusive)
  endTime?: number | null; // Unix timestamp in milliseconds (inclusive)
  sortBy?: 'newest' | 'oldest'; // Sort order (default: newest)
  page: number; // Current page number (default: 1)
  pageSize: number; // Page size (default: 10)
}

export interface PaginatedTransactions {
  data: ITransaction[]; // Transactions for current page
  total: number; // Total records matching filter
  page: number; // Current page number
  pageSize: number; // Current page size
  totalPages: number; // Total pages
  summary: {
    totalIncome: number; // Sum of amounts > 0
    totalExpense: number; // Sum of |amount| where amount < 0
  };
}
