import { describe, it, expect } from 'vitest';
import i18n from '../../src/renderer/src/i18n';

describe('i18n configuration', () => {
  it('should have default locale and fallbackLocale set to vi', () => {
    // In vue-i18n v11 with composition API mode locale/fallbackLocale are refs
    expect(i18n.global.locale.value).toBe('vi');
    expect(i18n.global.fallbackLocale.value).toBe('vi');
  });

  it('should load transactions translations', () => {
    expect(i18n.global.t('transactions.title')).toBe('Danh sách giao dịch');
    expect(i18n.global.t('transactions.columns.date')).toBe('Ngày');
    expect(i18n.global.t('transactions.columns.amount')).toBe('Số tiền');
  });
});
