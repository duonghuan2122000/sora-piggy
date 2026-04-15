import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Filter parameters for paginated transaction queries
interface TransactionFilterParams {
  name?: string;
  categoryId?: number | null;
  accountId?: number | null;
  // Accept either Unix timestamp (ms) or ISO 8601 UTC string for filters
  startTime?: number | string | null;
  endTime?: number | string | null;
  sortBy?: 'newest' | 'oldest';
  page: number;
  pageSize: number;
}

// Custom APIs for renderer
const api = {
  // Transaction APIs
  getTransactions: () => ipcRenderer.invoke('db:getAllTransactions'),
  getTransactionById: (id: number) => ipcRenderer.invoke('db:getTransactionById', id),
  createTransaction: (transaction: {
    name: string;
    description?: string;
    categoryId?: number | null;
    accountId?: number | null;
    amount: number;
    time: string;
  }) => ipcRenderer.invoke('db:addTransaction', transaction),
  updateTransaction: (
    id: number,
    transaction: {
      name?: string;
      description?: string;
      categoryId?: number | null;
      accountId?: number | null;
      amount?: number;
      time?: string;
    }
  ) => ipcRenderer.invoke('db:updateTransaction', id, transaction),
  deleteTransaction: (id: number) => ipcRenderer.invoke('db:deleteTransaction', id),

  // Paginated transaction API
  getTransactionsPaginated: (filters: TransactionFilterParams) =>
    ipcRenderer.invoke('db:getTransactionsPaginated', filters),

  // Category APIs
  getCategories: () => ipcRenderer.invoke('db:getCategories'),
  getAllCategories: () => ipcRenderer.invoke('db:getAllCategories'),
  searchCategories: (q: string, limit = 5, offset = 0) =>
    ipcRenderer.invoke('db:searchCategories', q, limit, offset),
  searchAccounts: (q: string, limit = 5, offset = 0) =>
    ipcRenderer.invoke('db:searchAccounts', q, limit, offset),
  getCategoryById: (id: number) => ipcRenderer.invoke('db:getCategoryById', id),
  createCategory: (category: { name: string; type: string; icon?: string; color?: string }) =>
    ipcRenderer.invoke('db:createCategory', category),
  updateCategory: (
    id: number,
    category: {
      name?: string;
      type?: string;
      icon?: string;
      color?: string;
    }
  ) => ipcRenderer.invoke('db:updateCategory', id, category),
  deleteCategory: (id: number) => ipcRenderer.invoke('db:deleteCategory', id),

  // Account APIs
  getAccounts: () => ipcRenderer.invoke('db:getAccounts'),
  getAllAccounts: () => ipcRenderer.invoke('db:getAllAccounts'),
  getAccountById: (id: number) => ipcRenderer.invoke('db:getAccountById', id),
  createAccount: (account: { name: string; type: string; balance?: number }) =>
    ipcRenderer.invoke('db:createAccount', account),
  updateAccount: (
    id: number,
    account: {
      name?: string;
      type?: string;
      balance?: number;
    }
  ) => ipcRenderer.invoke('db:updateAccount', id, account),
  deleteAccount: (id: number) => ipcRenderer.invoke('db:deleteAccount', id),

  // Language APIs
  getLanguages: () => ipcRenderer.invoke('db:getLanguages'),
  getLanguageByCode: (code: string) => ipcRenderer.invoke('db:getLanguageByCode', code),
  getLanguagePreference: (userId: string) => ipcRenderer.invoke('db:getLanguagePreference', userId),
  setLanguagePreference: (userId: string, language: string) =>
    ipcRenderer.invoke('db:setLanguagePreference', userId, language)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
