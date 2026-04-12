import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';
import { existsSync, copyFileSync, unlinkSync } from 'fs';
import { v7 as uuidv7 } from 'uuid';
import { ITransaction, TransactionFilterParams, PaginatedTransactions } from './types/transaction';

let db: Database.Database | null = null;

// Migration version constants
const MIGRATION_VERSION = 2;

// Flexible interface to handle both old and new schema
interface DbRow {
  [key: string]: unknown;
  id?: string | number;
  name?: string;
  description?: string | null;
  category?: string;
  categoryId?: number;
  account?: string;
  accountId?: number;
  amount?: number;
  time?: string | number;
}

// Custom function to remove Vietnamese diacritics for search support
function removeDiacritics(text: string): string {
  if (!text) return '';

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[đĐ]/g, 'd'); // Replace đ with d
}

// Get current migration version from database
const getMigrationVersion = (database: Database.Database): number => {
  try {
    const result = database.prepare('PRAGMA user_version').get() as { user_version: number };
    return result.user_version;
  } catch {
    return 0;
  }
};

// Set migration version in database
const setMigrationVersion = (database: Database.Database, version: number): void => {
  database.pragma(`user_version = ${version}`);
};

// Check if migration to UUID v7 is needed
const needsUuidMigration = (database: Database.Database): boolean => {
  try {
    // Check if old schema exists (category and account as TEXT columns)
    const tableInfo = database.prepare("PRAGMA table_info('transactions')").all() as Array<{
      name: string;
      type: string;
    }>;
    const hasOldSchema = tableInfo.some((col) => col.name === 'category' || col.name === 'account');
    return hasOldSchema;
  } catch {
    return false;
  }
};

// Create backup of database file
const createDatabaseBackup = (dbPath: string): string | null => {
  try {
    if (!existsSync(dbPath)) {
      console.log('[Migration] Database file not found, skipping backup');
      return null;
    }

    const backupPath = `${dbPath}.bak`;
    copyFileSync(dbPath, backupPath);
    console.log(`[Migration] Database backed up to: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('[Migration] Error creating backup:', error);
    return null;
  }
};

// Verify categories and accounts have at least 1 record
const verifyCategoriesAndAccounts = (): void => {
  if (!db) return;

  // Check categories
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as {
    count: number;
  };

  if (categoryCount.count === 0) {
    // Create default categories if none exist
    console.log('[Migration] No categories found, creating defaults...');
    const insertCategory = db.prepare(
      'INSERT INTO categories (name, type, icon, color) VALUES (@name, @type, @icon, @color)'
    );
    insertCategory.run({ name: 'General', type: 'expense', icon: 'folder', color: '#888888' });
    insertCategory.run({ name: 'Income', type: 'income', icon: 'wallet', color: '#4CAF50' });
    console.log('[Migration] Default categories created');
  }

  // Check accounts
  const accountCount = db.prepare('SELECT COUNT(*) as count FROM accounts').get() as {
    count: number;
  };

  if (accountCount.count === 0) {
    // Create default account if none exist
    console.log('[Migration] No accounts found, creating default...');
    const insertAccount = db.prepare(
      'INSERT INTO accounts (name, type, balance) VALUES (@name, @type, @balance)'
    );
    insertAccount.run({ name: 'Cash', type: 'cash', balance: 0 });
    console.log('[Migration] Default account created');
  }

  console.log('[Migration] Categories and accounts verified');
};

// Validate and convert time string to timestamp
const validateAndConvertTime = (timeValue: string | number | undefined): number => {
  if (!timeValue) {
    return Date.now();
  }

  // If already a number, return it
  if (typeof timeValue === 'number') {
    return timeValue;
  }

  // Try to parse as string
  const date = new Date(timeValue as string);

  // Check for Invalid Date
  if (isNaN(date.getTime())) {
    console.warn('[Migration] Invalid time string, using current timestamp instead:', timeValue);
    return Date.now();
  }

  return date.getTime();
};

// Migrate transactions table to UUID v7 schema
const migrateToUuidV7 = (): void => {
  if (!db) return;

  const dbPath = getDbPath();

  console.log('[Migration] Starting migration to UUID v7...');

  // Step 0: Create backup before migration
  console.log('[Migration] Step 0: Creating database backup...');
  const backupPath = createDatabaseBackup(dbPath);

  try {
    // Step 1: Verify categories and accounts exist
    console.log('[Migration] Step 1: Verifying categories and accounts...');
    verifyCategoriesAndAccounts();

    // Step 2: Create temporary table with new schema
    console.log('[Migration] Step 2: Creating temporary table...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions_new (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        categoryId INTEGER NOT NULL,
        accountId INTEGER NOT NULL,
        amount REAL NOT NULL,
        time TEXT NOT NULL
      )
    `);
    console.log('[Migration] Step 2: Temporary table created');

    // Step 3: Get existing categories and accounts to create mapping
    console.log('[Migration] Step 3: Building category and account mappings...');
    const categories = db.prepare('SELECT id, name FROM categories').all() as Array<{
      id: number;
      name: string;
    }>;
    const accounts = db.prepare('SELECT id, name FROM accounts').all() as Array<{
      id: number;
      name: string;
    }>;

    // Create lookup maps (case-insensitive for category/account names)
    const categoryMap = new Map<string, number>();
    const accountMap = new Map<string, number>();

    categories.forEach((c) => categoryMap.set(c.name.toLowerCase(), c.id));
    accounts.forEach((a) => accountMap.set(a.name.toLowerCase(), a.id));

    // Get all old transactions
    const oldTransactions = db.prepare('SELECT * FROM transactions').all() as DbRow[];

    console.log(`[Migration] Found ${oldTransactions.length} transactions to migrate`);

    // Step 4: Insert each transaction with UUID v7 using transaction for rollback support
    console.log('[Migration] Step 4: Migrating transactions...');

    const insertStmt = db!.prepare(`
      INSERT INTO transactions_new (id, name, description, categoryId, accountId, amount, time)
      VALUES (@id, @name, @description, @categoryId, @accountId, @amount, @time)
    `);

    // Use transaction with proper rollback on error
    const migrationTransaction = db!.transaction((transactions: DbRow[]) => {
      for (const t of transactions) {
        const categoryName = (t.category as string).toLowerCase();
        const accountName = (t.account as string).toLowerCase();

        // Get categoryId (use first category if not found)
        let categoryId = categoryMap.get(categoryName);
        if (categoryId === undefined && categories.length > 0) {
          categoryId = categories[0].id;
        } else if (categoryId === undefined) {
          throw new Error(
            'No categories available for migration. Please ensure at least 1 category exists.'
          );
        }

        // Get accountId (use first account if not found)
        let accountId = accountMap.get(accountName);
        if (accountId === undefined && accounts.length > 0) {
          accountId = accounts[0].id;
        } else if (accountId === undefined) {
          throw new Error(
            'No accounts available for migration. Please ensure at least 1 account exists.'
          );
        }

        // Convert amount from INTEGER to REAL
        const amount = (t.amount as number) / 100; // Convert from cents to actual amount

        // Convert time to ISO 8601 UTC string
        const timeMs = validateAndConvertTime(t.time);
        const time = new Date(timeMs).toISOString();

        // Generate UUID v7
        const id = uuidv7();

        insertStmt.run({
          id,
          name: t.name,
          description: t.description ?? null,
          categoryId,
          accountId,
          amount,
          time
        });
      }
    });

    migrationTransaction(oldTransactions);
    console.log('[Migration] Step 4: Transactions migrated successfully');

    // Step 5: Drop old table and rename new table
    console.log('[Migration] Step 5: Replacing old table with new table...');
    db.exec('DROP TABLE IF EXISTS transactions');
    db.exec('ALTER TABLE transactions_new RENAME TO transactions');
    console.log('[Migration] Step 5: Table replaced successfully');

    // Step 6: Mark migration as completed
    console.log('[Migration] Step 6: Marking migration as completed...');
    setMigrationVersion(db, MIGRATION_VERSION);
    console.log('[Migration] Step 6: Migration version set');

    console.log('[Migration] Migration to UUID v7 completed successfully');
  } catch (error) {
    console.error('[Migration] Error during migration:', error);

    // Rollback: Drop temporary table if it exists
    console.log('[Migration] Rolling back: dropping temporary table...');
    try {
      db!.exec('DROP TABLE IF EXISTS transactions_new');
      console.log('[Migration] Rollback completed');
    } catch (rollbackError) {
      console.error('[Migration] Error during rollback:', rollbackError);
    }

    // Restore backup if migration failed
    if (backupPath && existsSync(backupPath)) {
      try {
        // Close current database connection first
        db!.close();
        db = null;

        // Remove failed database file
        unlinkSync(dbPath);

        // Restore from backup
        copyFileSync(backupPath, dbPath);
        console.log('[Migration] Database restored from backup due to migration failure');

        // Reinitialize database
        db = new Database(dbPath);
        db.pragma('foreign_keys = ON');

        // Re-register custom functions and indexes after restore

        createTransactionIndexes();
      } catch (restoreError) {
        console.error('[Migration] Error restoring database from backup:', restoreError);
      }
    }

    throw error;
  }
};

// Migrate time columns to ISO 8601 UTC strings
const migrateTimeToIsoUtc = (): void => {
  if (!db) return;
  try {
    console.log('[Migration] Converting transaction times to ISO 8601 UTC strings...');
    // Convert numeric timestamps (ms) to ISO strings in UTC
    db.exec(`
      UPDATE transactions
      SET time = strftime('%Y-%m-%dT%H:%M:%fZ', time / 1000.0, 'unixepoch')
      WHERE typeof(time) = 'integer' OR typeof(time) = 'real'
    `);
    console.log('[Migration] Time conversion completed');
  } catch (error) {
    console.error('[Migration] Error converting times to ISO UTC:', error);
    throw error;
  }
};

// Create indexes for transactions table for query performance
const createTransactionIndexes = (): void => {
  if (!db) return;

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_transactions_categoryId ON transactions(categoryId);
    CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions(accountId);
    CREATE INDEX IF NOT EXISTS idx_transactions_time ON transactions(time DESC);
    CREATE INDEX IF NOT EXISTS idx_transactions_category_time ON transactions(categoryId, time DESC);
  `);

  console.log('[Database] Transaction indexes created successfully');
};

export const getDbPath = (): string => {
  return join(app.getPath('userData'), 'sora-piggy.db');
};

export const initDb = (): Database.Database => {
  if (db) return db;

  const dbPath = getDbPath();
  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables with new schema (UUID v7)
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      categoryId INTEGER NOT NULL,
      accountId INTEGER NOT NULL,
      amount REAL NOT NULL,
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

  // Check current migration version
  const currentVersion = getMigrationVersion(db);
  console.log(`[Database] Current migration version: ${currentVersion}`);

  if (currentVersion < MIGRATION_VERSION) {
    console.log('[Migration] Applying pending migrations...');

    // If UUID migration is needed, run it first
    if (needsUuidMigration(db)) {
      migrateToUuidV7();
    }

    // Ensure times are stored as ISO 8601 UTC strings
    migrateTimeToIsoUtc();

    // Mark migration as completed
    setMigrationVersion(db, MIGRATION_VERSION);
    console.log('[Migration] All migrations applied, version set to', MIGRATION_VERSION);
  } else {
    console.log('[Database] Migration already completed, skipping');
  }

  // Create indexes for query performance
  createTransactionIndexes();

  // Register custom functions for search

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
  const rows = stmt.all() as DbRow[];
  return rows as ITransaction[];
};

export const getTransactionById = (id: string): ITransaction | undefined => {
  if (!db) initDb();
  const stmt = db!.prepare('SELECT * FROM transactions WHERE id = ?');
  const row = stmt.get(id) as DbRow | undefined;
  if (!row) return undefined;
  return row as ITransaction;
};

export const addTransaction = (transaction: Omit<ITransaction, 'id'>): string => {
  if (!db) initDb();
  // Generate UUID v7 for new transaction
  const id = uuidv7();
  const stmt = db!.prepare(
    'INSERT INTO transactions (id, name, description, categoryId, accountId, amount, time) VALUES (@id, @name, @description, @categoryId, @accountId, @amount, @time)'
  );
  const timeValue =
    typeof transaction.time === 'number'
      ? new Date(transaction.time).toISOString()
      : transaction.time ?? new Date().toISOString();
  stmt.run({
    id,
    name: transaction.name,
    description: transaction.description ?? null,
    categoryId: transaction.categoryId,
    accountId: transaction.accountId,
    amount: transaction.amount,
    time: timeValue
  });
  return id;
};

export const updateTransaction = (id: string, transaction: Partial<ITransaction>): void => {
  if (!db) initDb();
  const stmt = db!.prepare(
    'UPDATE transactions SET name = @name, description = @description, categoryId = @categoryId, accountId = @accountId, amount = @amount, time = @time WHERE id = @id'
  );
  const timeValue =
    transaction.time === undefined || transaction.time === null
      ? undefined
      : typeof transaction.time === 'number'
      ? new Date(transaction.time).toISOString()
      : transaction.time;
  stmt.run({
    id,
    name: transaction.name,
    description: transaction.description ?? null,
    categoryId: transaction.categoryId,
    accountId: transaction.accountId,
    amount: transaction.amount,
    time: timeValue
  });
};

export const deleteTransaction = (id: string): void => {
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

// CRUD Operations for Categories (with full details)
export interface ICategory {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

export interface IAccount {
  id: number;
  name: string;
  type: 'cash' | 'bank';
  balance?: number;
}

/**
 * Get all categories with full details
 */
export const getAllCategories = (): ICategory[] => {
  if (!db) initDb();
  const stmt = db!.prepare('SELECT id, name, type, icon, color FROM categories ORDER BY name');
  return stmt.all() as ICategory[];
};

/**
 * Get all accounts with full details
 */
export const getAllAccounts = (): IAccount[] => {
  if (!db) initDb();
  const stmt = db!.prepare('SELECT id, name, type, balance FROM accounts ORDER BY name');
  return stmt.all() as IAccount[];
};

/**
 * Get paginated transactions with filters
 *
 * @param filters - Filter parameters including pagination
 * @returns Paginated transactions with summary
 */
export const getTransactionsPaginated = (
  filters: TransactionFilterParams
): PaginatedTransactions => {
  if (!db) initDb();

  // Set defaults for undefined values
  const searchTerm = filters.name ?? '';
  const searchTermNoDiacritics = searchTerm ? removeDiacritics(searchTerm) : '';
  const categoryId = filters.categoryId ?? null;
  const accountId = filters.accountId ?? null;
  let startTime = filters.startTime ?? null;
  let endTime = filters.endTime ?? null;
  // Accept numeric timestamps (ms) or ISO strings — normalize numeric to ISO UTC strings
  if (typeof startTime === 'number') startTime = new Date(startTime).toISOString();
  if (typeof endTime === 'number') endTime = new Date(endTime).toISOString();
  const sortBy = filters.sortBy ?? 'newest';
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 10));

  const offset = (page - 1) * pageSize;

  try {
    // Main query with JOINs for category and account names
    // Using JavaScript-preprocessed search term instead of SQL function
    const dataQuery = `
      SELECT
        t.id,
        t.name,
        t.description,
        t.categoryId,
        c.name as categoryName,
        t.accountId,
        a.name as accountName,
        t.amount,
        t.time
      FROM transactions t
      LEFT JOIN categories c ON t.categoryId = c.id
      LEFT JOIN accounts a ON t.accountId = a.id
      WHERE
        (:name IS NULL OR :name = '' OR LOWER(t.name) LIKE '%' || LOWER(:name) || '%' OR LOWER(t.name) LIKE '%' || LOWER(:nameNoDiacritics) || '%')
        AND (:categoryId IS NULL OR t.categoryId = :categoryId)
        AND (:accountId IS NULL OR t.accountId = :accountId)
        AND (:startTime IS NULL OR t.time >= :startTime)
        AND (:endTime IS NULL OR t.time <= :endTime)
      ORDER BY
        CASE WHEN :sortBy = 'newest' THEN t.time END DESC,
        CASE WHEN :sortBy = 'oldest' THEN t.time END ASC
      LIMIT :pageSize OFFSET :offset
    `;

    const dataStmt = db!.prepare(dataQuery);
    const data = dataStmt.all({
      name: searchTerm,
      nameNoDiacritics: searchTermNoDiacritics,
      categoryId,
      accountId,
      startTime,
      endTime,
      sortBy,
      pageSize,
      offset
    }) as ITransaction[];

    // Count total records matching filter
    const countQuery = `
      SELECT COUNT(*) as total
      FROM transactions t
      WHERE
        (:name IS NULL OR :name = '' OR LOWER(t.name) LIKE '%' || LOWER(:name) || '%' OR LOWER(t.name) LIKE '%' || LOWER(:nameNoDiacritics) || '%')
        AND (:categoryId IS NULL OR t.categoryId = :categoryId)
        AND (:accountId IS NULL OR t.accountId = :accountId)
        AND (:startTime IS NULL OR t.time >= :startTime)
        AND (:endTime IS NULL OR t.time <= :endTime)
    `;

    const countStmt = db!.prepare(countQuery);
    const countResult = countStmt.get({
      name: searchTerm,
      nameNoDiacritics: searchTermNoDiacritics,
      categoryId,
      accountId,
      startTime,
      endTime
    }) as { total: number };
    const total = countResult.total;

    // Summary query: Total Income (amount > 0)
    const incomeQuery = `
      SELECT COALESCE(SUM(t.amount), 0) as totalIncome
      FROM transactions t
      WHERE
        (:name IS NULL OR :name = '' OR LOWER(t.name) LIKE '%' || LOWER(:name) || '%' OR LOWER(t.name) LIKE '%' || LOWER(:nameNoDiacritics) || '%')
        AND (:categoryId IS NULL OR t.categoryId = :categoryId)
        AND (:accountId IS NULL OR t.accountId = :accountId)
        AND (:startTime IS NULL OR t.time >= :startTime)
        AND (:endTime IS NULL OR t.time <= :endTime)
        AND t.amount > 0
    `;

    const incomeStmt = db!.prepare(incomeQuery);
    const incomeResult = incomeStmt.get({
      name: searchTerm,
      nameNoDiacritics: searchTermNoDiacritics,
      categoryId,
      accountId,
      startTime,
      endTime
    }) as { totalIncome: number };
    const totalIncome = incomeResult.totalIncome;

    // Summary query: Total Expense (amount < 0)
    const expenseQuery = `
      SELECT COALESCE(SUM(ABS(t.amount)), 0) as totalExpense
      FROM transactions t
      WHERE
        (:name IS NULL OR :name = '' OR LOWER(t.name) LIKE '%' || LOWER(:name) || '%' OR LOWER(t.name) LIKE '%' || LOWER(:nameNoDiacritics) || '%')
        AND (:categoryId IS NULL OR t.categoryId = :categoryId)
        AND (:accountId IS NULL OR t.accountId = :accountId)
        AND (:startTime IS NULL OR t.time >= :startTime)
        AND (:endTime IS NULL OR t.time <= :endTime)
        AND t.amount < 0
    `;

    const expenseStmt = db!.prepare(expenseQuery);
    const expenseResult = expenseStmt.get({
      name: searchTerm,
      nameNoDiacritics: searchTermNoDiacritics,
      categoryId,
      accountId,
      startTime,
      endTime
    }) as { totalExpense: number };
    const totalExpense = expenseResult.totalExpense;

    // Calculate total pages
    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
      summary: {
        totalIncome,
        totalExpense
      }
    };
  } catch (error) {
    console.error('[Database] Error fetching paginated transactions:', error);
    // Return empty result on error
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      summary: {
        totalIncome: 0,
        totalExpense: 0
      }
    };
  }
};
