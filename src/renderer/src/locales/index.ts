// Re-export the centralized i18n instance and messages.
// Keeping this file so existing imports from '@renderer/locales' continue to work.
import i18n from '../i18n';
import vi from './vi.json';
import en from './en.json';

// Default export: i18n instance to be used by app
// Named export `messages` provides direct access to raw locale messages if other modules expected it
export default i18n;
export const messages = { vi, en };
