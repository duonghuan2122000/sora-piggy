import { ElectronAPI } from '@electron-toolkit/preload';
import { ITransaction } from '@renderer/types/transaction';

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

// API interface
interface API {
  // Transaction APIs
  getAllTransactions: () => Promise<ITransaction[]>;
  getTransactionById: (id: number) => Promise<ITransaction | undefined>;
  addTransaction: (transaction: Omit<ITransaction, 'id'>) => Promise<number>;
  updateTransaction: (id: number, transaction: Partial<ITransaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;

  // Category APIs
  getCategories: () => Promise<Category[]>;
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
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
