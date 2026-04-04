# Bug Specification: Language Selection in Combobox Not Working

**Bug ID**: #9
**Title**: Chọn ngôn ngữ trong combobox ngôn ngữ không hoạt động (Language selection in combobox not working)
**Created**: 2026-04-04
**Status**: Draft
**Updated**: 2026-04-04 (Clarification Notes Added)

## Clarification Notes

### Technical Understanding
The issue is confirmed to be in the **renderer process** where the i18n locale change event is not being handled correctly.

- **Location**: `src/renderer/src/stores/language.ts`, specifically in the `setLanguage` action (lines 75-79).
- **Root Cause**: The current implementation attempts to access `i18n` via `window.$i18n`, but the i18n instance is not attached to the global `window` object. In `src/renderer/src/main.ts`, the i18n instance is created and installed on the Vue app via `app.use(i18n)`, which does not attach it to `window`.
- **Impact**: The locale update is never applied, so UI components relying on `vue-i18n`'s reactive locale do not re-render with the new language strings.

### Scope Confirmation
- **Affected Scope**: UI language updates only. The fix involves updating the reactive `i18n.global.locale.value` to trigger UI re-renders.
- **Not Affected**: Database storage of language preferences. The `window.api.setLanguagePreference` call in the store correctly saves the preference to the database, and this logic remains unchanged.

## Problem Statement

When a user selects a language in the language combobox located in the TopNav (package screen), the application screens do not update to reflect the selected language. The UI remains in the previously selected language despite the combobox selection changing.

## Root Cause Analysis

The issue is located in `src/renderer/src/stores/language.ts`, specifically in the `setLanguage` action.

**Current Implementation (Buggy):**
```typescript
// language.ts (lines 75-79)
const i18n = (window as { $i18n?: { global: { locale: { value: string } } } }).$i18n;
if (i18n) {
  i18n.global.locale.value = code;
}
```

**Why It Fails:**
1. The code attempts to access `window.$i18n`.
2. In `src/renderer/src/main.ts`, the i18n instance is created and installed on the Vue app via `app.use(i18n)`.
3. The i18n instance is **not** attached to the global `window` object.
4. Therefore, `window.$i18n` is `undefined`, and the locale update is never applied.
5. Consequently, the UI components (which rely on `vue-i18n`'s reactive locale) do not re-render with the new language strings.

## Scope of Affected Components

The bug affects all UI components that use `vue-i18n` translations:

1. **TopNav Layout** (`src/renderer/src/layouts/TopNav.vue`):
   - Uses `LanguageSelector` component.
   - Page title prop might need translation updates.

2. **Transaction Add Screen** (`src/renderer/src/views/transactions/SoraAddTransactionView.vue`):
   - Uses `$t()` for form labels, placeholders, and validation messages.
   - Does not update when language changes.

3. **Sidebar** (Implied by "package screen" and layouts):
   - Likely contains translated text that doesn't update.

4. **Other Views** (Home, Budget, Goals, Reports, Settings, About):
   - All use translations and will fail to update.

## Technical Requirements for Fix

1. **Import i18n Instance**:
   - Modify `src/renderer/src/stores/language.ts`.
   - Import the default export from `@renderer/locales`.

2. **Update Locale Directly**:
   - Replace the `window.$i18n` access with the imported i18n instance.
   - Update `i18n.global.locale.value` directly.

3. **Maintain Existing Logic**:
   - Keep the database preference save logic (`window.api.setLanguagePreference`).
   - Keep the local state update (`this.currentLanguage = code`).

## Proposed Code Change

**File**: `src/renderer/src/stores/language.ts`

**Current Implementation (Buggy):**
```typescript
// language.ts (lines 66-88)
async setLanguage(code: string) {
  this.isLoading = true;
  this.error = null;
  try {
    const userId = 'default-user';
    await window.api.setLanguagePreference(userId, code);
    this.currentLanguage = code;

    // Update i18n locale
    const i18n = (window as { $i18n?: { global: { locale: { value: string } } } }).$i18n;
    if (i18n) {
      i18n.global.locale.value = code;
    }
  } catch (err) {
    console.error('Failed to set language preference:', err);
    this.error = 'Failed to save language preference';
    // Still update local state
    this.currentLanguage = code;
  } finally {
    this.isLoading = false;
  }
}
```

**Fixed Implementation:**
```typescript
import { defineStore } from 'pinia';
import { Language } from '@renderer/types/language';
import i18n from '@renderer/locales'; // Import the i18n instance directly

export const useLanguageStore = defineStore('language', {
  // ... existing state and getters ...

  actions: {
    // ... existing actions ...

    async setLanguage(code: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const userId = 'default-user';
        await window.api.setLanguagePreference(userId, code);
        this.currentLanguage = code;

        // Update i18n locale using the imported instance
        i18n.global.locale.value = code;
      } catch (err) {
        console.error('Failed to set language preference:', err);
        this.error = 'Failed to save language preference';
        // Still update local state
        this.currentLanguage = code;
        // Attempt to update locale even on error to keep UI in sync
        i18n.global.locale.value = code;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
```

## Acceptance Criteria

### Specific Test Cases

1. **English Selection → Sidebar Updates**:
   - **Given** the application is running and the current language is Vietnamese,
   - **When** the user selects "English" from the TopNav language combobox,
   - **Then** the sidebar navigation text (e.g., "Home", "Transactions", "Budget") updates immediately to English.

2. **Vietnamese Selection → Sidebar Updates**:
   - **Given** the application is running and the current language is English,
   - **When** the user selects "Tiếng Việt" from the TopNav language combobox,
   - **Then** the sidebar navigation text (e.g., "Trang chủ", "Giao dịch", "Ngân sách") updates immediately to Vietnamese.

3. **English Selection → Transaction Add Screen Updates**:
   - **Given** the user is on the "Add Transaction" screen and the current language is Vietnamese,
   - **When** the user selects "English" from the TopNav language combobox,
   - **Then** all form labels, placeholders, and validation messages on the "Add Transaction" screen update immediately to English (e.g., "Name" placeholder updates to "Enter transaction name").

4. **Vietnamese Selection → Transaction Add Screen Updates**:
   - **Given** the user is on the "Add Transaction" screen and the current language is English,
   - **When** the user selects "Tiếng Việt" from the TopNav language combobox,
   - **Then** all form labels, placeholders, and validation messages on the "Add Transaction" screen update immediately to Vietnamese (e.g., "Name" placeholder updates to "Nhập tên giao dịch").

### General Criteria

5. **Language Selection Updates UI**:
   - Given the application is running,
   - When the user selects a different language in the TopNav combobox,
   - Then all visible text (titles, labels, placeholders, buttons) updates immediately to the selected language.

6. **Persistence**:
   - Given the user changes the language,
   - When the application restarts,
   - Then the previously selected language is loaded and applied.

## Notes

- The `LanguageSelector` component already correctly updates the Pinia store via `languageStore.setLanguage(value)`.
- The store correctly saves the preference to the database.
- The only missing piece is the reactive update of the `vue-i18n` instance.
- This fix aligns with standard Vue 3 + vue-i18n Composition API usage patterns.

## Technical Solution Plan

### 1. Root Cause Analysis
The bug is confirmed to be in the `setLanguage` action within `src/renderer/src/stores/language.ts`.
- **Current Logic**: The code attempts to access `i18n` via `window.$i18n`.
- **Failure Point**: In `src/renderer/src/main.ts`, the i18n instance is created and installed on the Vue app (`app.use(i18n)`), but it is **not** attached to the global `window` object.
- **Result**: `window.$i18n` is undefined, the locale update is skipped, and UI components relying on `vue-i18n`'s reactive locale do not re-render.

### 2. Solution Architecture
Directly import the i18n instance into the Pinia store and update its locale value reactively.
- **Approach**: Import the default export from `@renderer/locales` (the i18n instance) directly into `language.ts`.
- **Mechanism**: Update `i18n.global.locale.value` immediately after the language preference is saved to the database.
- **Separation of Concerns**: Keep database logic (`window.api`) separate from UI state management (`i18n`).

### 3. Files to Modify
1.  **`src/renderer/src/stores/language.ts`**:
    -   Add import: `import i18n from '@renderer/locales';`
    -   Modify `setLanguage` action to use the imported instance.

### 4. Implementation Steps
1.  **Import i18n Instance**:
    -   Open `src/renderer/src/stores/language.ts`.
    -   Add `import i18n from '@renderer/locales';` at the top of the file.

2.  **Update `setLanguage` Action**:
    -   Locate the `setLanguage` action (lines 66-88).
    -   Remove the buggy `window.$i18n` access logic (lines 75-79).
    -   Replace it with direct access to the imported instance:
        ```typescript
        // Update i18n locale using the imported instance
        i18n.global.locale.value = code;
        ```
    -   Ensure this update happens in both the `try` block (after saving to DB) and the `catch` block (to keep UI in sync even if DB save fails).

3.  **Clean Up**:
    -   Verify no other files rely on `window.$i18n` for language changes (unlikely based on current analysis).

### 5. Verification & Testing
After applying the fix, verify the following scenarios:
1.  **Sidebar Update**: Selecting a language in the TopNav combobox should immediately update the sidebar navigation text (e.g., "Home" <-> "Trang chủ").
2.  **Transaction Screen Update**: While on the "Add Transaction" screen, changing the language should update all form labels, placeholders, and validation messages immediately.
3.  **Persistence**: Restart the application and verify it loads the previously selected language.
