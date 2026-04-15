import { ElectronAPI } from '@electron-toolkit/preload';
import { ITransaction } from '@renderer/types/transaction';

// Filter parameters for paginated transaction queries
interface TransactionFilterParams {
  name?: string;
  categoryId?: number | null;
  accountId?: number | null;
  // Accept either Unix timestamp (ms) or ISO 8601 UTC string
  startTime?: number | string | null;
  endTime?: number | string | null;
  sortBy?: 'newest' | 'oldest';
  page: number;
  pageSize: number;
}

// Paginated transactions response
interface PaginatedTransactions {
  data: ITransaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: {
    totalIncome: number;
    totalExpense: number;
  };
}

// Category type definitions
interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

// Account type definitions
interface Account {
  id: number;
  name: string;
  type: string;
  balance?: number;
}

// Language type definitions
interface Language {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
}

// API interface
interface API {
  // Transaction APIs
  getAllTransactions: () => Promise<ITransaction[]>;
  getTransactionById: (id: number) => Promise<ITransaction | undefined>;
  createTransaction: (transaction: {
    name: string;
    description?: string;
    category: string;
    account: string;
    amount: number;
    time: string;
  }) => Promise<number>;
  updateTransaction: (
    id: number,
    transaction: {
      name?: string;
      description?: string;
      category?: string;
      account?: string;
      amount?: number;
      time?: string;
    }
  ) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;

  // Paginated transaction API
  getTransactionsPaginated: (filters: TransactionFilterParams) => Promise<PaginatedTransactions>;

  // Category APIs
  getCategories: () => Promise<Category[]>;
  getAllCategories: () => Promise<Category[]>;
  searchCategories: (q: string, limit?: number, offset?: number) => Promise<Category[]>;
  getCategoryById: (id: number) => Promise<Category | undefined>;
  createCategory: (category: {
    name: string;
    type: string;
    icon?: string;
    color?: string;
  }) => Promise<number>;
  updateCategory: (
    id: number,
    category: {
      name?: string;
      type?: string;
      icon?: string;
      color?: string;
    }
  ) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  // Account APIs
  getAccounts: () => Promise<Account[]>;
  getAllAccounts: () => Promise<Account[]>;
  searchAccounts: (q: string, limit?: number, offset?: number) => Promise<Account[]>;
  getAccountById: (id: number) => Promise<Account | undefined>;
  createAccount: (account: { name: string; type: string; balance?: number }) => Promise<number>;
  updateAccount: (
    id: number,
    account: {
      name?: string;
      type?: string;
      balance?: number;
    }
  ) => Promise<void>;
  deleteAccount: (id: number) => Promise<void>;

  // Language APIs
  getLanguages: () => Promise<Language[]>;
  getLanguageByCode: (code: string) => Promise<Language | undefined>;
  getLanguagePreference: (userId: string) => Promise<string | null>;
  setLanguagePreference: (userId: string, language: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
