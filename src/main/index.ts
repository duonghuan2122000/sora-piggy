import { BrowserWindow, app, ipcMain, shell, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import {
  initDb,
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getLanguages,
  getLanguageByCode,
  getUserPreference,
  setUserPreference,
  closeDatabase,
  getTransactionsPaginated,
  getAllCategories,
  getAllAccounts,
  searchCategories,
  searchAccounts
} from './database';
import { TransactionFilterParams, PaginatedTransactions } from './types/transaction';
import { ICategory, IAccount } from './database';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Initialize database
  initDb();

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  // Database IPC handlers
  // Transaction handlers
  ipcMain.handle('db:getAllTransactions', () => getAllTransactions());
  ipcMain.handle('db:getTransactionById', (_, id) => getTransactionById(id));
  ipcMain.handle('db:addTransaction', (_, transaction) => addTransaction(transaction));
  ipcMain.handle('db:updateTransaction', (_, id, transaction) =>
    updateTransaction(id, transaction)
  );
  ipcMain.handle('db:deleteTransaction', (_, id) => deleteTransaction(id));

  // Paginated transactions handler
  ipcMain.handle(
    'db:getTransactionsPaginated',
    (_, filters: TransactionFilterParams): PaginatedTransactions => {
      // Validate pagination parameters
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 10;

      // Validate page must be positive integer
      if (!Number.isInteger(page) || page < 1) {
        console.error('[IPC] Invalid page parameter:', page);
        return {
          data: [],
          total: 0,
          page: 1,
          pageSize: Math.max(1, pageSize),
          totalPages: 0,
          summary: { totalIncome: 0, totalExpense: 0 }
        };
      }

      // Validate pageSize must be positive integer
      if (!Number.isInteger(pageSize) || pageSize < 1) {
        console.error('[IPC] Invalid pageSize parameter:', pageSize);
        return {
          data: [],
          total: 0,
          page,
          pageSize: 10,
          totalPages: 0,
          summary: { totalIncome: 0, totalExpense: 0 }
        };
      }

      console.log(
        `[IPC] getTransactionsPaginated: page=${page}, pageSize=${pageSize}, categoryId=${filters.categoryId}, accountId=${filters.accountId}, sortBy=${filters.sortBy}, name="${filters.name}"`
      );

      try {
        const result = getTransactionsPaginated(filters);
        console.log(
          `[IPC] getTransactionsPaginated: returned ${result.data.length} records, total=${result.total}`
        );
        return result;
      } catch (error) {
        console.error('[IPC] Error fetching paginated transactions:', error);
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
          summary: { totalIncome: 0, totalExpense: 0 }
        };
      }
    }
  );

  // Category handlers
  ipcMain.handle('db:getCategories', () => getCategories());
  ipcMain.handle('db:getCategoryById', (_, id) => getCategoryById(id));
  ipcMain.handle('db:createCategory', (_, category) => createCategory(category));
  ipcMain.handle('db:updateCategory', (_, id, category) => updateCategory(id, category));
  ipcMain.handle('db:deleteCategory', (_, id) => deleteCategory(id));

  // Get all categories for dropdown (with detailed info)
  ipcMain.handle('db:getAllCategories', (): ICategory[] => {
    console.log('[IPC] getAllCategories: fetching all categories');
    try {
      const categories = getAllCategories();
      console.log(`[IPC] getAllCategories: returned ${categories.length} categories`);
      return categories;
    } catch (error) {
      console.error('[IPC] Error fetching all categories:', error);
      return [];
    }
  });

  // Account handlers
  ipcMain.handle('db:getAccounts', () => getAccounts());
  ipcMain.handle('db:getAccountById', (_, id) => getAccountById(id));
  ipcMain.handle('db:createAccount', (_, account) => createAccount(account));
  ipcMain.handle('db:updateAccount', (_, id, account) => updateAccount(id, account));
  ipcMain.handle('db:deleteAccount', (_, id) => deleteAccount(id));

  // Get all accounts for dropdown (with detailed info)
  ipcMain.handle('db:getAllAccounts', (): IAccount[] => {
    console.log('[IPC] getAllAccounts: fetching all accounts');
    try {
      const accounts = getAllAccounts();
      console.log(`[IPC] getAllAccounts: returned ${accounts.length} accounts`);
      return accounts;
    } catch (error) {
      console.error('[IPC] Error fetching all accounts:', error);
      return [];
    }
  });

  // Search handlers for lazy-loading selects
  ipcMain.handle('db:searchCategories', (_event: IpcMainInvokeEvent, q: string, limit = 5, offset = 0): ICategory[] => {
    console.log(`[IPC] searchCategories: q="${q}", limit=${limit}, offset=${offset}`);
    try {
      return searchCategories(q, limit, offset);
    } catch (error) {
      console.error('[IPC] Error searching categories:', error);
      return [];
    }
  });

  ipcMain.handle('db:searchAccounts', (_event: IpcMainInvokeEvent, q: string, limit = 5, offset = 0): IAccount[] => {
    console.log(`[IPC] searchAccounts: q="${q}", limit=${limit}, offset=${offset}`);
    try {
      return searchAccounts(q, limit, offset);
    } catch (error) {
      console.error('[IPC] Error searching accounts:', error);
      return [];
    }
  });

  // Language handlers
  ipcMain.handle('db:getLanguages', () => getLanguages());
  ipcMain.handle('db:getLanguageByCode', (_, code) => getLanguageByCode(code));
  ipcMain.handle('db:getLanguagePreference', (_, userId) => getUserPreference(userId, 'language'));
  ipcMain.handle('db:setLanguagePreference', (_, userId, language) => {
    setUserPreference(userId, 'language', language);
    return true;
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  closeDatabase();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
