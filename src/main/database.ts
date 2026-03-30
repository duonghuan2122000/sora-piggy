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
  `);

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
  const info = stmt.run({ ...transaction, time: transaction.time.toISOString() });
  return Number(info.lastInsertRowid);
};

export const updateTransaction = (id: number, transaction: Partial<ITransaction>): void => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'UPDATE transactions SET name = @name, description = @description, category = @category, account = @account, amount = @amount, time = @time WHERE id = @id'
  );
  stmt.run({ ...transaction, id, time: transaction.time?.toISOString() });
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

// Close database connection when app quits
export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};
