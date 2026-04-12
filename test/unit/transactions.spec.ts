/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TransactionItem from '../../src/renderer/src/components/TransactionItem.vue';

describe('TransactionItem', () => {
  it('renders name, description and formatted amount with correct classes', () => {
    const tx = {
      id: 1,
      name: 'Salary',
      description: 'Monthly salary',
      category: 'Income',
      account: 'Cash',
      amount: 15000000,
      time: new Date()
    };

    const wrapper = mount(TransactionItem as any, {
      props: { transaction: tx }
    });

    // Row wrapper
    const row = wrapper.get('[data-testid="transactions-row-1"]');
    expect(row.exists()).toBe(true);

    // Name & description
    expect(wrapper.get('[data-testid="transactions-row-name"]').text()).toBe('Salary');
    expect(wrapper.get('[data-testid="transactions-row-desc"]').text()).toBe('Monthly salary');

    // Amount should be formatted and have income class
    const amountEl = wrapper.get('[data-testid="transactions-row-amount"]');
    expect(amountEl.text()).toContain('₫');
    expect(amountEl.classes()).toContain('sora-income');
  });

  it('shows negative sign and expense class for expense transaction', () => {
    const tx = {
      id: 2,
      name: 'Groceries',
      description: 'Weekly groceries',
      category: 'Expense',
      account: 'Cash',
      amount: -250000,
      time: new Date()
    };

    const wrapper = mount(TransactionItem as any, {
      props: { transaction: tx }
    });

    // Icon should show '-'
    expect(wrapper.get('[data-testid="transactions-row-icon"]').text()).toBe('-');

    // Amount has expense class
    const amountEl = wrapper.get('[data-testid="transactions-row-amount"]');
    expect(amountEl.classes()).toContain('sora-expense');
  });
});
