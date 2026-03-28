import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  // Transaction APIs
  getTransactions: () => ipcRenderer.invoke('db:getAllTransactions'),
  getTransactionById: (id: number) => ipcRenderer.invoke('db:getTransactionById', id),
  createTransaction: (transaction: {
    name: string;
    description?: string;
    category: string;
    account: string;
    amount: number;
    time: string;
  }) => ipcRenderer.invoke('db:addTransaction', transaction),
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
  ) => ipcRenderer.invoke('db:updateTransaction', id, transaction),
  deleteTransaction: (id: number) => ipcRenderer.invoke('db:deleteTransaction', id),

  // Category APIs
  getCategories: () => ipcRenderer.invoke('db:getCategories'),
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
  deleteCategory: (id: number) => ipcRenderer.invoke('db:deleteCategory', id)
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
