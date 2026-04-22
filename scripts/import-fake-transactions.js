/* eslint-disable */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { v7: uuidv7 } = require('uuid');

const appData = process.env.APPDATA || process.env.HOME || process.env.USERPROFILE;
const dbPath = path.join(appData, 'Sora Piggy', 'sora-piggy.db');
const fakePath = path.join(__dirname, '..', 'resources', 'fake-transactions.json');

if (!fs.existsSync(fakePath)) {
  console.error('Fake transactions file not found:', fakePath);
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(fakePath, 'utf8'));
const db = new Database(dbPath);

// Ensure tables exist (simple safe-create)
db.exec(`
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
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  categoryId INTEGER NOT NULL,
  accountId INTEGER NOT NULL,
  amount REAL NOT NULL,
  time TEXT NOT NULL
);
`);

// Build lookup maps
const categories = db.prepare('SELECT id, name FROM categories').all();
const accounts = db.prepare('SELECT id, name FROM accounts').all();
const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));
const accountMap = new Map(accounts.map((a) => [a.name.toLowerCase(), a.id]));

const insertCategoryStmt = db.prepare('INSERT INTO categories (name, type) VALUES (@name, @type)');
const insertAccountStmt = db.prepare(
  'INSERT INTO accounts (name, type, balance) VALUES (@name, @type, @balance)'
);

const insertTransactionStmt = db.prepare(
  'INSERT INTO transactions (id, name, description, categoryId, accountId, amount, time) VALUES (@id, @name, @description, @categoryId, @accountId, @amount, @time)'
);

const insertAll = db.transaction((txs) => {
  for (const t of txs) {
    const catName = (t.category || 'Others').toString().toLowerCase();
    const accName = (t.account || 'Cash').toString().toLowerCase();

    let categoryId = categoryMap.get(catName);
    if (categoryId === undefined) {
      const info = insertCategoryStmt.run({
        name: t.category || 'Others',
        type: t.type === 'income' ? 'income' : 'expense'
      });
      categoryId = info.lastInsertRowid;
      categoryMap.set(catName, categoryId);
    }

    let accountId = accountMap.get(accName);
    if (accountId === undefined) {
      const info = insertAccountStmt.run({
        name: t.account || 'Cash',
        type: t.account && t.account.toLowerCase().includes('bank') ? 'bank' : 'cash',
        balance: 0
      });
      accountId = info.lastInsertRowid;
      accountMap.set(accName, accountId);
    }

    const id = uuidv7();
    const time = typeof t.time === 'string' ? t.time : new Date(t.time).toISOString();
    const amount = Number(t.amount) || 0;

    insertTransactionStmt.run({
      id,
      name: t.title || t.name || `Transaction ${id}`,
      description: t.description ?? null,
      categoryId,
      accountId,
      amount,
      time
    });
  }
});

try {
  insertAll(items);
  console.log(`Inserted ${items.length} transactions into ${dbPath}`);
} catch (err) {
  console.error('Error inserting transactions:', err);
  process.exit(1);
} finally {
  db.close();
}
