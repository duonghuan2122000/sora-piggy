import { createI18n } from 'vue-i18n';
import vi from '@renderer/locales/vi.json';

// Central i18n instance used by the renderer app
// Configured for vue-i18n v11+ runtime API (composition mode)
const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'vi',
  messages: {
    vi
  }
});

export default i18n;
