import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Transactions view i18n integration (static checks)', () => {
  it('should contain data-testid selectors for columns and empty state', () => {
    const filePath = path.resolve(
      __dirname,
      '../../src/renderer/src/views/transactions/SoraTransactionView.vue'
    );
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('data-testid="transactions-column-date"');
    expect(content).toContain('data-testid="transactions-column-amount"');
    expect(content).toContain('data-testid="transactions-empty"');
  });

  it('should use i18n keys for transaction titles and columns', () => {
    const filePath = path.resolve(
      __dirname,
      '../../src/renderer/src/views/transactions/SoraTransactionView.vue'
    );
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/t\('\w+\.title'\)/);
    expect(content).toMatch(/t\('\w+\.columns\.date'\)/);
    // Ensure table uses pagedTransactions for pagination
    expect(content).toContain(':data="pagedTransactions"');
  });
});
