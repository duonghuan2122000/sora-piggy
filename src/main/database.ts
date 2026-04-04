import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';
import { ITransaction } from '@renderer/types/transaction';

let db: Database.Database | null = null;

interface DbRow {
  [key: string]: unknown;
}

export const getDbPath = (): string => {
  return join(app.getPath('userData'), 'sora-piggy.db');
};

export const initDb = (): Database.Database => {
  if (db) return db;

  const dbPath = getDbPath();
  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      account TEXT NOT NULL,
      amount INTEGER NOT NULL,
      time TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      icon TEXT,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      balance INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      nameEn TEXT,
      "order" INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      preferenceKey TEXT NOT NULL,
      preferenceValue TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      UNIQUE(userId, preferenceKey)
    );
  `);

  // Migration: Add 'order' column to languages table if it doesn't exist
  const tableInfo = db.prepare("PRAGMA table_info('languages')").all() as Array<{
    name: string;
    type: string;
    notnull: number;
    dflt_value: string | null;
    pk: number;
  }>;
  const hasOrderColumn = tableInfo.some((col) => col.name === 'order');
  if (!hasOrderColumn) {
    db.exec('ALTER TABLE languages ADD COLUMN "order" INTEGER DEFAULT 0');
  }

  // Seed initial language data if empty
  const languageCount = db.prepare('SELECT COUNT(*) as count FROM languages').get() as {
    count: number;
  };
  if (languageCount.count === 0) {
    const insertLanguage = db.prepare(
      'INSERT INTO languages (code, name, nameEn, "order") VALUES (@code, @name, @nameEn, @order)'
    );
    insertLanguage.run({ code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese', order: 1 });
    insertLanguage.run({ code: 'en', name: 'English', nameEn: 'English', order: 2 });
  } else {
    // Update existing language data to ensure order values
    const updateLanguage = db.prepare('UPDATE languages SET "order" = @order WHERE code = @code');
    updateLanguage.run({ code: 'vi', order: 1 });
    updateLanguage.run({ code: 'en', order: 2 });
  }

  return db;
};

// CRUD Operations for Transactions
export const getAllTransactions = (): ITransaction[] => {
  if (!db) initDb();
  const stmt = db!.prepare('SELECT * FROM transactions ORDER BY time DESC');
  // Convert time string back to Date object
  const rows = stmt.all() as DbRow[];
  return rows.map((row) => ({
    ...row,
    time: new Date(row.time as string)
  })) as ITransaction[];
};

export const getTransactionById = (id: number): ITransaction | undefined => {
  if (!db) initDb();
  const stmt = db!.prepare('SELECT * FROM transactions WHERE id = ?');
  const row = stmt.get(id) as DbRow | undefined;
  if (!row) return undefined;
  return {
    ...row,
    time: new Date(row.time as string)
  } as ITransaction;
};

export const addTransaction = (transaction: Omit<ITransaction, 'id'>): number => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'INSERT INTO transactions (name, description, category, account, amount, time) VALUES (@name, @description, @category, @account, @amount, @time)'
  );
  // Handle both Date object and ISO string
  const timeValue = transaction.time instanceof Date
    ? transaction.time.toISOString()
    : new Date(transaction.time).toISOString();
  const info = stmt.run({ ...transaction, time: timeValue });
  return Number(info.lastInsertRowid);
};

export const updateTransaction = (id: number, transaction: Partial<ITransaction>): void => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'UPDATE transactions SET name = @name, description = @description, category = @category, account = @account, amount = @amount, time = @time WHERE id = @id'
  );
  // Handle both Date object and ISO string
  const timeValue = transaction.time
    ? (transaction.time instanceof Date
        ? transaction.time.toISOString()
        : new Date(transaction.time).toISOString())
    : undefined;
  stmt.run({ ...transaction, id, time: timeValue });
};

export const deleteTransaction = (id: number): void => {
  if (!db) initDb();
  const stmt = db!.prepare('DELETE FROM transactions WHERE id = ?');
  stmt.run(id);
};

// CRUD operations for categories
export const getCategories = (): unknown[] => {
  if (!db) initDb();
  return db!.prepare('SELECT * FROM categories ORDER BY name').all();
};

export const getCategoryById = (id: number): unknown => {
  if (!db) initDb();
  return db!.prepare('SELECT * FROM categories WHERE id = ?').get(id);
};

export const createCategory = (category: {
  name: string;
  type: string;
  icon?: string;
  color?: string;
}): Database.RunResult => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'INSERT INTO categories (name, type, icon, color) VALUES (@name, @type, @icon, @color)'
  );
  return stmt.run({
    ...category,
    icon: category.icon ?? null,
    color: category.color ?? null
  });
};

export const updateCategory = (
  id: number,
  category: {
    name?: string;
    type?: string;
    icon?: string;
    color?: string;
  }
): Database.RunResult => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'UPDATE categories SET name = @name, type = @type, icon = @icon, color = @color WHERE id = @id'
  );
  return stmt.run({ ...category, id });
};

export const deleteCategory = (id: number): Database.RunResult => {
  if (!db) initDb();
  return db!.prepare('DELETE FROM categories WHERE id = ?').run(id);
};

// CRUD operations for accounts
export const getAccounts = (): unknown[] => {
  if (!db) initDb();
  return db!.prepare('SELECT * FROM accounts ORDER BY name').all();
};

export const getAccountById = (id: number): unknown => {
  if (!db) initDb();
  return db!.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
};

export const createAccount = (account: {
  name: string;
  type: string;
  balance?: number;
}): Database.RunResult => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'INSERT INTO accounts (name, type, balance) VALUES (@name, @type, @balance)'
  );
  return stmt.run({
    ...account,
    balance: account.balance ?? 0
  });
};

export const updateAccount = (
  id: number,
  account: {
    name?: string;
    type?: string;
    balance?: number;
  }
): Database.RunResult => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'UPDATE accounts SET name = @name, type = @type, balance = @balance WHERE id = @id'
  );
  return stmt.run({ ...account, id });
};

export const deleteAccount = (id: number): Database.RunResult => {
  if (!db) initDb();
  return db!.prepare('DELETE FROM accounts WHERE id = ?').run(id);
};

// CRUD operations for languages
export const getLanguages = (): unknown[] => {
  if (!db) initDb();
  return db!.prepare('SELECT * FROM languages ORDER BY "order" ASC, code ASC').all();
};

export const getLanguageByCode = (code: string): unknown => {
  if (!db) initDb();
  return db!.prepare('SELECT * FROM languages WHERE code = ?').get(code);
};

// CRUD operations for user preferences
export const getUserPreference = (userId: string, preferenceKey: string): string | null => {
  if (!db) initDb();
  const result = db!
    .prepare('SELECT preferenceValue FROM user_preferences WHERE userId = ? AND preferenceKey = ?')
    .get(userId, preferenceKey) as { preferenceValue: string } | undefined;
  return result?.preferenceValue ?? null;
};

export const setUserPreference = (
  userId: string,
  preferenceKey: string,
  preferenceValue: string
): void => {
  if (!db) initDb();
  const now = new Date().toISOString();
  const stmt = db!.prepare(
    'INSERT OR REPLACE INTO user_preferences (userId, preferenceKey, preferenceValue, createdAt, updatedAt) VALUES (@userId, @preferenceKey, @preferenceValue, @createdAt, @updatedAt)'
  );
  stmt.run({
    userId,
    preferenceKey,
    preferenceValue,
    createdAt: now,
    updatedAt: now
  });
};

// Close database connection when app quits
export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};
