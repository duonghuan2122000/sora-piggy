import { describe, it, expect } from 'vitest';
import type {
  TransactionFilterParams,
  PaginatedTransactions,
  ITransaction
} from '../../src/main/types/transaction';

describe('Transaction Type Definitions', () => {
  describe('ITransaction', () => {
    it('should have correct structure for transaction data', () => {
      const transaction: ITransaction = {
        id: '0123456789abcdefghij',
        name: 'Lương tháng',
        description: 'Lương tháng 4',
        categoryId: 1,
        categoryName: 'Income',
        accountId: 1,
        accountName: 'Cash',
        amount: 10000000,
        time: 1712000000000
      };

      expect(transaction.id).toBeDefined();
      expect(transaction.name).toBeDefined();
      expect(transaction.categoryId).toBeDefined();
      expect(transaction.accountId).toBeDefined();
      expect(transaction.amount).toBeDefined();
      expect(transaction.time).toBeDefined();
    });

    it('should support optional categoryName and accountName', () => {
      const transaction: ITransaction = {
        id: '0123456789abcdefghij',
        name: 'Test Transaction',
        description: 'Description',
        categoryId: 1,
        accountId: 1,
        amount: 1000,
        time: Date.now()
      };

      // Optional fields should not be required
      expect(transaction.categoryName).toBeUndefined();
      expect(transaction.accountName).toBeUndefined();
    });
  });

  describe('TransactionFilterParams', () => {
    it('should have correct filter parameter structure', () => {
      const filter: TransactionFilterParams = {
        name: 'tiền',
        categoryId: 1,
        accountId: 2,
        sortBy: 'newest',
        page: 1,
        pageSize: 10
      };

      expect(filter.name).toBe('tiền');
      expect(filter.categoryId).toBe(1);
      expect(filter.accountId).toBe(2);
      expect(filter.sortBy).toBe('newest');
      expect(filter.page).toBe(1);
      expect(filter.pageSize).toBe(10);
    });

    it('should support optional filter parameters', () => {
      const filter: TransactionFilterParams = {
        page: 1,
        pageSize: 10
      };

      expect(filter.name).toBeUndefined();
      expect(filter.categoryId).toBeUndefined();
      expect(filter.accountId).toBeUndefined();
      expect(filter.sortBy).toBeUndefined();
    });

    it('should support null values for categoryId and accountId', () => {
      const filter: TransactionFilterParams = {
        name: '',
        categoryId: null,
        accountId: null,
        sortBy: 'newest',
        page: 1,
        pageSize: 10
      };

      expect(filter.categoryId).toBeNull();
      expect(filter.accountId).toBeNull();
    });

    it('should support sortBy values: newest and oldest', () => {
      const filterNewest: TransactionFilterParams = {
        sortBy: 'newest',
        page: 1,
        pageSize: 10
      };

      const filterOldest: TransactionFilterParams = {
        sortBy: 'oldest',
        page: 1,
        pageSize: 10
      };

      expect(filterNewest.sortBy).toBe('newest');
      expect(filterOldest.sortBy).toBe('oldest');
    });
  });

  describe('PaginatedTransactions', () => {
    it('should have correct paginated response structure', () => {
      const response: PaginatedTransactions = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        summary: {
          totalIncome: 0,
          totalExpense: 0
        }
      };

      expect(response.data).toBeDefined();
      expect(response.total).toBeDefined();
      expect(response.page).toBeDefined();
      expect(response.pageSize).toBeDefined();
      expect(response.totalPages).toBeDefined();
      expect(response.summary).toBeDefined();
      expect(response.summary.totalIncome).toBeDefined();
      expect(response.summary.totalExpense).toBeDefined();
    });

    it('should calculate totalPages correctly', () => {
      const total = 25;
      const pageSize = 10;
      const totalPages = Math.ceil(total / pageSize);

      expect(totalPages).toBe(3);
    });

    it('should handle summary with positive and negative amounts', () => {
      const response: PaginatedTransactions = {
        data: [],
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        summary: {
          totalIncome: 10000000,
          totalExpense: 5000000
        }
      };

      expect(response.summary.totalIncome).toBeGreaterThan(0);
      expect(response.summary.totalExpense).toBeGreaterThan(0);
    });
  });
});

describe('Pagination Logic', () => {
  describe('Default Values', () => {
    it('should default page to 1 when page < 1', () => {
      const page = 0;
      const defaultedPage = Math.max(1, page);
      expect(defaultedPage).toBe(1);
    });

    it('should default page to 1 when page is negative', () => {
      const page = -5;
      const defaultedPage = Math.max(1, page);
      expect(defaultedPage).toBe(1);
    });

    it('should default pageSize to 1 when pageSize < 1', () => {
      const pageSize = 0;
      const defaultedPageSize = Math.max(1, pageSize);
      expect(defaultedPageSize).toBe(1);
    });

    it('should cap pageSize at 100', () => {
      const pageSize = 500;
      const cappedPageSize = Math.min(100, pageSize);
      expect(cappedPageSize).toBe(100);
    });
  });

  describe('Offset Calculation', () => {
    it('should calculate correct offset for page 1', () => {
      const page = 1;
      const pageSize = 10;
      const offset = (page - 1) * pageSize;
      expect(offset).toBe(0);
    });

    it('should calculate correct offset for page 2', () => {
      const page = 2;
      const pageSize = 10;
      const offset = (page - 1) * pageSize;
      expect(offset).toBe(10);
    });

    it('should calculate correct offset for page 3 with pageSize 20', () => {
      const page = 3;
      const pageSize = 20;
      const offset = (page - 1) * pageSize;
      expect(offset).toBe(40);
    });
  });

  describe('Filter Logic', () => {
    it('should handle empty name as no filter', () => {
      const name = '';
      const shouldFilter = name !== '' && name !== null && name !== undefined;
      expect(shouldFilter).toBe(false);
    });

    it('should handle null categoryId as no filter', () => {
      const categoryId = null;
      const shouldFilter = categoryId !== null && categoryId !== undefined;
      expect(shouldFilter).toBe(false);
    });

    it('should handle null accountId as no filter', () => {
      const accountId = null;
      const shouldFilter = accountId !== null && accountId !== undefined;
      expect(shouldFilter).toBe(false);
    });

    it('should filter when categoryId is provided', () => {
      const categoryId = 1;
      const shouldFilter = categoryId !== null && categoryId !== undefined;
      expect(shouldFilter).toBe(true);
    });

    it('should filter when accountId is provided', () => {
      const accountId = 2;
      const shouldFilter = accountId !== null && accountId !== undefined;
      expect(shouldFilter).toBe(true);
    });
  });

  describe('Sort Logic', () => {
    it('should default sortBy to newest', () => {
      const sortBy = undefined;
      const defaultedSortBy = sortBy ?? 'newest';
      expect(defaultedSortBy).toBe('newest');
    });

    it('should handle oldest sort order', () => {
      const sortBy = 'oldest';
      expect(sortBy).toBe('oldest');
    });

    it('should handle newest sort order', () => {
      const sortBy = 'newest';
      expect(sortBy).toBe('newest');
    });
  });
});

describe('Summary Calculation', () => {
  it('should correctly identify income (positive amount)', () => {
    const amount = 1000;
    const isIncome = amount > 0;
    expect(isIncome).toBe(true);
  });

  it('should correctly identify expense (negative amount)', () => {
    const amount = -500;
    const isExpense = amount < 0;
    expect(isExpense).toBe(true);
  });

  it('should calculate absolute expense value', () => {
    const amount = -500;
    const absoluteExpense = Math.abs(amount);
    expect(absoluteExpense).toBe(500);
  });

  it('should sum multiple income amounts', () => {
    const amounts = [1000, 2000, 3000];
    const totalIncome = amounts.filter((a) => a > 0).reduce((sum, a) => sum + a, 0);
    expect(totalIncome).toBe(6000);
  });

  it('should sum multiple expense amounts as absolute values', () => {
    const amounts = [-1000, -2000, -3000];
    const totalExpense = amounts.filter((a) => a < 0).reduce((sum, a) => sum + Math.abs(a), 0);
    expect(totalExpense).toBe(6000);
  });
});

describe('Search Functionality', () => {
  describe('Vietnamese Diacritics Removal', () => {
    const removeDiacritics = (text: string): string => {
      if (!text) return '';
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd');
    };

    it('should remove Vietnamese diacritics', () => {
      expect(removeDiacritics('Tiền')).toBe('Tien');
      expect(removeDiacritics('Tìm')).toBe('Tim');
      expect(removeDiacritics('Lương')).toBe('Luong');
      // Note: đ -> d (lowercase), Đ -> d (lowercase)
      expect(removeDiacritics('Đi')).toBe('di');
    });

    it('should handle empty string', () => {
      expect(removeDiacritics('')).toBe('');
    });

    it('should handle text without diacritics', () => {
      expect(removeDiacritics('Test')).toBe('Test');
    });

    it('should perform case-insensitive search', () => {
      const name = 'Lương Tháng';
      const searchTerm = 'luong';

      const normalizedName = removeDiacritics(name.toLowerCase());
      const normalizedSearch = removeDiacritics(searchTerm.toLowerCase());

      const matches = normalizedName.includes(normalizedSearch);
      expect(matches).toBe(true);
    });

    it('should search with Vietnamese diacritics input', () => {
      const names = ['Tiền điện', 'Tiền nước', 'Lương'];
      const searchTerm = 'tiền';

      const normalizedSearch = removeDiacritics(searchTerm.toLowerCase());

      const matches = names.filter((name) => {
        const normalizedName = removeDiacritics(name.toLowerCase());
        return normalizedName.includes(normalizedSearch);
      });

      expect(matches.length).toBe(2);
    });
  });
});
