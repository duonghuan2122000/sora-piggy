import { describe, it, expect } from 'vitest';
import i18n from '../../src/renderer/src/i18n';

describe('i18n configuration (integration path for test runner)', () => {
  it('should have default locale and fallbackLocale set to vi', () => {
    // In composition API mode (legacy: false) locale and fallbackLocale are refs
    expect(i18n.global.locale.value).toBe('vi');
    expect(i18n.global.fallbackLocale.value).toBe('vi');
  });

  it('should load transactions translations', () => {
    expect(i18n.global.t('transactions.title')).toBe('Danh sách giao dịch');
  });
});
