# Quickstart: Language Switching Feature

## Prerequisites

- Existing Sora Piggy application with Vue 3 + TypeScript setup
- SQLite database with existing tables (transactions, categories, accounts)
- Electron application structure with main process and renderer

## Implementation Steps

### Step 1: Database Migration

Add new tables to the SQLite database:

1. Open `src/main/database.ts`
2. Add table creation for `languages` and `user_preferences`
3. Seed initial language data (Vietnamese and English)

### Step 2: Main Process IPC Handlers

Add IPC handlers in `src/main/index.ts`:

1. `getLanguages()` - Returns all available languages
2. `getLanguagePreference(userId)` - Returns user's language preference
3. `setLanguagePreference(userId, languageCode)` - Saves user's language selection

### Step 3: Preload Script Update

Expose new APIs in `src/preload/index.ts`:

```typescript
contextBridge.exposeInMainWorld('api', {
  getLanguages: () => ipcRenderer.invoke('db:getLanguages'),
  getLanguagePreference: (userId: string) => ipcRenderer.invoke('db:getLanguagePreference', userId),
  setLanguagePreference: (userId: string, language: string) => ipcRenderer.invoke('db:setLanguagePreference', userId, language)
})
```

### Step 4: Pinia Store

Create or extend `src/renderer/src/stores/language.ts`:

```typescript
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languages: [] as Language[],
    currentLanguage: 'vi' as string,
    isLoading: false
  }),
  actions: {
    async loadLanguages() { /* ... */ },
    async loadPreference() { /* ... */ },
    async setLanguage(code: string) { /* ... */ }
  }
})
```

### Step 5: Language Selector Component

Create `src/renderer/src/components/LanguageSelector.vue`:

- Use Element Plus `el-select` component
- Populate options from `languageStore.languages`
- Emit change event on selection
- Position in TopNav (top-right corner)

### Step 6: Integration with TopNav

Update `src/renderer/src/layouts/TopNav.vue`:

1. Import LanguageSelector component
2. Import languageStore
3. Position selector in top-right area
4. Call `languageStore.loadLanguages()` on mount
5. Call `languageStore.loadPreference()` on mount

### Step 7: Default Language Fallback

Implement graceful error handling:

1. Wrap database calls in try-catch
2. On failure, use hardcoded fallback languages
3. Log errors to console for debugging
4. Display default Vietnamese interface

## Testing Checklist

- [ ] Language selector appears in TopNav
- [ ] Clicking selector shows available languages
- [ ] Selecting a language updates interface immediately
- [ ] Language preference persists after app restart
- [ ] Default to Vietnamese on fresh install
- [ ] Graceful fallback when database is unavailable
- [ ] TypeScript type checking passes
- [ ] ESLint passes with no errors
- [ ] Code formatting with Prettier

## Rollback Plan

If issues arise:

1. Revert database migration (drop new tables)
2. Remove IPC handlers from main process
3. Remove preload script additions
4. Remove Pinia store
5. Remove LanguageSelector component
6. Revert TopNav modifications
