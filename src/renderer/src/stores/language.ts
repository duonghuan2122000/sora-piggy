import { defineStore } from 'pinia';
import { Language } from '@renderer/types/language';
import i18n from '@renderer/locales';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languages: [] as Language[],
    currentLanguage: 'vi' as string,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    currentLanguageObject: (state): Language | undefined => {
      return state.languages.find((lang) => lang.code === state.currentLanguage);
    },

    availableLanguages: (state): Language[] => {
      return state.languages;
    }
  },

  actions: {
    async loadLanguages() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await window.api.getLanguages();
        this.languages = response as Language[];
      } catch (err) {
        console.error('Failed to load languages:', err);
        this.error = 'Failed to load languages';
        // Fallback to hardcoded languages
        this.languages = [
          { id: 1, code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese', order: 1 },
          { id: 2, code: 'en', name: 'English', nameEn: 'English', order: 2 }
        ];
      } finally {
        this.isLoading = false;
      }
    },

    async loadPreference() {
      this.isLoading = true;
      this.error = null;
      try {
        // Generate a simple device/user identifier
        // For local-first app, we can use a simple identifier
        const userId = 'default-user';
        const preference = await window.api.getLanguagePreference(userId);
        if (preference) {
          this.currentLanguage = preference;
        } else {
          // Default to Vietnamese
          this.currentLanguage = 'vi';
        }

        // Ensure i18n global locale is in sync with preference
        try {
          // `i18n` is imported at module top and refers to the app i18n instance
          // @ts-ignore
          i18n.global.locale.value = this.currentLanguage as any;
        } catch (e) {
          // ignore if i18n not available
          console.warn('Could not sync i18n locale after loading preference', e);
        }
      } catch (err) {
        console.error('Failed to load language preference:', err);
        this.error = 'Failed to load language preference';
        // Default to Vietnamese on error
        this.currentLanguage = 'vi';

        try {
          // @ts-ignore
          i18n.global.locale.value = this.currentLanguage as any;
        } catch (e) {
          // ignore
        }
      } finally {
        this.isLoading = false;
      }
    },

    async setLanguage(code: string) {
      this.isLoading = true;
      this.error = null;
      try {
        // Generate a simple device/user identifier
        const userId = 'default-user';
        await window.api.setLanguagePreference(userId, code);
        this.currentLanguage = code;

        // Update i18n locale using the imported instance
        i18n.global.locale.value = code as any;
      } catch (err) {
        console.error('Failed to set language preference:', err);
        this.error = 'Failed to save language preference';
        // Still update local state
        this.currentLanguage = code;
        // Attempt to update locale even on error to keep UI in sync
        i18n.global.locale.value = code as any;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
