/* eslint-disable */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'resources');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'fake-transactions.json');

const categories = [
  'Food',
  'Transport',
  'Utilities',
  'Shopping',
  'Salary',
  'Freelance',
  'Entertainment',
  'Health',
  'Education',
  'Others'
];
const accounts = ['Cash', 'Bank A', 'Bank B', 'Credit Card'];

const startDate = new Date('2026-01-13T12:00:00.000Z');

function pad(n, width) {
  return n.toString().padStart(width, '0');
}

const items = [];
for (let i = 0; i < 100; i++) {
  const idx = i + 1;
  const date = new Date(startDate);
  date.setUTCDate(startDate.getUTCDate() + i);
  const category = categories[i % categories.length];
  const account = accounts[i % accounts.length];
  const isIncome = category === 'Salary' || category === 'Freelance';

  let amount;
  if (category === 'Salary') {
    amount = 15000000 + (i % 5) * 1000000; // 15M - 19M
  } else if (category === 'Freelance') {
    amount = 1000000 + (i % 7) * 500000; // 1M - 4M
  } else {
    // expenses: vary 50k - 140k roughly
    amount = 50000 + (i % 10) * 10000;
  }

  const item = {
    id: `tx-${pad(idx, 4)}`,
    title: `${isIncome ? 'Thu' : 'Chi'}: ${category}`,
    description: `${category} - giao dịch giả #${idx}`,
    category,
    account,
    type: isIncome ? 'income' : 'expense',
    amount,
    currency: 'VND',
    time: date.toISOString()
  };
  items.push(item);
}

fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8');
console.log('Wrote', outPath);
